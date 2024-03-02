"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePic = exports.updatePassword = exports.updateUserInfo = exports.getUser = exports.socialAuth = exports.updateAccessToken = exports.logout = exports.signin = exports.activateUser = exports.createActivationToken = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // For password hashing
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For generating JWTs
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const ErrorHandler_1 = require("../utils/ErrorHandler");
const jwt_1 = require("../utils/jwt");
const user_services_1 = require("../services/user.services");
const cloudinary_1 = require("cloudinary");
const User = require("../models/user");
exports.signup = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("in signup");
        const { name, email, password } = req.body;
        // Check for existing user
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler_1.ErrorHandler("User already exists", 400));
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const userToRegister = {
            name,
            email,
            password: hashedPassword,
        };
        const activationToken = (0, exports.createActivationToken)(userToRegister);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: userToRegister.name }, otp: activationCode };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/signup_activation.ejs"), data);
        try {
            yield (0, sendMail_1.default)({
                email: userToRegister.email,
                subject: "Activate Account",
                template: "signup_activation.ejs",
                data: data,
            });
            return res.status(201).json({
                success: true,
                message: `Please check your email ${userToRegister.email} for account Activation`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            return new ErrorHandler_1.ErrorHandler(error.message, 400);
        }
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
const createActivationToken = (user) => {
    const activationCodeNum = Math.floor(Math.random() * 9000) + 1000; // Generate a random 4-digit number
    // console.log(activationCodeNum);
    const activationCode = activationCodeNum.toString(); // Convert to string
    const token = jsonwebtoken_1.default.sign({ user: user, activationCode }, process.env.JWT_ACTIVATION_SECRET, { expiresIn: "5m" }); //Expires in one hour
    return { token, activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { activation_token, activation_code } = req.body;
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.JWT_ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid Activation Code", 400));
        }
        const { name, email, password } = newUser.user;
        const existingUser = yield User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler_1.ErrorHandler("User already exists", 400));
        }
        const user = yield User.create({
            name,
            email,
            password,
        });
        return res.status(200).json({
            success: "true",
            message: "Account created successfully!",
        });
    }
    catch (error) {
        return new ErrorHandler_1.ErrorHandler(error.message, 400);
    }
})); //2.46
exports.signin = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.ErrorHandler("Please provide an email and a password", 400));
        }
        const user = yield User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid email or password", 400));
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
        return new ErrorHandler_1.ErrorHandler(err.message, 400);
    }
}));
exports.logout = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
        // redis.del(userId);
        res
            .status(200)
            .json({ success: true, message: "Logged out successfully!" });
    }
    catch (error) {
        return new ErrorHandler_1.ErrorHandler(error.message, 400);
    }
}));
//update access token
exports.updateAccessToken = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler_1.ErrorHandler("Not authenticated!", 400));
        }
        const decoded = jsonwebtoken_1.default.verify(refresh_token, (_b = process.env) === null || _b === void 0 ? void 0 : _b.REFRESH_TOKEN);
        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler_1.ErrorHandler(message, 400));
        }
        const user = yield User.findById(decoded.id);
        if (!user) {
            throw new ErrorHandler_1.ErrorHandler('Invalid refresh token', 400);
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: "5m",
        });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
            expiresIn: "3d",
        });
        req.user = user;
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        return res.status(200).json({
            success: true,
            accessToken,
        });
    }
    catch (error) {
        return new ErrorHandler_1.ErrorHandler(error.message, 400);
    }
}));
//social auth
exports.socialAuth = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield User.findOne({ email });
        if (!user) {
            const password = Math.random().toString(36).slice(-16);
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = yield User.create({
                email,
                name,
                avatar,
                password: hashedPassword,
            });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
    }
    catch (error) { }
}));
exports.getUser = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { userId } = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        (0, user_services_1.getUserById)(userId, res);
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { email, name } = req.body;
        // const updates = req.body;
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        const user = yield User.findByIdAndUpdate(userId, { name, email }, { new: true });
        // // Find user
        // const user = await User.findByIdAndUpdate(userId, updates, {
        //   new: true, // Return updated document
        // });
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("User not found", 400));
        }
        if (email && user) {
            const isEmailExist = yield User.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler_1.ErrorHandler("This Email is already in use", 400));
            }
            user.email = email;
        }
        if (name && user) {
            user.name = name;
        }
        yield user.save();
        // await redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (err) {
        // // Handle password updates securely (optional)
        // if (updates.password) {
        //   const hashedPassword = await bcrypt.hash(updates.password, 10);
        //   user.password = hashedPassword;
        //   await user.save();
        // }
        // console.error(err);
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { oldPassword, newPassword } = req.body;
        const user = yield User.findById((_e = req.user) === null || _e === void 0 ? void 0 : _e._id);
        // check the current password first
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            return next(new ErrorHandler_1.ErrorHandler("Invalid old password", 400));
        }
        user.password = yield bcryptjs_1.default.hash(oldPassword, 10);
        yield user.save();
        // await redis.set(user?._id, JSON.stringify(user));
        user.password = "";
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
exports.updateProfilePic = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { avatar } = req.body;
        const userId = req.user._id;
        let user = yield User.findById(userId);
        if (!avatar || !user) {
            return next(new ErrorHandler_1.ErrorHandler("not found", 400));
        }
        console.log("checkimg avart", user.avatar);
        if ((_f = user.avatar) === null || _f === void 0 ? void 0 : _f.public_id) {
            if (user.avatar.public_id)
                cloudinary_1.v2.uploader.destroy(user.avatar.public_id);
        }
        const myCloud = yield cloudinary_1.v2.uploader.upload(avatar, {
            folder: "avatar",
            width: 150,
        });
        user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
        console.log("hrr4", user.avatar);
        yield user.save();
        // await redis.set(userId, JSON.stringify(user));
        return res.status(200).json({ success: true, data: Object.assign({}, user.avatar) });
    }
    catch (err) {
        return next(new ErrorHandler_1.ErrorHandler(err.message, 400));
    }
}));
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        yield User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
//2.03

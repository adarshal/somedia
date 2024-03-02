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
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User = require("../models/user");
// to check authenticated user.
exports.isAuthenticated = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.cookies)
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.ErrorHandler("You are not logged in", 400));
    }
    const decoded = yield jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.ErrorHandler("Invalid token", 401));
    }
    const user = yield User.findById(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.ErrorHandler("User not found", 400));
    }
    // req.user=JSON.parse(user);
    req.user = user;
    next();
}));
//validate user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        //@ts-ignore
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || '')) {
            return next(new ErrorHandler_1.ErrorHandler(`Role ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this`, 403));
            next();
        }
    };
};
exports.authorizeRoles = authorizeRoles;

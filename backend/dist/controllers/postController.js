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
exports.getFuturePosts = exports.getPublishedPosts = exports.schedulePost = exports.createPost = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const node_cron_1 = __importDefault(require("node-cron"));
const post_services_1 = require("../services/post.services");
const User = require("../models/user");
const Post = require("../models/post");
const PendingPost = require("../models/pendingPost");
exports.createPost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here in cretepost");
        const { title, description } = req.body;
        if (!title || !description) {
            return next(new ErrorHandler_1.ErrorHandler("Please provide an title and a description", 400));
        }
        const user = req.user;
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Please signin", 400));
        }
        const id = user._id;
        yield (0, post_services_1.publishPost)(id, title, description);
        return res.status(201).json({
            success: true,
            message: "post created and published",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
        return new ErrorHandler_1.ErrorHandler(err.message, 400);
    }
}));
exports.schedulePost = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("inside schedlePost");
        const { title, description, scheduledAt } = req.body;
        if (!title || !description || !scheduledAt) {
            console.log(scheduledAt);
            return next(new ErrorHandler_1.ErrorHandler("Please provide an title , a description, scheduled time", 400));
        }
        const user = req.user;
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Please signin", 400));
        }
        const authorId = user._id;
        const scheduledPost = yield PendingPost.create({
            title,
            description,
            authorId,
            scheduledAt,
        });
        const userToUpdate = yield User.findById(authorId);
        if (!userToUpdate) {
            return next(new ErrorHandler_1.ErrorHandler("user not found", 404));
        }
        userToUpdate.pendingPosts.push(scheduledPost._id);
        yield userToUpdate.save();
        return res.status(201).json({
            success: true,
            message: "post scheduled",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
        return new ErrorHandler_1.ErrorHandler(err.message, 400);
    }
}));
exports.getPublishedPosts = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here in get published posts");
        const user = req.user;
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Please signin", 400));
        }
        const id = user._id;
        const userFound = yield User.findById(id).populate("posts");
        console.log(userFound);
        const posts = yield (userFound === null || userFound === void 0 ? void 0 : userFound.posts);
        return res.status(201).json({
            success: true,
            message: "posts collected",
            posts,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
        return new ErrorHandler_1.ErrorHandler(err.message, 400);
    }
}));
exports.getFuturePosts = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here in get future/scheduled posts");
        const user = req.user;
        if (!user) {
            return next(new ErrorHandler_1.ErrorHandler("Please signin", 400));
        }
        const id = user._id;
        const userFound = yield User.findById(id).populate("pendingPosts");
        const posts = yield (userFound === null || userFound === void 0 ? void 0 : userFound.pendingPosts);
        return res.status(201).json({
            success: true,
            message: "scheduled posts collected",
            posts,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
        return new ErrorHandler_1.ErrorHandler(err.message, 400);
    }
}));
// scheduled post publication
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("in cron job");
        yield checkAndPublishPendingPosts();
    }
    catch (error) {
        console.error("Error in cron job:", error);
        // Handle errors appropriately, e.g., send notifications or try to retry
    }
}));
function checkAndPublishPendingPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const pendingPosts = yield PendingPost.find({
            scheduledAt: { $lte: Date.now() }, // Find posts scheduled at or before current time
        }); // we can Populate user data if needed here .populate(user)
        // console.log("inside check and publish cron", pendingPosts);
        for (const pendingPost of pendingPosts) {
            try {
                const id = pendingPost.authorId;
                const title = pendingPost.title;
                const description = pendingPost.description;
                const pendingId = pendingPost._id;
                yield (0, post_services_1.publishPost)(id, title, description);
                const user = yield User.findById(id);
                if (user) {
                    const updatedPendingPosts = user.pendingPosts.filter((post) => post.toString() !== pendingId);
                    user.pendingPosts = updatedPendingPosts;
                    yield user.save();
                }
                yield PendingPost.deleteOne({ _id: pendingPost._id });
                console.log("deleted pending post");
                // Delete pending post after successful publishing
            }
            catch (error) {
                // Handle errors publishing individual posts, e.g., log errors or retry
                console.log("errr publishing post", error);
            }
        }
    });
}

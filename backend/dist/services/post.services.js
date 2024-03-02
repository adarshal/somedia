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
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPost = void 0;
const ErrorHandler_1 = require("../utils/ErrorHandler");
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const Post = require("../models/post");
const User = require("../models/user");
const PendingPost = require("../models/pendingPost");
//get user by Id
exports.publishPost = (0, catchAsyncError_1.catchAsyncError)((id, title, description, pendingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post.create({
            title,
            description,
            authorId: id,
        });
        const user = yield User.findById(id);
        if (!user) {
            //send err
            return;
        }
        user.posts.push(post._id);
        yield user.save();
    }
    catch (error) {
        return new ErrorHandler_1.ErrorHandler(error.message, 400);
    }
}));

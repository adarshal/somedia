"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    // Required fields:
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //   published: {
    //     type: Boolean,
    //     default: false,
    //   },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    share: {
        type: Number,
        default: 0,
    },
    authorId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true // to know when user was created when was updated
});
;
const Post = mongoose_1.default.model('Post', PostSchema);
module.exports = Post;

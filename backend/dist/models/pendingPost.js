"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PendingPostSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    scheduledAt: {
        type: Date,
        default: Date.now(),
    },
    authorId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true // to know when user was created when was updated
});
;
const PendingPost = mongoose_1.default.model('PendingPost', PendingPostSchema);
module.exports = PendingPost;

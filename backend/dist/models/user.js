"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For generating JWTs
const UserSchema = new mongoose_1.default.Schema({
    // Required fields:
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Enforce unique emails
        lowercase: true, // Normalize email addresses to lowercase
        validate: {
            validator: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: true,
        // select:false
    },
    posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Post', // a "Post" model
        },
    ],
    pendingPosts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'PendingPost', // a "Post" model for scheduled posts
        },
    ],
    profile: {
        // Additional profile information
        firstName: String,
        lastName: String,
        phone: String,
        address: String,
        // ...other fields
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        public_id: String,
        url: String
    }
}, {
    timestamps: true // to know when user was created when was updated
});
;
UserSchema.methods.SignAcessToken = function () {
    const token = jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: process.env.EXPIRESIN || '5m', //Tem
    });
    return token;
};
UserSchema.methods.SignRefreshToken = function () {
    const token = jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: process.env.EXPIRESIN_REFRESH || '3d'
    });
    return token;
};
const User = mongoose_1.default.model('User', UserSchema);
//This is collection, collection contain docs,docs contains fields like name,date. collectn name start capital
module.exports = User;

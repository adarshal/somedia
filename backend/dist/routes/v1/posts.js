"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const postController_1 = require("../../controllers/postController");
const router = express_1.default.Router();
console.log('posts Router loaded');
router.post("/post-now", auth_1.isAuthenticated, postController_1.createPost);
router.post("/post-scheduled", auth_1.isAuthenticated, postController_1.schedulePost);
router.get("/published-posts", auth_1.isAuthenticated, postController_1.getPublishedPosts);
router.get("/future-posts", auth_1.isAuthenticated, postController_1.getFuturePosts);
module.exports = router;

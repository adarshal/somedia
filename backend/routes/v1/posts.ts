import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../../middleware/auth";
import { createPost, getFuturePosts, getPublishedPosts, schedulePost } from "../../controllers/postController";
const router = express.Router()
console.log('posts Router loaded');

router.post("/post-now", isAuthenticated,createPost);
router.post("/post-scheduled", isAuthenticated,schedulePost);
router.get("/published-posts", isAuthenticated,getPublishedPosts);
router.get("/future-posts", isAuthenticated,getFuturePosts);


module.exports= router;

import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { ErrorHandler } from "../utils/ErrorHandler";
import { getUserById } from "../services/user.services";
import cron from "node-cron";
import { publishPost } from "../services/post.services";

const User = require("../models/user");
const Post = require("../models/post");
const PendingPost = require("../models/pendingPost");

export const createPost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("here in cretepost");
      const { title, description } = req.body;
      if (!title || !description) {
        return next(
          new ErrorHandler("Please provide an title and a description", 400)
        );
      }
      const user = req.user;
      if (!user) {
        return next(new ErrorHandler("Please signin", 400));
      }
      const id = user._id;
      await publishPost(id, title, description);
      return res.status(201).json({
        success: true,
        message: "post created and published",
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
      return new ErrorHandler(err.message, 400);
    }
  }
);
export const schedulePost = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("inside schedlePost");
      const { title, description, scheduledAt } = req.body;
      if (!title || !description || !scheduledAt) {
        console.log(scheduledAt)
        return next(
          new ErrorHandler(
            "Please provide an title , a description, scheduled time",
            400
          )
        );
      }
      const user = req.user;
      if (!user) {
        return next(new ErrorHandler("Please signin", 400));
      }
      const authorId = user._id;
      const scheduledPost = await PendingPost.create({
        title,
        description,
        authorId,
        scheduledAt,
      });
      const userToUpdate = await User.findById(authorId);
      if (!userToUpdate) {
        return next(new ErrorHandler("user not found", 404));
      }
      userToUpdate.pendingPosts.push(scheduledPost._id);
      await userToUpdate.save();
      return res.status(201).json({
        success: true,
        message: "post scheduled",
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
      return new ErrorHandler(err.message, 400);
    }
  }
);

export const getPublishedPosts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("here in get published posts");
      const user = req.user;
      if (!user) {
        return next(new ErrorHandler("Please signin", 400));
      }
      const id = user._id;
      const userFound = await User.findById(id).populate("posts");
      console.log(userFound);

      const posts = await userFound?.posts;

      return res.status(201).json({
        success: true,
        message: "posts collected",
        posts,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
      return new ErrorHandler(err.message, 400);
    }
  }
);

export const getFuturePosts = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("here in get future/scheduled posts");
      const user = req.user;
      if (!user) {
        return next(new ErrorHandler("Please signin", 400));
      }
      const id = user._id;
      const userFound = await User.findById(id).populate("pendingPosts");

      const posts = await userFound?.pendingPosts;

      return res.status(201).json({
        success: true,
        message: "scheduled posts collected",
        posts,
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
      return new ErrorHandler(err.message, 400);
    }
  }
);

// scheduled post publication
cron.schedule("* * * * *", async () => {
  try {
    console.log("in cron job");
    await checkAndPublishPendingPosts();
  } catch (error) {
    console.error("Error in cron job:", error);
    // Handle errors appropriately, e.g., send notifications or try to retry
  }
});

async function checkAndPublishPendingPosts() {
  const pendingPosts = await PendingPost.find({
    scheduledAt: { $lte: Date.now() }, // Find posts scheduled at or before current time
  }); // we can Populate user data if needed here .populate(user)
  // console.log("inside check and publish cron", pendingPosts);
  for (const pendingPost of pendingPosts) {
    try {
      const id = pendingPost.authorId;
      const title = pendingPost.title;
      const description = pendingPost.description;
      const pendingId = pendingPost._id;
      await publishPost(id, title, description);
      const user = await User.findById(id);
      if (user) {
        const updatedPendingPosts = user.pendingPosts.filter(
          (post: any) => post.toString() !== pendingId
        );
        user.pendingPosts = updatedPendingPosts;
        await user.save();
      }
      await PendingPost.deleteOne({ _id: pendingPost._id });
      console.log("deleted pending post");
      // Delete pending post after successful publishing
    } catch (error) {
      // Handle errors publishing individual posts, e.g., log errors or retry
      console.log("errr publishing post", error);
    }
  }
}

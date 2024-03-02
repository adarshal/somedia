import { Response } from "express";

import { ErrorHandler } from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";

const Post = require("../models/post");
const User = require("../models/user");
const PendingPost = require("../models/pendingPost");
//get user by Id

export const publishPost = catchAsyncError(
  async (
    id: string,
    title: string,
    description: string,
    pendingId: string
  ) => {
    try {
      const post = await Post.create({
        title,
        description,
        authorId: id,
      });

      const user = await User.findById(id);
      if (!user) {
        //send err
        return;
      }

      user.posts.push(post._id);

      await user.save();
    } catch (error: any) {
      return new ErrorHandler(error.message, 400);
    }
  }
);

  
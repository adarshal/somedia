import { Response } from "express";
import { redis } from "../utils/redis";

const User = require("../models/user");
//get user by Id

export const getUserById = async (id: string, res: Response) => {
  const userJson = await User.findById(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

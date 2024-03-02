import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs"; // For password hashing
import jwt, { JwtPayload } from "jsonwebtoken"; // For generating JWTs
import { catchAsyncError } from "../middleware/catchAsyncError";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,accessTokenExpire,refreshTokenExpire
} from "../utils/jwt";

import { getUserById } from "../services/user.services";
import {v2 as cloudinary} from 'cloudinary';
const User = require("../models/user");

//register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const signup = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("in signup")
      const { name, email, password } = req.body;
      // Check for existing user
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userToRegister: IRegistrationBody = {
        name,
        email,
        password: hashedPassword,
      };
      const activationToken = createActivationToken(userToRegister);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: userToRegister.name }, otp: activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/signup_activation.ejs"),
        data
      );
      try {
        await sendMail({
          email: userToRegister.email,
          subject: "Activate Account",
          template: "signup_activation.ejs",
          data: data,
        });
        return res.status(201).json({
          success: true,
          message: `Please check your email ${userToRegister.email} for account Activation`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return new ErrorHandler(error.message, 400);
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCodeNum = Math.floor(Math.random() * 9000) + 1000; // Generate a random 4-digit number
  // console.log(activationCodeNum);
  const activationCode = activationCodeNum.toString(); // Convert to string
  const token = jwt.sign(
    { user: user, activationCode },
    process.env.JWT_ACTIVATION_SECRET!,
    { expiresIn: "5m" }
  ); //Expires in one hour
  return { token, activationCode };
};

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser = jwt.verify(
        activation_token,
        process.env.JWT_ACTIVATION_SECRET as string
      ) as { user: any; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid Activation Code", 400));
      }
      const { name, email, password } = newUser.user;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      const user = await User.create({
        name,
        email,
        password,
      });
      return res.status(200).json({
        success: "true",
        message: "Account created successfully!",
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 400);
    }
  }
); //2.46

export const signin = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          new ErrorHandler("Please provide an email and a password", 400)
        );
      }

      const user = await User.findOne({ email });

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
      
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
      return new ErrorHandler(err.message, 400);
    }
  }
);

export const logout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      // redis.del(userId);
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully!" });
    } catch (error: any) {
      return new ErrorHandler(error.message, 400);
    }
  }
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}
//update access token
export const updateAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      if (!refresh_token) {
        return next(new ErrorHandler("Not authenticated!", 400));
      }
      const decoded = jwt.verify(
        refresh_token,
        process.env?.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "Could not refresh token";

      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const user = await User.findById(decoded.id);

      if (!user) {
        throw new ErrorHandler('Invalid refresh token', 400);
      }
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);
      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 400);
    }
  }
);

//social auth
export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await User.findOne({ email });
      if (!user) {
        const password = Math.random().toString(36).slice(-16);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          email,
          name,
          avatar,
          password: hashedPassword,
        });
        sendToken(newUser, 200, res);
      }
    } catch (error) {}
  }
);

export const getUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user?.id;
      getUserById(userId, res);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}
export const updateUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body as IUpdateUserInfo;
      // const updates = req.body;
      const userId = req.user?.id;
      const user = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true }
      );

      // // Find user
      // const user = await User.findByIdAndUpdate(userId, updates, {
      //   new: true, // Return updated document
      // });

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      if (email && user) {
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("This Email is already in use", 400));
        }
        user.email = email;
      }
      if (name && user) {
        user.name = name;
      }
      await user.save();
      // await redis.set(userId, JSON.stringify(user));
      res.status(201).json({
        success: true,
        user,
      });
    } catch (err: any) {
      // // Handle password updates securely (optional)
      // if (updates.password) {
      //   const hashedPassword = await bcrypt.hash(updates.password, 10);
      //   user.password = hashedPassword;
      //   await user.save();
      // }

      // console.error(err);
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// update password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}
export const updatePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;
      const user = await User.findById(req.user?._id);

      // check the current password first
      const isMatch = await bcrypt.compare(oldPassword, user?.password);

      if (!isMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = await bcrypt.hash(oldPassword, 10);
      await user.save();
      // await redis.set(user?._id, JSON.stringify(user));
      user.password = "";
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// update profile pic
interface IUpdateProfilePic {
  avatar: string;
}
export const  updateProfilePic = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    let user = await User.findById(userId);

    if (!avatar || !user) {
      return next(new ErrorHandler("not found", 400));
    }
    console.log("checkimg avart",user.avatar)
    if (user.avatar?.public_id) {
      if(user.avatar.public_id)
      cloudinary.uploader.destroy(user.avatar.public_id);
    }
    
    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatar",
      width: 150,
    });

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
    console.log("hrr4", user.avatar)

    await user.save();
    // await redis.set(userId, JSON.stringify(user));
    return res.status(200).json({ success: true, data: { ...user.avatar } });
  } catch (err:any) {
    return next(new ErrorHandler(err.message, 400));

  }
});

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
//2.03

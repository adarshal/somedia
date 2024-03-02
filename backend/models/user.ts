import mongoose, { SchemaType, Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"; // For generating JWTs



const UserSchema = new mongoose.Schema({
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
        validator: (value: string) => {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // a "Post" model
    },
  ],
  pendingPosts:[
    {
      type: mongoose.Schema.Types.ObjectId,
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
  avatar:{
    public_id:String,
    url:String

  }

}, {
    timestamps: true // to know when user was created when was updated
  });
;

UserSchema.methods.SignAcessToken=function(){
  const token = jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '',{
    expiresIn: process.env.EXPIRESIN||'5m',//Tem
  });
  return token;
}

UserSchema.methods.SignRefreshToken=function(){
  const token = jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '',{
    expiresIn: process.env.EXPIRESIN_REFRESH||'3d'
  });
  return token;
}

  const User=mongoose.model('User',UserSchema);
//This is collection, collection contain docs,docs contains fields like name,date. collectn name start capital
module.exports =User;
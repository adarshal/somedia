import mongoose, { SchemaType, Schema } from "mongoose";


const PostSchema = new mongoose.Schema({
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
  likes:  {
    type: Number,
    default: 0,    
  },
  comments:  {
    type: Number,
    default: 0,    
  },
  share:  {
    type: Number,
    default: 0,    
  },   
  authorId:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
  }

}, {
    timestamps: true // to know when user was created when was updated
  });
;



  const Post=mongoose.model('Post',PostSchema);
module.exports =Post;
import mongoose, { SchemaType, Schema } from "mongoose";


const PendingPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,    
  },
scheduledAt:{
    type: Date,
    default :Date.now(),
},
authorId:{
  type: mongoose.Types.ObjectId,
  ref: 'User',
}

}, {
    timestamps: true // to know when user was created when was updated
  });
;



  const PendingPost=mongoose.model('PendingPost',PendingPostSchema);
module.exports =PendingPost;
import { app } from "./app";
import { connectToDB } from "./utils/connection";
require('dotenv').config();

// cloudinary config
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});


app.listen(process.env.PORT,()=>{
    console.log('server connected to ', process.env.PORT);
    connectToDB();
})
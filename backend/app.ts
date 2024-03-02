import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require('dotenv').config();
import { errorMiddleware } from "./middleware/error";
export const app=express();



const whitelist = process.env.ORIGINS ? process.env.ORIGINS.split(',') : [];
console.log(whitelist)
const options: cors.CorsOptions = {
  origin: whitelist  ,
  credentials: true 
};
app.use( cors(options));
//body parser
app.use(express.urlencoded({extended:true, limit:'50mb'}));
app.use(cookieParser());
app.use(express.json());
//enable CORS


// const whitelist = process.env.ORIGINS;
// var corsOptions = {
//     origin: function (origin:any, callback:any) {
//         if (!!whitelist.filter((wl:any)=> wl === origin).length) {
//             return callback(null, true);
//             }
//             else{
//                 console.log('Origin is not allowed')
//                 return callback('Origin is not allowed');
//                 }
//                 },
//   }
// app.use(cors(corsOptions));;






//uses router this router need to be used after passport so rotes can use paaport
app.use('/', require('./routes')); // /router.index.js can also used bu ir directly fect index so used it


app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err=new Error(`Router address ${req.originalUrl} not found `) as any;
    err.statusCode=404;
    next(err);
});//1.12.39

app.use(errorMiddleware);
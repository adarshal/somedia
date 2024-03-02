import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";


export const errorMiddleware=(err:any,req:Request,res:Response ,next:NextFunction)=>{
    console.log(err);
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server error";
    // wrong mongouri er
    if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate key error
        const message = `Duplicate key found for ${err.keyValue}`;
        err = new ErrorHandler(message, 409); // Conflict status code
      } else if (err.name === 'JsonWebTokenError') {
        // Invalid JWT error
        const message = `Invalid or expired JWT`;
        err = new ErrorHandler(message, 401); // Unauthorized status code
      } else if (err.name === 'CastError') {
        // Mongoose CastError
        const message = `Resource Not Found ${err.path}`;
        err = new ErrorHandler(message, 400); // Bad Request status code
      }
    res.status(err.statusCode).json({
        success: false,
        message: err.message || "Server Error"
    })
}
import { Request, Response } from "express";
import  { redis } from './redis'
const User = require("../models/user");

interface ITokenOptions{
    expires:Date;
    maxAge:number;
    httpOnly:boolean;
    sameSite: 'lax' | 'strict' | undefined;
    secure?:boolean
}

export const accessTokenExpire=parseInt(process.env.ACCESS_TOKEN_EXPIRE || '700',10);
export const refreshTokenExpire=parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200',10);
export const accessTokenOptions:ITokenOptions ={
    expires: new Date(Date.now() + accessTokenExpire*60*60*1000),// ?5minutes
    httpOnly: true,
    maxAge: accessTokenExpire*60*60*1000,
    sameSite:'lax',
    };
    export const refreshTokenOptions:ITokenOptions ={
        expires: new Date(Date.now() + refreshTokenExpire*24*60*60*1000),// minutes
        httpOnly: true,
        maxAge: refreshTokenExpire*24*60*60*1000,
        sameSite:'lax',
        };

export const sendToken= (user:any, statusCode:number, res:Response)=>{
    //create token
    const accessToken:string= user.SignAcessToken();
    const refreshToken= user.SignRefreshToken();

    // upload session to redis
    // redis.set(user._id,JSON.stringify(user) as any);


   
    // need to set secure in prod mode
    if(process.env.NODE_ENV==='PROD'){
        accessTokenOptions.secure=true;
        // refreshTokenOptions.secure=true;
    }
    res.cookie("access_token",accessToken, accessTokenOptions);
    res.cookie("refresh_token",refreshToken, refreshTokenOptions);
    user.password="";
    // console.log(userToSend)
    return res.status(statusCode).json({
        success:true,
        accessToken,
        user
        });


}
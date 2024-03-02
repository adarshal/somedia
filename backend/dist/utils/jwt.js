"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = exports.refreshTokenExpire = exports.accessTokenExpire = void 0;
const User = require("../models/user");
exports.accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '700', 10);
exports.refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);
exports.accessTokenOptions = {
    expires: new Date(Date.now() + exports.accessTokenExpire * 60 * 60 * 1000), // ?5minutes
    httpOnly: true,
    maxAge: exports.accessTokenExpire * 60 * 60 * 1000,
    sameSite: 'lax',
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + exports.refreshTokenExpire * 24 * 60 * 60 * 1000), // minutes
    httpOnly: true,
    maxAge: exports.refreshTokenExpire * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
};
const sendToken = (user, statusCode, res) => {
    //create token
    const accessToken = user.SignAcessToken();
    const refreshToken = user.SignRefreshToken();
    // upload session to redis
    // redis.set(user._id,JSON.stringify(user) as any);
    // need to set secure in prod mode
    if (process.env.NODE_ENV === 'PROD') {
        exports.accessTokenOptions.secure = true;
        // refreshTokenOptions.secure=true;
    }
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    user.password = "";
    // console.log(userToSend)
    return res.status(statusCode).json({
        success: true,
        accessToken,
        user
    });
};
exports.sendToken = sendToken;

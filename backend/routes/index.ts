import express, { NextFunction, Request, Response } from "express";
const router = express.Router()
console.log('Router loaded');

//testing route
router.get("/test",(req:Request,res:Response,next:NextFunction)=>{
    
    res.status(200).json({
        success:true,
        message:"Api test route tested",
    });
    // return res.send("u")
});

router.use("/v1",require("./v1"))

module.exports= router;

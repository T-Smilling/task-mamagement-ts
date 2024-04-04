import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";

export const requireAuth=async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
  try {
    if(req.headers.authorization){
      const token:string=req.headers.authorization.split(" ")[1];
      const user=await User.findOne({
        token:token,
        deleted:false
      }).select("-password -token");
      if(!user){
        res.json({
          code:400,
          message:"Không có quyền truy cập!"
        });
      }
      else{
        res.locals.user=user;
        next();
      }
    }
    else {
      res.json({
        code:400,
        message:"Vui lòng gửi kèm theo token!"
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      code:401,
      message:"Không có quyền truy cập!"
    });
  }
};
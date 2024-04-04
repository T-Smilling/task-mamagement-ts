import md5 from"md5";
import { Request,Response } from "express";
import User from "../models/user.model";
import ForgotPassword from "../models/forgot-password.model";

import {generateRandomString,generateRandomNumber} from "../../../helper/generate.helper";
import {sendMail} from "../../../helper/sendMail.helper";

//[POST] /api/v1/user/register/
export const register= async (req:Request,res:Response) =>{
  const existEmail=await User.findOne({
    email:req.body.email,
    deleted:false
  });
  if(existEmail){
    res.json({
      code:400,
      message:"Email đã tồn tại!"
    });
  }
  else{
    req.body.password=md5(req.body.password);
    req.body.token=generateRandomString(30);
    const user=new User(req.body);
    const data = await user.save();
    res.json({
      code:200,
      message:"Tạo tài khoản thành công!",
      token:data.token
    });
  }
};

//[POST] /api/v1/user/login/
export const login=async (req:Request,res:Response)=>{
  const email:string=req.body.email;
  const password:string=req.body.password;
  const user=await User.findOne({
    email:email,
    deleted:false
  });
  if(!user){
    res.json({
      code:400,
      message:"Email không tồn tại!"
    });
    return;
  }
  if(md5(password) != user.password){
    res.json({
      code:400,
      message:"Sai mật khẩu!"
    });
    return;
  }
  const token:string=user.token;
  res.json({
    code:200,
    message:"Đăng nhập thành công",
    token:token
  })
}

//[POST] /api/v1/user/password/forgot/
export const forgotPassword=async(req:Request,res:Response)=>{
  const email:string=req.body.email;
  const existEmail=await User.findOne({
    email:email,
    deleted:false
  });
  if(!existEmail){
    res.json({
      code:400,
      message:"Email không tồn tại!"
    })
    return;
  }
  const otp:String=generateRandomNumber(8);
  //Việc 1: Lưu vào database
  const objectForgotPassword={
    email:email,
    otp:otp,
    expireAt: Date.now() + 5*60*1000
  };
  const forgotPassword= new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Việc 2: Gửi OTP qua email của user
  const subject=`Mã OTP lấy lại mật khẩu`;
  const content=`Mã OTP lấy lại mật khẩu là ${otp}. Vui lòng không chia sẻ cho bất kì ai mã OTP này. Mã có hiệu lực 5 phút.`;
  sendMail(email,subject,content);
  res.json({
    code:200,
    message:"Đã gửi mã OTP qua email!"
  });
};

// //[POST] /api/v1/user/password/otp
export const otp=async (req:Request,res:Response)=>{
  const email:string=req.body.email;
  const otp:string=req.body.otp;
  const result=await ForgotPassword.findOne({
    email:email,
    otp:otp
  });
  if(!result){
    res.json({
      code:400,
      message:"OTP không tồn tại!"
    });
    return;
  }
  const user=await User.findOne({
    email:email
  });
  res.json({
    code:200,
    message:"Xác thực thành công",
    token:user.token
  });
}

// //[POST] /api/v1/user/password/reset
export const resetPassword=async(req:Request,res:Response)=>{
  const token:string=req.body.token;
  const password:string=req.body.password;
  const user=await User.findOne({
    token:token,
    deleted:false
  });
  if(!user){
    res.json({
      code:400,
      message:"Tài khoản không tồn tại!"
    })
    return;
  }
  await User.updateOne({
    token:token
  },{
    password:md5(password)
  });
  res.json({
    code:200,
    message:"Đổi mật khẩu thành công!"
  });
}

// //[GET] /api/v1/user/detail
export const detail=async(req:Request,res:Response)=>{
  res.json({
    code:200,
    message:"Thành công!",
    info:res.locals.user
  });
}
//[GET] /api/v1/user/list
export const list=async(req:Request,res:Response)=>{
  const users=await User.find({
    deleted:false
  }).select("id fullName email");

  res.json({
    code:200,
    message:"Thành công!",
    users:users
  });
}
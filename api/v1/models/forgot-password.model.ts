import mongoose from "mongoose";

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email:String,
    otp:String,
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  {
    timestamps:true
  }
);
const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema, "Forgot-Passwords");
export default ForgotPassword;
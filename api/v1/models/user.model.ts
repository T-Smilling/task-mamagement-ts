import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    token: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deleteAt: Date
  },
  {
    timestamps:true
  }
);
const User = mongoose.model("User", UserSchema, "Users");
export default User;
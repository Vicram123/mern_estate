import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"], // Simple email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

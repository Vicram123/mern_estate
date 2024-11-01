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
    avatar: {
      type: String,
      default:
        " https://media.istockphoto.com/id/1337144146/id/vektor/vektor-ikon-profil-avatar-default.jpg?s=170667a&w=0&k=20&c=26gXDTXAEo2w4aGtmzQSaNjWcU6wSBrKgGZ-CGYJIeo=",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

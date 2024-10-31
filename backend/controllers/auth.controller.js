import bcrypt from "bcryptjs";
import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Signup function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Email format validation (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return res
      .status(201)
      .json({ success: true, message: "User created successfully." });
  } catch (error) {
    console.error("Error during signup:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export default router;

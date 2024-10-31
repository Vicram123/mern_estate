import bcrypt from "bcryptjs";
import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// Signup function
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    const error = new Error("All fields are required.");
    error.statusCode = 400; // Set a status code for the error
    return next(error);
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
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
    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};

export default router;

import jwt from "jsonwebtoken";
import express from "express";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { errorMessage } from "../middlewares/error.js";
dotenv.config();

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
    const hashedPassword = await bcryptjs.hash(password, 12); // Increased salt rounds
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const signin = async (req, res, next) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  try {
    // Find a user in the database by email
    const validUser = await User.findOne({ email });

    // If no user is found, return a 404 error
    if (!validUser) return next(errorMessage(404, "User not found!"));

    // Compare the provided password with the hashed password in the database
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    // If the password is incorrect, return a 401 error
    if (!validPassword) return next(errorMessage(401, "Wrong credentials!"));

    // Generate a JWT token for the valid user
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Exclude the password from the user object before sending the response
    const { password: pass, ...rest } = validUser._doc;

    // Set the token as a cookie and send the user data in the response
    res
      .cookie("access_token", token, { httpOnly: true }) // Set the cookie with httpOnly flag
      .status(200) // Set the response status to 200 (OK)
      .json(rest); // Send the user data (excluding password) as JSON
  } catch (error) {
    // Handle any errors that occur during the process
    next(error);
  }
};

export default router;

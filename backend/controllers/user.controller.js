import express from "express";
import { errorHandler } from "../middlewares/error.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  res.json({ message: "working" });
};

export const updateUser = async (req, res, next) => {
  // Check if the user is trying to update their own account
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    // Hash the password if it is being updated
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Update the user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // Exclude the password from the response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

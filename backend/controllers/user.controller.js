import { errorHandler } from "../middlewares/error.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const signup = async (req, res, next) => {
  res.json({ message: "working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    // Check if the email is being updated and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account." });
      }
    }

    // Hash the password if it's being updated
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Update the user
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
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {}
};

export const getUserListings = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      const listings = await Listing.find({ userRef: req.params.id });
      return res.status(200).json(listings);
    } else {
      return next(
        errorHandler(401, "You can only view your own user listings!")
      );
    }
  } catch (error) {
    next(error);
  }
};

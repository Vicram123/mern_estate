import { errorHandler } from "../middlewares/error.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

// Create listing function with user registration check
export const createListing = async (req, res, next) => {
  try {
    // Access the user information from the request object
    const userId = req.user.id; // Assuming req.user is set by the verifyToken middleware

    // Check if the user is registered
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });
    }

    // Create the listing directly, relying on Mongoose schema validation
    const listingData = {
      ...req.body,
      userRef: userId, // Ensure userRef is set to the authenticated user
    };

    const listing = await Listing.create(listingData);

    return res.status(201).json(listing);
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    // Check if the listing exists
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Check if the user is authorized to delete the listing
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listing"));
    }

    // Delete the listing
    await Listing.findByIdAndDelete(req.params.id);

    // Send success response
    return res.status(200).json({ message: "Listing has been deleted" });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // Send success response
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

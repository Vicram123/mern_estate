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

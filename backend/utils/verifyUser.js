import jwt from "jsonwebtoken";

import { errorHandler } from "../middlewares/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // corrected "req.cookie" to "req.cookies"

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Invalid token!"));

    req.user = user; // Attach the decoded user to the request object
    next();
  });
};

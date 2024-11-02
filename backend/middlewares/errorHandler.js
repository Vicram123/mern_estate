export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // Default to 500 if status not set
  const message = err.message || "Internal Server Error"; // Default message

  res.status(status).json({ success: false, message });
};
// Use the error handling middleware
//app.use(errorHandler);

// utils/error.js
export const errorMessage = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

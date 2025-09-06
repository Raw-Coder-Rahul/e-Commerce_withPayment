import HandleError from "../utils/handleError.js";

export default (err, req, res, next) => {
  if (err instanceof HandleError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    const message = `This is invalid data: ${err.path}`;
    err = new HandleError(message, 404);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `This ${Object.keys(err.keyValue)} already exists. Please Login to continue.`;
    err = new HandleError(message, 400);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
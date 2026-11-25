export const errorhandlerMiddleware = (err, req, res, next) => {
  console.error(err); // Prints the exact error in your terminal
  return res.status(500).json({
    status: false,
    message: err.message || 'Internal Server Error',
    method: req.method,
  });
};

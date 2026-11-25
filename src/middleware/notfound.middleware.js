export const notFoundMiddleware = async (req, res, next) => {
  res.status(404).json({
    status: false,
    message: 'Not found ',
    method: req.method,
  });
};

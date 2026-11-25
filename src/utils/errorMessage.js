export const errorMessage = async (res, statuscode, message, data = null) => {
  return res.status(statuscode).json({
    status: false,
    statuscode,
    message,
    data,
  });
};

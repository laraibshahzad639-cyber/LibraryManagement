export const sucessMessage = async (res, statuscode, message, data = null) => {
  return res.status(statuscode).json({
    status: true,
    statuscode,
    message,
    data,
  });
};

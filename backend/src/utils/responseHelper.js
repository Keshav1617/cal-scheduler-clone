function success(res, data = null, message = 'OK', meta = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    meta,
  });
}

function failure(res, message = 'Error', statusCode = 500, meta = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    meta,
  });
}

module.exports = {
  success,
  failure,
};


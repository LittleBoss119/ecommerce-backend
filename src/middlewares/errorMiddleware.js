const { error } = require('../utils/apiResponse');

function errorMiddleware(err, req, res, next) {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return error(res, message, statusCode);
}

module.exports = errorMiddleware;

const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return error(res, 'Unauthorized', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
}

module.exports = authMiddleware;

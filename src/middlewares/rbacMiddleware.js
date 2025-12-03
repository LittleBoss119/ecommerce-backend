const { error } = require('../utils/apiResponse');

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, 'Forbidden', 403);
    }

    next();
  };
}

module.exports = {
  requireRole,
};

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

function signAccessToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, jwtSecret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = {
  signAccessToken,
  verifyToken,
};

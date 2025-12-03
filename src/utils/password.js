const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};

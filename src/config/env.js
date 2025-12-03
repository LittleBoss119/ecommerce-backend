const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
};

module.exports = config;

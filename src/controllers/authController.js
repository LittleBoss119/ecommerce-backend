const { success } = require('../utils/apiResponse');
const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await authService.registerUser({ name, email, password });

    return success(res, user, 'User registered successfully', 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const result = await authService.loginUser({ email, password });

    return success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, user, 'Current user');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};

const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');

async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'USER', // default
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const tokenService = require("./token.service");
const ApiError = require("../utils/ApiError");

// The Next.js app used sha256; bcrypt is the safe choice for passwords.
const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// Ported from registerAction.
const register = async ({ name, email, password, role }) => {
  // Anyone can call this endpoint, so it must not hand out admin accounts.
  if (role === "ADMIN") throw ApiError.forbidden("Admin accounts cannot be self-registered");

  const emailUsed = await userModel.findByEmailWithPassword(email);
  if (emailUsed) throw ApiError.conflict("Email already registered");

  const user = await userModel.create({
    name,
    email,
    password: await hashPassword(password),
    role,
  });

  return { user, token: tokenService.sign(user) };
};

// Ported from loginAction: the token is returned instead of saved in a cookie.
const login = async ({ email, password }) => {
  const account = await userModel.findByEmailWithPassword(email);
  if (!account) throw ApiError.unauthorized("Invalid email or password");

  const passwordMatches = await bcrypt.compare(password, account.password);
  if (!passwordMatches) throw ApiError.unauthorized("Invalid email or password");

  const { password: _password, updatedAt: _updatedAt, ...user } = account;
  return { user, token: tokenService.sign(user) };
};

// Ported from getCurrentUser.
const getProfile = async (userId) => {
  const user = await userModel.findProfileById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

module.exports = { hashPassword, register, login, getProfile };

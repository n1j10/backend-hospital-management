const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const tokenService = require("./token.service");
const ApiError = require("../utils/ApiError");
const config = require("../config");

// The Next.js app used sha256; bcrypt is the safe choice for passwords.
const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

// Compared against when the email doesn't exist, so a login takes the same time
// whether or not the account exists (no user enumeration through timing).
const DUMMY_HASH = bcrypt.hashSync("timing-safe-dummy-password", SALT_ROUNDS);

// Ported from registerAction.
const register = async ({ name, email, password, role }) => {
  if (!config.allowSelfRegistration) {
    throw ApiError.forbidden("Registration is closed, ask an administrator for an account");
  }
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

  const passwordMatches = await bcrypt.compare(password, account?.password || DUMMY_HASH);
  if (!account || !passwordMatches) throw ApiError.unauthorized("Invalid email or password");

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

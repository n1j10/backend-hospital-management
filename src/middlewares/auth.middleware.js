const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/user.model");

// Replaces the "auth-token" cookie + getAuthUser(): reads "Authorization: Bearer <token>".
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Login required");
    }

    const payload = jwt.verify(header.slice(7), config.jwt.secret, { algorithms: ["HS256"] });
    const user = await userModel.findById(payload.sub);
    if (!user) throw ApiError.unauthorized("Login required");

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};

// Only the listed roles can pass, e.g. authorize("ADMIN", "RECEPTIONIST").
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You are not allowed to do this"));
    }
    next();
  };

// Replaces getAdminUser().
const requireAdmin = authorize("ADMIN");

module.exports = { authenticate, authorize, requireAdmin };

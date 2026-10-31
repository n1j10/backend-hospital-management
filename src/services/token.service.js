const jwt = require("jsonwebtoken");
const config = require("../config");

const sign = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwt.secret, {
    algorithm: "HS256",
    expiresIn: config.jwt.expiresIn,
  });

module.exports = { sign };

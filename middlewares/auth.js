const jwt = require("jsonwebtoken");
const UNAUTHORIZED = require("../utils/errors/UNAUTHORIZED");
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  let payload;

  try {
    payload = jwt.verify(
      req.cookies.jwt,
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
    );
  } catch (err) {
    return next(new UNAUTHORIZED("Необходима авторизация"));
  }

  req.user = payload;

  return next();
};

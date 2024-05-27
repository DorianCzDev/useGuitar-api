const CustomError = require("../errors/index");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const { cookieResponse } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = payload.user;
      return next();
    }
    console.log("gówno");
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
    cookieResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const permission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

module.exports = { authenticateUser, permission };

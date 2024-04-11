const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");
const { createJWT, cookieResponse } = require("../utils/jwt");
const Token = require("../models/Token");
const crypto = require("crypto");

const register = async (req, res) => {
  if (req.body.role) {
    throw new CustomError.UnauthorizedError(
      "Something went wrong, please try again later"
    );
  }

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid email or/and password");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid email or/and password");
  }

  const { name, role, _id: userId } = user;

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: userId });
  if (existingToken) {
    const tokenUser = { name, role, userId };
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Crudentials");
    }
    refreshToken = existingToken.refreshToken;
    cookieResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const tokenUser = { refreshToken, ip, userAgent, user: userId };

  await Token.create(tokenUser);
  cookieResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = { login, register };

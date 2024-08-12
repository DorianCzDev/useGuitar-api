const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");
const { cookieResponse } = require("../utils/jwt");
const Token = require("../models/Token");
const crypto = require("crypto");

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

  if (!user.role || user.role !== "admin") {
    throw new CustomError.UnauthenticatedError("Invalid Crudentials");
  }

  const { role, _id: userId } = user;

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: userId });
  const tokenUser = { email, role, userId };
  if (existingToken) {
    refreshToken = existingToken.refreshToken;
    cookieResponse({ res, user: tokenUser, refreshToken });
    return res.status(StatusCodes.OK).json({
      msg: "Login succesfull",
    });
  }
  refreshToken = crypto.randomBytes(40).toString("hex");

  const token = { refreshToken, user: userId };

  await Token.create(token);
  cookieResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({
    msg: "Login succesfull",
  });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "You logged out" });
};

module.exports = {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

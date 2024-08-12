const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");
const { cookieResponse } = require("../utils/jwt");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendResetPasswordEmail = require("../utils/sendPasswordEmail");

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({ email, password, verificationToken });

  const origin = "http://localhost:5173/";

  await sendVerificationEmail({
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check your email to verify account" });
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

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email }).select(
    "isVerified verificationToken"
  );
  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }
  user.isVerified = true;
  user.verificationToken = "";
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Email verified! You can log in now." });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Email doesn't exists");
  }
  const user = await User.findOne({ email }).select(
    "forgotPasswordToken forgotPasswordTokenExpirationDate name email"
  );
  if (!user) {
    throw new CustomError.BadRequestError("User doesn't exists");
  }

  const forgotPasswordToken = crypto.randomBytes(40).toString("hex");

  const origin = "http://localhost:5173/";
  await sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    forgotPasswordToken,
    origin,
  });

  const expiresIn = 1000 * 60 * 15; // 15 min
  const forgotPasswordTokenExpirationDate = new Date(Date.now() + expiresIn);

  user.forgotPasswordToken = crypto
    .createHash("md5")
    .update(forgotPasswordToken)
    .digest("hex");
  user.forgotPasswordTokenExpirationDate = forgotPasswordTokenExpirationDate;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { forgotPasswordToken, email, password } = req.body;
  if (!forgotPasswordToken || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("User doesn't exists");
  }
  const currentDate = new Date();
  if (
    user.forgotPasswordToken ===
      crypto.createHash("md5").update(forgotPasswordToken).digest("hex") &&
    user.forgotPasswordTokenExpirationDate > currentDate
  ) {
    user.password = password;
    user.forgotPasswordToken = null;
    user.forgotPasswordTokenExpirationDate = null;
    await user.save();
  }
  res.status(StatusCodes.OK).json({ msg: "Your password is updated" });
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

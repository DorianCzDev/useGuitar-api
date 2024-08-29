const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select(
    " -createdAt -updatedAt -__v -password -isVerified -forgotPasswordTokenExpirationDate -forgotPasswordToken -verificationToken -email -isActive"
  );
  if (!user) {
    throw new CustomError.BadRequestError("Please log in");
  }
  if (!user.role || user.role !== "admin") {
    throw new CustomError.UnauthorizedError("Invalid Crudentials");
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getCurrentUser,
};

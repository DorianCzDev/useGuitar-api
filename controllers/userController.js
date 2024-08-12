const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");
const checkPermission = require("../utils/checkPermission");
//temp
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ count: users.length, users });
};
//temp
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password -role");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

//temp
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User successfully deleted" });
};
//temp
const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select(
    "-role -createdAt -updatedAt -__v -password -isVerified"
  );
  if (!user) {
    throw new CustomError.BadRequestError("Please log in");
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  getCurrentUser,
};

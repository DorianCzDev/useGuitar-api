const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");
const checkPermission = require("../utils/checkPermission");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).json({ count: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  checkPermission(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User successfull deleted" });
};

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json(req.user);
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getCurrentUser,
};

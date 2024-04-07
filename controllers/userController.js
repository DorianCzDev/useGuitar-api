const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ count: users.length, users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const createUser = async (req, res) => {
  if (req.body.role) {
    throw new CustomError.CustomAPIError(
      `Something went wrong, please try again later`
    );
  }
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (req.body.role) {
    throw new CustomError.CustomAPIError(
      `Something went wrong, please try again later`
    );
  }
  const user = await User.findOneAndUpdate({ _id: id }, req.body);
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User successfull updated" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User successfull deleted" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
};

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
  const user = await User.findOne({ _id: id }).select("-password -role");
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
  res.status(StatusCodes.OK).json({ msg: "User successfully updated" });
};

const updateOrderingUser = async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    throw new CustomError.UnauthorizedError("Please log in");
  }
  const { firstName, lastName, country, phoneNumber, address, postCode, city } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !country ||
    !phoneNumber ||
    !address ||
    !postCode ||
    !city
  ) {
    throw new CustomError.BadRequestError("Please provide all values");
  }

  const updatedUser = {
    firstName,
    lastName,
    country,
    phoneNumber,
    address,
    postCode,
    city,
  };
  const user = await User.findOneAndUpdate({ _id: userId }, updatedUser);
  res.status(StatusCodes.OK).json({ msg: "User successfully updated" });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: "User successfully deleted" });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select(
    "-role -createdAt -updatedAt -_id -__v -password -isVerified"
  );
  if (!user) {
    throw new CustomError.BadRequestError("Please log in");
  }

  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateOrderingUser,
};

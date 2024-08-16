const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Order = require("../models/Order");
const checkPermission = require("../utils/checkPermission");

const getAllOrders = async (req, res) => {
  const { email, lastName, page, id } = req.query;
  const queryObject = {};
  if (email) {
    queryObject.email = { $regex: email, $options: "i" };
  }
  if (lastName) {
    queryObject.lastName = { $regex: lastName, $options: "i" };
  }
  if (id) {
    queryObject._id = id;
  }

  let result = Order.find(queryObject).select(
    "createdAt email firstName lastName total status"
  );
  const ordersCount = await Order.countDocuments(queryObject);

  const limit = 10;

  const skip = (page - 1) * limit;

  result = result
    .skip(skip || 0)
    .limit(limit)
    .sort("-createdAt");

  const orders = await result;

  res.status(StatusCodes.OK).json({ orders, ordersCount });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  checkPermission(req.user, order.user);
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

//temp endpoint for testing until deploy
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${id}`);
  }
  order.status = "waiting for shipment";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    firstName,
    lastName,
    address,
    city,
    postCode,
    phoneNumber,
    country,
  } = req.body;
  let order = await Order.findOne({ _id: id });
  if (order.status === "waiting for payment" && status !== order.status) {
    throw new CustomError.UnauthorizedError("Payment not confirmed yet.");
  }
  if (order.status === "canceled") {
    throw new CustomError.BadRequestError(
      "Can't change the order if it is canceled."
    );
  }

  const orderBody = {
    status,
    firstName,
    lastName,
    address,
    city,
    postCode,
    phoneNumber,
    country,
  };

  const updatedOrder = await Order.updateOne({ _id: id }, orderBody);

  res.status(StatusCodes.OK).json({ msg: "Order updated" });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  updateOrder,
};

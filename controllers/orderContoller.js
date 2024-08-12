const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");
const Product = require("../models/Product");
const checkPermission = require("../utils/checkPermission");
const stripe = require("stripe")(process.env.STRIPE_KEY);

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

const getUserOrders = async (req, res) => {
  const { id: userId } = req.params;
  checkPermission(req.user, userId);
  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw CustomError.NotFoundError(`No orders for user with id: ${userId}`);
  }
  res.status(StatusCodes.OK).json({ orders });
};

const createOrder = async (req, res) => {
  const {
    supplier: deliverySupplier,
    cost: deliveryCost,
    clientProducts,
    totalPrice: clientTotalPrice,
    firstName,
    lastName,
    address,
    city,
    email,
    phoneNumber,
    postCode,
    country,
  } = req.body;

  let orderItems = [];

  for (const clientProduct of clientProducts) {
    const product = await Product.findOne({ _id: clientProduct.product });
    if (!product) {
      throw new CustomError.NotFoundError(
        `No product with id: ${clientProduct.product}`
      );
    }
    orderItems = [...orderItems, { product, quantity: clientProduct.quantity }];
  }
  const delivery = await Delivery.findOne({
    supplier: deliverySupplier,
    cost: deliveryCost,
  });

  if (!delivery || delivery.length === 0) {
    throw new CustomError.NotFoundError(
      `No delivery method for ${deliverySupplier}`
    );
  }

  let serverTotalPrice = delivery.cost;
  orderItems.map(
    (item) =>
      (serverTotalPrice = serverTotalPrice + item.product.price * item.quantity)
  );

  if (serverTotalPrice !== clientTotalPrice) {
    throw new CustomError.BadRequestError("Price not match");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: serverTotalPrice,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems: clientProducts,
    total: serverTotalPrice,
    user: req.user.userId,
    deliveryMethod: deliverySupplier,
    deliveryCost: deliveryCost,
    firstName,
    lastName,
    address,
    city,
    email,
    phoneNumber,
    postCode,
    country,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });

  res.status(StatusCodes.CREATED).json({ order });
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

//temp
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.deleteMany({});
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id: ${id}`);
  }

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
  getUserOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
};

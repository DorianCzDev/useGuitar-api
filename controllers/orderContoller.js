const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");
const Product = require("../models/Product");
const checkPermission = require("../utils/checkPermission");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.BadRequestError(`No order with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

const getUserOrders = async (req, res) => {
  const { id: userId } = req.params;
  checkPermission(req.user, userId);
  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw CustomError.BadRequestError(`No orders for user with id: ${userId}`);
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
      throw new CustomError.BadRequestError(`No product with id: ${id}`);
    }
    orderItems = [...orderItems, { product, quantity: clientProduct.quantity }];
  }
  const delivery = await Delivery.findOne({
    supplier: deliverySupplier,
    cost: deliveryCost,
  });

  if (!delivery || delivery.length === 0) {
    throw new CustomError.BadRequestError(
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
    amount: `${serverTotalPrice}00`,
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

const updateOrderStatus = async (req, res) => {
  //temp endpoint for testing until deploy
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.BadRequestError(`No order with id: ${id}`);
  }
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.deleteMany({});
  if (!order) {
    throw new CustomError.BadRequestError(`No order with id: ${id}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Delivery = require("../models/Delivery");

const createDelivery = async (req, res) => {
  const { supplier, cost, time } = req.body;
  if (!supplier || !cost || !time) {
    throw new CustomError.BadRequestError("Please provide all required values");
  }
  const delivery = await Delivery.create(req.body);

  res.status(StatusCodes.CREATED).json({ delivery });
};

const getAllDeliveries = async (req, res) => {
  const deliveries = await Delivery.find({});
  res.status(StatusCodes.OK).json({ deliveries });
};

const getSingleDelivery = async (req, res) => {
  const { id } = req.params;
  const delivery = await Delivery.findOne({ _id: id });
  console.log(id);
  res.status(StatusCodes.OK).json({ delivery });
};

const updateDelivery = async (req, res) => {
  const { id } = req.params;
  const delivery = await Delivery.findOneAndUpdate({ _id: id }, req.body);
  if (!delivery) {
    throw new CustomError.NotFoundError(`No delivery with ${id}`);
  }
  res.status(StatusCodes.OK).json({ delivery });
};

const deleteDelivery = async (req, res) => {
  const { id } = req.params;
  const delivery = await Delivery.findOneAndDelete({ _id: id });
  if (!delivery) {
    throw new CustomError.NotFoundError(`No delivery with ${id}`);
  }

  res.status(StatusCodes.OK).json({ delivery });
};

module.exports = {
  createDelivery,
  getAllDeliveries,
  updateDelivery,
  getSingleDelivery,
  deleteDelivery,
};

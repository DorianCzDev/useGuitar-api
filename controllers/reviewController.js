const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Review = require("../models/Review");
const checkPermission = require("../utils/checkPermission");

const getUserReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ user: id });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No reviews with user id: ${id}`);
  }
  checkPermission(req.user, id);
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOneAndDelete({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const getReportedReviews = async (req, res) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ reviews });
};

//temp
const deleteAllReviews = async (req, res) => {
  const reviews = await Review.deleteMany({});

  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  getUserReviews,
  deleteReview,
  getReportedReviews,
  deleteAllReviews,
};

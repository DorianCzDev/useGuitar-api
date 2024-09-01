const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Review = require("../models/Review");

const getReportedReviews = async (req, res) => {
  const { page } = req.query;
  let result = Review.find({ isReported: true });

  //documents count is needed on the front-end to pagination
  const reviewsCount = await Review.countDocuments({ isReported: true });

  const limit = 4;
  const skip = (page - 1) * limit;
  result = result
    .skip(skip || 0)
    .limit(limit)
    .sort("-createdAt");

  const reviews = await result;

  res.status(StatusCodes.OK).json({ reviews, reviewsCount });
};

const deleteReportedReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${id}`);
  }
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReviewFromReported = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${id}`);
  }

  review.isReported = false;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

module.exports = {
  getReportedReviews,
  deleteReportedReview,
  deleteReviewFromReported,
};

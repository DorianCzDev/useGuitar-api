const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Product = require("../models/Product");
const Review = require("../models/Review");
const checkPermission = require("../utils/checkPermission");

const getSingleProductReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ product: id });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No reviews with product id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getUserReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ user: id });
  if (!reviews) {
    throw new CustomError.NotFoundError(`No reviews with user id: ${id}`);
  }
  checkPermission(req.user, id);
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const createReview = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }
  req.body.user = req.user.userId;
  req.body.product = productId;

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOneAndDelete({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id: ${id}`);
  }
  review.comment = req.body.comment;
  review.rating = req.body.rating;
  checkPermission(req.user, review.user);

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

module.exports = {
  getSingleProductReviews,
  getUserReviews,
  createReview,
  deleteReview,
  updateReview,
};

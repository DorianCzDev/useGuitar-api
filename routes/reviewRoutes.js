const express = require("express");
const {
  getSingleProductReviews,
  getUserReviews,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/").post(authenticateUser, createReview);
router.route("/user/:id").get(authenticateUser, getUserReviews);
router.route("/product/:id").get(getSingleProductReviews);
router
  .route("/:id")
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;

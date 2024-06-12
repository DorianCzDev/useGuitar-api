const express = require("express");
const {
  getSingleProductReviews,
  getUserReviews,
  createReview,
  deleteReview,
  updateReview,
  reportReview,
  getAllReviews,
  deleteAllReviews,
} = require("../controllers/reviewController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(getAllReviews).delete(deleteAllReviews);

router.route("/product/:id").post(authenticateUser, createReview);
router.route("/user/:id").get(authenticateUser, getUserReviews);
router.route("/product/:id").get(getSingleProductReviews);
router.route("/report/:id").patch(reportReview);
router
  .route("/:id")
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, permission("admin"), deleteReview);

module.exports = router;

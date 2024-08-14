const express = require("express");
const {
  getUserReviews,
  deleteReview,
  getReportedReviews,
  deleteAllReviews,
} = require("../controllers/reviewController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(getReportedReviews).delete(deleteAllReviews);
router.route("/user/:id").get(authenticateUser, getUserReviews);
router
  .route("/:id")
  .delete(authenticateUser, permission("admin"), deleteReview);

module.exports = router;

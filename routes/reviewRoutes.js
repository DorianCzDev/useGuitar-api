const express = require("express");
const {
  deleteReportedReview,
  getReportedReviews,
  deleteAllReviews,
  deleteReviewFromReported,
} = require("../controllers/reviewController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, permission("admin"), getReportedReviews)
  .delete(deleteAllReviews);
router
  .route("/:id")
  .delete(authenticateUser, permission("admin"), deleteReportedReview)
  .patch(authenticateUser, permission("admin"), deleteReviewFromReported);

module.exports = router;

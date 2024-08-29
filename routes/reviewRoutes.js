const express = require("express");
const {
  deleteReportedReview,
  getReportedReviews,
  deleteReviewFromReported,
} = require("../controllers/reviewController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, permission("admin"), getReportedReviews);
router
  .route("/:id")
  .delete(authenticateUser, permission("admin"), deleteReportedReview)
  .patch(authenticateUser, permission("admin"), deleteReviewFromReported);

module.exports = router;

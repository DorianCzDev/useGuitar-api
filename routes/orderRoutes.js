const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  updateOrder,
  getOrdersStats,
} = require("../controllers/orderContoller");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(authenticateUser, permission("admin"), getAllOrders);
router
  .route("/stats")
  .get(authenticateUser, permission("admin"), getOrdersStats);

router
  .route("/:id")
  .get(authenticateUser, permission("admin"), getSingleOrder)
  .patch(authenticateUser, permission("admin"), updateOrder);

module.exports = router;

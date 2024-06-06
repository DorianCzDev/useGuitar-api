const express = require("express");
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrderStatus,
  getUserOrders,
  deleteOrder,
} = require("../controllers/orderContoller");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(getAllOrders).post(authenticateUser, createOrder);

router.route("/getUserOrders/:id").get(authenticateUser, getUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(updateOrderStatus)
  .delete(permission("admin"), deleteOrder);

module.exports = router;

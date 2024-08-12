const express = require("express");
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrderStatus,
  getUserOrders,
  deleteOrder,
  updateOrder,
} = require("../controllers/orderContoller");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, permission("admin"), getAllOrders)
  .post(authenticateUser, createOrder);

router.route("/getUserOrders/:id").get(authenticateUser, getUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(updateOrder)
  .delete(deleteOrder);

module.exports = router;

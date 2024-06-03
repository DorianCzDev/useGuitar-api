const express = require("express");
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrderStatus,
  getUserOrders,
  deleteOrder,
} = require("../controllers/orderContoller");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(getAllOrders).post(authenticateUser, createOrder);

router.route("/getUserOrders/:id").get(authenticateUser, getUserOrders);

router
  .route("/:id")
  .get(getSingleOrder)
  .patch(updateOrderStatus)
  .delete(deleteOrder);

module.exports = router;

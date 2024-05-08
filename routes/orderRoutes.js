const express = require("express");
const {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  getUserOrders,
} = require("../controllers/orderContoller");
const router = express.Router();

router.route("/").get(getAllOrders).post(createOrder);

router.route("/getMyOrders").get(getUserOrders);

router.route("/:id").get(getSingleOrder).patch(updateOrder);

module.exports = router;

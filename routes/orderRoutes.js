const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  updateOrder,
} = require("../controllers/orderContoller");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(authenticateUser, permission("admin"), getAllOrders);

router.route("/:id").get(authenticateUser, getSingleOrder).patch(updateOrder);

module.exports = router;

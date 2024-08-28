const express = require("express");
const router = express.Router();

const {
  permission,
  authenticateUser,
} = require("../middleware/authentication");
const {
  createDelivery,
  getAllDeliveries,
  updateDelivery,
  deleteDelivery,
  getSingleDelivery,
} = require("../controllers/deliveryController");

router
  .route("/")
  .post(authenticateUser, permission("admin"), createDelivery)
  .get(authenticateUser, permission("admin"), getAllDeliveries);
router
  .route("/:id")
  .patch(authenticateUser, permission("admin"), updateDelivery)
  .get(authenticateUser, permission("admin"), getSingleDelivery);

router
  .route("/:id")
  .delete(authenticateUser, permission("admin"), deleteDelivery);

module.exports = router;

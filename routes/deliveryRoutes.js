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
} = require("../controllers/deliveryController");

router
  .route("/")
  .post(authenticateUser, permission("admin"), createDelivery)
  .get(getAllDeliveries);
router
  .route("/:id")
  .patch(authenticateUser, permission("admin"), updateDelivery);

router
  .route("/:id")
  .delete(authenticateUser, permission("admin"), deleteDelivery);

module.exports = router;

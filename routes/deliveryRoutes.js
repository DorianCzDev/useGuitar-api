const express = require("express");
const router = express.Router();

const {
  createDelivery,
  getAllDeliveries,
  updateDelivery,
  deleteDelivery,
} = require("../controllers/deliveryController");

router.route("/").post(createDelivery).get(getAllDeliveries);
router.route("/:id").patch(updateDelivery);

router.route("/:id").delete(deleteDelivery);

module.exports = router;

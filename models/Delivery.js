const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Delivery", DeliverySchema);

const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: [true, "Please provide supplier name."],
    maxlength: [20, "Supplier name cannot be longer than 20 characters."],
  },
  cost: {
    type: Number,
    required: [true, "Please provide delivery cost."],
    maxlength: 5,
  },
  time: {
    type: Number,
    required: [true, "Please provide delivery estimated time."],
    maxlength: 5,
  },
});

module.exports = mongoose.model("Delivery", DeliverySchema);

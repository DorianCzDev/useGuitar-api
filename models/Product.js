const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      maxlength: [30, "Max length for product name is 30 characters"],
      minlength: 1,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["guitar", "amplifier", "accessory"],
    },
    subcategory: {
      type: String,
      required: [true, "Please provide product subcategory"],
      enum: [
        "electric guitar",
        "classical guitar",
        "bass guitar",
        "acoustic guitar",
        "electric guitar amp",
        "bass guitar amp",
        "acoustic guitar amp",
        "bass pickup",
        "electric guitar pickup",
        "acoustic guitar strings",
        "electric guitar strings",
        "classical guitar strings",
        "bass guitar strings",
        "guitar multi effect",
      ],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    images: {
      type: String,
      default: "/uploads/example.jpeg",
    },
    body: {
      type: String,
      lowercase: true,
    },
    neck: {
      type: String,
      lowercase: true,
    },
    bridge_pickup: {
      type: String,
      lowercase: true,
    },
    middle_pickup: {
      type: String,
      lowercase: true,
    },
    neck_pickup: {
      type: String,
      lowercase: true,
    },
    frets_number: {
      type: Number,
    },
    lefthaded: {
      type: Boolean,
    },
    strings_number: {
      type: Number,
    },
    pickups: {
      type: String,
      enum: ["H", "HH", "HHH", "S", "SS", "SSS", "HS", "HHS"],
    },
    pickups_active: {
      type: Boolean,
    },
    speakers: {
      type: String,
      lowercase: true,
    },
    power: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    footswitch_connection: {
      type: Boolean,
    },
    channels: {
      type: Number,
    },
    memory_slots: {
      type: Number,
    },
    headphone_output: {
      type: Boolean,
    },
    effects_processor: {
      type: Boolean,
    },
    recording_output: {
      type: Boolean,
    },
    reverb: {
      type: Boolean,
    },
    line_input: {
      type: Number,
    },
    pickup_type: {
      type: String,
      enum: ["humbucker", "single coil"],
    },
    pickup_strings_number: {
      type: Number,
    },
    aux_port: {
      type: Boolean,
    },
    usb_port: {
      type: Boolean,
    },
    effects: {
      type: Boolean,
    },
    amp_modeling: {
      type: Boolean,
    },
    drum_computer: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

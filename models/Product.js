const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  imageId: {
    type: String,
  },
  imageURL: {
    type: String,
    default: "/example.png",
  },
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      maxlength: [30, "Max length for product name is 30 characters"],
      minlength: 3,
      maxlength: 40,
      lowercase: true,
      unique: true,
      trim: true,
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
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: [ImageSchema],
    body: {
      type: String,
      lowercase: true,
    },
    neck: {
      type: String,
      lowercase: true,
    },
    bridgePickup: {
      type: String,
      lowercase: true,
    },
    middlePickup: {
      type: String,
      lowercase: true,
    },
    neckPickup: {
      type: String,
      lowercase: true,
    },
    fretsNumber: {
      type: Number,
    },
    lefthaded: {
      type: Boolean,
    },
    stringsNumber: {
      type: Number,
    },
    pickups: {
      type: String,
      enum: ["H", "HH", "HHH", "S", "SS", "SSS", "HS", "HHS"],
    },
    pickupsActive: {
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
    footswitchConnection: {
      type: Boolean,
    },
    channels: {
      type: Number,
    },
    memorySlots: {
      type: Number,
    },
    headphoneOutput: {
      type: Boolean,
    },
    effectsProcessor: {
      type: Boolean,
    },
    recordingOutput: {
      type: Boolean,
    },
    reverb: {
      type: Boolean,
    },
    lineInput: {
      type: Number,
    },
    pickupType: {
      type: String,
      enum: ["humbucker", "single coil"],
    },
    pickupStringsNumber: {
      type: Number,
    },
    auxPort: {
      type: Boolean,
    },
    usbPort: {
      type: Boolean,
    },
    effects: {
      type: Boolean,
    },
    ampModeling: {
      type: Boolean,
    },
    drumComputer: {
      type: Boolean,
    },
    inventory: {
      type: Number,
      required: true,
      default: 10,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

module.exports = mongoose.model("Product", ProductSchema);

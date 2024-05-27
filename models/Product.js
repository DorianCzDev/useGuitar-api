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
      enum: ["guitar", "amplifier", "pickup", "multi effect"],
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
        "bass guitar pickup",
        "electric guitar pickup",
        "guitar multi effect",
        "bass multi effect",
      ],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1600, "Description can not be more than 1600 characters"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    images: [ImageSchema],
    body: {
      type: String,
    },
    neck: {
      type: String,
    },
    bridgePickup: {
      type: String,
    },
    middlePickup: {
      type: String,
    },
    neckPickup: {
      type: String,
    },
    fretsNumber: {
      type: Number,
    },
    lefthanded: {
      type: Boolean,
    },
    stringsNumber: {
      type: Number,
    },
    pickups: {
      type: String,
      enum: ["H", "HH", "HHH", "S", "SS", "SSS", "HS", "HHS"],
    },
    tremolo: {
      type: Boolean,
    },
    pickupsActive: {
      type: Boolean,
    },
    pickupType: {
      type: String,
      enum: ["humbucker", "single coil", "mixed"],
    },
    speakers: {
      type: String,
    },
    power: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    footSwitchConnection: {
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

    pickupStringsNumber: {
      type: Number,
    },
    active: {
      type: Boolean,
    },
    output: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    kappe: {
      type: Boolean,
    },
    wiring: {
      type: Number,
    },
    pickup: {
      type: String,
      enum: ["humbucker", "single coil"],
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

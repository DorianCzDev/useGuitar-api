const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide comment to review"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAvarageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avarageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        avarageRating: Math.ceil(result[0]?.avarageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAvarageRating(this.product);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAvarageRating(this.product);
});

module.exports = mongoose.model("Review", ReviewSchema);

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const countries = require("../utils/countries");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
      maxlength: 22,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      maxlength: 22,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    postCode: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
      enum: countries,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isCorrect = await bcrypt.compare(password, this.password);
  return isCorrect;
};

module.exports = mongoose.model("User", UserSchema);

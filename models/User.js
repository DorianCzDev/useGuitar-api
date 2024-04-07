const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 30,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validator: {
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
    postal_code: {
      type: String,
      validator: {
        validator: validator.isPostalCode,
      },
    },
    address: {
      type: String,
      lowercase: true,
    },
    city: {
      type: String,
      lowercase: true,
    },
    phone_number: {
      type: String,
      validator: {
        validator: validator.isMobilePhone,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

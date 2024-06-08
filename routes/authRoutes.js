const express = require("express");
const {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").delete(authenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

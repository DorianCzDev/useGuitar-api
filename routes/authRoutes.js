const express = require("express");
const { login, register, logout } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").delete(authenticateUser, logout);

module.exports = router;

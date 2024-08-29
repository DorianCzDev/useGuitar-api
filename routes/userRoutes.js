const express = require("express");
const router = express.Router();

const { getCurrentUser } = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);

module.exports = router;

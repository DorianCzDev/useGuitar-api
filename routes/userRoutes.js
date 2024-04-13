const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllUsers);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;

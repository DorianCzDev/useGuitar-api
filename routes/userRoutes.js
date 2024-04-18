const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getCurrentUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");

router.route("/").get(authenticateUser, permission("admin"), getAllUsers);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, permission("admin"), updateUser)
  .delete(authenticateUser, permission("admin"), deleteUser);

module.exports = router;

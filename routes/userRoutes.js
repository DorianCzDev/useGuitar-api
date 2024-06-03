const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateOrderingUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, permission("admin"), getAllUsers)
  .patch(authenticateUser, updateOrderingUser);
router.route("/getCurrentUser").get(authenticateUser, getCurrentUser);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, permission("admin"), deleteUser);

module.exports = router;

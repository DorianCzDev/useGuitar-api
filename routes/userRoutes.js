const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUserPassword,
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
router.route("/updatePassword").patch(authenticateUser, updateUserPassword);
router
  .route("/:id")
  .get(authenticateUser, getSingleUser)

  .delete(authenticateUser, permission("admin"), deleteUser);

module.exports = router;

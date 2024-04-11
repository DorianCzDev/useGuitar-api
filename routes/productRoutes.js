const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticateUser, permission("admin"), createProduct)
  .get(getAllProducts);

router
  .route("/:name")
  .get(getSingleProduct)
  .patch(authenticateUser, permission("admin"), updateProduct)
  .delete(authenticateUser, permission("admin"), deleteProduct);

module.exports = router;

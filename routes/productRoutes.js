const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getSpecificProducts,
} = require("../controllers/productController");
const {
  authenticateUser,
  permission,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticateUser, permission("admin"), upload.any(), createProduct)
  .get(getAllProducts);

router.route("/category/:category").get(getSpecificProducts);

router
  .route("/deleteImage/:name")
  .delete(authenticateUser, permission("admin"), deleteProductImage);

router
  .route("/:name")
  .get(getSingleProduct)
  .patch(authenticateUser, permission("admin"), upload.any(), updateProduct)
  .delete(authenticateUser, permission("admin"), deleteProduct);

module.exports = router;

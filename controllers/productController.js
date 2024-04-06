const { StatusCodes } = require("http-status-codes");

const createProduct = async (req, res) => {
  res.send("createProduct");
};

const getAllProducts = async (req, res) => {
  res.send("getAllProducts");
};

const getSingleProduct = async (req, res) => {
  res.send("getSingleProduct");
};

const updateProduct = async (req, res) => {
  res.send("updateProduct");
};

const deleteProduct = async (req, res) => {
  res.send("deleteProduct");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

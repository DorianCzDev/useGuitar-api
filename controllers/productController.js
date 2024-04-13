const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
  const jsonProduct = JSON.parse(req.body.product);
  jsonProduct.user = req.user.userId;
  const product = await Product.create(jsonProduct);
  if (!product) {
    throw new CustomError.BadRequestError("Please provide all required values");
  }
  if (!req.files?.images) {
    return res.status(StatusCodes.CREATED).json({ product });
  }
  const maxSize = 1024 * 1024 * 2;
  let productImages = [];
  if (req.files.images.length > 1) {
    for (const image of req.files.images) {
      if (!image.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload image");
      }
      if (image.size > maxSize) {
        throw new CustomError.BadRequestError(
          "Please upload image smaller than 2Mb"
        );
      }
      const imageResult = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, uploadResult) => {
            if (error) {
              throw new CustomError.BadRequestError(
                `Something went wrong with image uploader ${error}`
              );
            }
            return resolve(uploadResult);
          })
          .end(image.data);
      });
      productImages = [
        ...productImages,
        { imageId: imageResult.public_id, imageURL: imageResult.secure_url },
      ];
    }
  } else if (!req.files.images.length) {
    const imageResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          if (error) {
            throw new CustomError.BadRequestError(
              `Something went wrong with image uploader ${error}`
            );
          }
          return resolve(uploadResult);
        })
        .end(req.files.images.data);
    });
    productImages = {
      imageId: imageResult.public_id,
      imageURL: imageResult.secure_url,
    };
  }
  product.images = productImages;
  await product.save();

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
  let { name } = req.params;
  name = name.replaceAll("_", " ");
  const product = await Product.findOne({ name });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${name}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  let { name } = req.params;
  name = name.replaceAll("_", " ");
  const product = await Product.findOneAndUpdate({ name }, req.body);
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${name}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  let { name } = req.params;
  name = name.replaceAll("_", " ");
  const product = await Product.findOneAndDelete({ name });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${name}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProductImage = async (req, res) => {
  const { name } = req.params;
  const { publicId } = req.query;
  if (!publicId) {
    throw new CustomError.BadRequestError("Please provide required query");
  }
  const product = await Product.findOne({ name });
  if (!product) {
    throw new CustomError.BadRequestError(`No product with id: ${id}`);
  }
  let imageIndex;
  for (const [index, image] of product.images.entries()) {
    if (image.imageId === publicId) imageIndex = index;
  }
  if (imageIndex === -1 || imageIndex === undefined) {
    throw new CustomError.BadRequestError(`No image with publicId ${publicId}`);
  }
  product.images.splice(imageIndex, 1);
  await product.save();

  await cloudinary.uploader.destroy(publicId);

  res.status(StatusCodes.OK).json({ product });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
};

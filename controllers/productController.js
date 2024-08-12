const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { createCloudinaryImage } = require("../utils/createCloudinaryImage");
const featureToArray = require("../utils/featureToArray");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
  let result = {};
  for (const key in req.body) {
    if (req.body[key] !== null && req.body[key] !== "") {
      result[key] = req.body[key];
    }
  }
  result.user = req.user.userId;
  const product = await Product.create(result);
  if (!product) {
    throw new CustomError.BadRequestError("Please provide all required values");
  }
  if (!req.files) {
    return res.status(StatusCodes.CREATED).json({ product });
  }
  const maxSize = 1024 * 1024 * 2; //2Mb
  let productImages = [];
  if (req.files.length > 1) {
    for (const image of req.files) {
      if (!image.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload image");
      }
      if (image.size > maxSize) {
        throw new CustomError.BadRequestError(
          "Please upload image smaller than 2Mb"
        );
      }
      const imageResult = await createCloudinaryImage(image.buffer);

      productImages = [
        ...productImages,
        { imageId: imageResult.public_id, imageURL: imageResult.secure_url },
      ];
    }
  } else if (req.files.length === 1) {
    if (!req.files[0].mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Please upload image");
    }
    if (req.files[0].size > maxSize) {
      throw new CustomError.BadRequestError(
        "Please upload image smaller than 2Mb"
      );
    }
    const imageResult = await createCloudinaryImage(req.files[0].buffer);

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
  const { sortBy, name, page } = req.query;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  let result = Product.find(queryObject).select(
    "-description -updatedAt -user"
  );

  const productsCount = await Product.countDocuments(queryObject);

  if (sortBy) {
    result = result.sort(sortBy);
  } else {
    result = result.sort("createdAt");
  }

  const limit = 10;

  const skip = (page - 1) * limit;

  result = result.skip(skip || 0).limit(limit);

  const products = await result;

  res.status(StatusCodes.OK).json({ products, productsCount });
};

const getSingleProduct = async (req, res) => {
  let { name } = req.params;

  const product = await Product.findOne({ name }).populate({
    path: "reviews",
    select: "comment user rating",
  });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${name}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { name } = req.params;
  let result = {};
  for (const key in req.body) {
    if (req.body[key] !== null && req.body[key] !== "") {
      result[key] = req.body[key];
    }
  }

  let product = await Product.findOne({ name });
  product = Object.assign(product, result);
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${result}`);
  }
  if (!req.files) {
    await product.save();
    return res.status(StatusCodes.OK).json({ product });
  }
  const maxSize = 1024 * 1024 * 2; //2Mb
  let productImages = [];
  if (req.files) {
    productImages = product.images ? product.images : [];
    if (req.files.length > 1) {
      for (const image of req.files) {
        if (!image.mimetype.startsWith("image")) {
          throw new CustomError.BadRequestError("Please upload image");
        }
        if (image.size > maxSize) {
          throw new CustomError.BadRequestError(
            "Please upload image smaller than 2Mb"
          );
        }
        const imageResult = await createCloudinaryImage(image.buffer);

        productImages = [
          ...productImages,
          { imageId: imageResult.public_id, imageURL: imageResult.secure_url },
        ];
      }
    } else if (req.files.length === 1) {
      if (!req.files[0].mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload image");
      }
      if (req.files[0].size > maxSize) {
        throw new CustomError.BadRequestError(
          "Please upload image smaller than 2Mb"
        );
      }
      const imageResult = await createCloudinaryImage(req.files[0].buffer);

      productImages = [
        ...productImages,
        { imageId: imageResult.public_id, imageURL: imageResult.secure_url },
      ];
    }
  }
  product.images = productImages;
  await product.save();
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  let { name } = req.params;
  name = name.replaceAll("_", " ");
  const product = await Product.findOneAndDelete({ name });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with name: ${name}`);
  }
  const { _id: productId } = product;
  const reviews = await Review.deleteMany({ product: productId });

  if (product.images) {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.imageId);
    }
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
    throw new CustomError.NotFoundError(
      `No image with publicId: ${publicId} related to product: ${name}`
    );
  }
  let imageIndex;
  for (const [index, image] of product.images.entries()) {
    if (image.imageId === publicId) imageIndex = index;
  }
  if (imageIndex === -1 || imageIndex === undefined) {
    throw new CustomError.NotFoundError(
      `No image with publicId: ${publicId} related to product: ${name}`
    );
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

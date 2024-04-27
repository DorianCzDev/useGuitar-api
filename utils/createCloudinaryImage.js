const cloudinary = require("cloudinary").v2;
const CustomError = require("../errors/index");
const createCloudinaryImage = async (dataStream) => {
  return await new Promise((resolve) => {
    cloudinary.uploader
      .upload_stream((error, uploadResult) => {
        if (error) {
          throw new CustomError.BadRequestError(
            `Something went wrong with image uploader ${error}`
          );
        }
        return resolve(uploadResult);
      })
      .end(dataStream);
  });
};

module.exports = { createCloudinaryImage };

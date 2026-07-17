import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinaryService = async (imageBuffer) => {
  if (!imageBuffer) {
    const error = new Error("Image file is required! ʕ•̀ᆺ•́ʔ");
    error.statusCode = 400;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        asset_folder: "jongkran/recipes",
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY UPLOAD ERROR:", error);

          const uploadError = new Error("Failed to upload image! o(╥﹏╥)o");
          uploadError.statusCode = 502;

          return reject(uploadError);
        }

        if (!result?.secure_url) {
          const uploadError = new Error("Cloudinary did not return an image URL! o(╥﹏╥)o");
          uploadError.statusCode = 502;

          return reject(uploadError);
        }

        resolve({
          image_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(imageBuffer);
  });
};
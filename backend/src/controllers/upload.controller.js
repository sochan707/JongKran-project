import {uploadImageToCloudinaryService} from "../services/cloudinary.service.js";

export const uploadRecipeImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required! ʕ•̀ᆺ•́ʔ",
      });
    }

    const uploadedImage =
      await uploadImageToCloudinaryService(req.file.buffer);

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully! ᕕ( ᐛ )ᕗ",
      data: uploadedImage,
    });
  } catch (error) {
    console.error("UPLOAD RECIPE IMAGE ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to upload image! o(╥﹏╥)o",
    });
  }
};
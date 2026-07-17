import multer from "multer";

const storage = multer.memoryStorage();

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp",];

const fileFilter = (req, file, callback) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    const error = new Error("Only JPG, PNG, and WEBP images are allowed! ʕ•̀ᆺ•́ʔ");

    error.statusCode = 400;
    return callback(error, false);
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadRecipeImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must not exceed 5 MB! ʕ•̀ᆺ•́ʔ"
          : error.message;

      return res.status(400).json({
        success: false,
        message,
      });
    }

    if (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  });
};
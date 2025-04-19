const multer = require("multer");

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// Keep the same file filter (chỉ cho phép PDF, DOCX, và hình ảnh)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and image files (JPEG, PNG, GIF) are allowed"), false);
  }
};

// Cấu hình multer với giới hạn file 5MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
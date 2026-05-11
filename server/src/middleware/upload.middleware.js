import multer from "multer";

console.log("[UPLOAD] Multer middleware loaded");

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter(req, file, cb) {
    console.log("[UPLOAD] Checking file type:", file.mimetype);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      console.log("[UPLOAD] File type rejected");
      return cb(new Error("Invalid file type"));
    }

    console.log("[UPLOAD] File accepted");
    cb(null, true);
  },
});

import multer from "multer";

const storage = multer.memoryStorage();

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

import multer from "multer";

const storage = multer.memoryStorage();

export const uploadOnboardingFiles = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB for resumes
  }).fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);

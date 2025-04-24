import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ // Create the Multer instance
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB for resumes
});

export const uploadOnboardingFiles = upload.fields([ // Call .fields() on the instance
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
]);

export default uploadOnboardingFiles;
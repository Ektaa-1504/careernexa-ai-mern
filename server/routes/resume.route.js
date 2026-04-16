import express from "express";
import multer from "multer";
import isAuth from "../middlewares/isAuth.js";
import { analyzeResumeAndFetchJobs } from "../controllers/resume.controller.js";

const router = express.Router();

/** Keep file in memory as a Buffer (pdf-parse reads Buffer / Uint8Array). */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

/**
 * Multer errors → JSON (e.g. wrong file type, file too large).
 */
function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large (max 8 MB)." });
    }
    return res.status(400).json({ message: err.message });
  }
  return res.status(400).json({ message: err.message || "Upload failed." });
}

// POST /api/resume/jobs — form field name must be "resume" (PDF)
router.post(
  "/jobs",
  isAuth,
  (req, res, next) => {
    upload.single("resume")(req, res, (e) =>
      handleUploadError(e, req, res, next)
    );
  },
  analyzeResumeAndFetchJobs
);

export default router;

import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  uploadFile,
  getFile,
  listFiles,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

console.log("[ROUTE] File routes initialized");

router.post("/upload", requireAuth, upload.single("file"), uploadFile);

router.get("/:id", requireAuth, getFile);

router.get("/", requireAuth, listFiles);

router.delete("/:id", requireAuth, deleteFile);

export default router;

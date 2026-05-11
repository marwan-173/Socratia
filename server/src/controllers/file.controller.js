import mongoose from "mongoose";
import { Readable } from "stream";
import { getGridFSBucket } from "../config/db.js";
import File from "../models/File.js";

console.log("[CONTROLLER] File controller loaded");

/* =========================
   UPLOAD FILE
========================= */
export async function uploadFile(req, res) {
  console.log("[FILE] Upload request received");

  const userId = req.userId;

  if (!userId) {
    console.log("[FILE] Missing userId");
    return res.status(400).json({ ok: false, message: "Missing userId" });
  }

  if (!req.file) {
    console.log("[FILE] No file uploaded");
    return res.status(400).json({ ok: false, message: "No file uploaded" });
  }

  // ✅ FIX: correct filename encoding
  const originalName = Buffer.from(req.file.originalname, "latin1").toString(
    "utf8"
  );

  const bucket = getGridFSBucket();

  console.log("[FILE] Saving binary to GridFS:", originalName);

  const uploadStream = bucket.openUploadStream(originalName, {
    contentType: req.file.mimetype,
  });

  Readable.from(req.file.buffer).pipe(uploadStream);

  uploadStream.on("finish", async () => {
    try {
      const fileDoc = await File.create({
        userId,
        fileId: uploadStream.id,
        originalName, // ✅ UTF-8 name saved
        mimeType: req.file.mimetype,
        size: req.file.size,
      });

      res.status(201).json({
        ok: true,
        file: {
          id: fileDoc._id,
          originalName: fileDoc.originalName,
        },
      });
    } catch (err) {
      console.error("[FILE] Failed to save metadata");
      console.error(err);
      res.status(500).json({ ok: false });
    }
  });

  uploadStream.on("error", (err) => {
    console.error("[FILE] GridFS upload failed");
    console.error(err);
    res.status(500).json({ ok: false });
  });
}

/* =========================
   GET FILE
========================= */
export async function getFile(req, res) {
  console.log("[FILE] Get file request");

  const { id } = req.params;

  try {
    console.log("[FILE] Looking up file metadata");

    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      console.log("[FILE] File metadata not found");
      return res.status(404).json({ ok: false });
    }

    console.log("[FILE] Streaming file from GridFS");

    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(fileDoc.fileId);

    res.setHeader("Content-Type", fileDoc.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileDoc.originalName}"`
    );

    downloadStream.pipe(res);
  } catch (err) {
    console.error("[FILE] Failed to get file");
    console.error(err);
    res.status(500).json({ ok: false });
  }
}

export async function listFiles(req, res) {
  const userId = req.userId;

  const files = await File.find({ userId }).sort({ createdAt: -1 }).lean();

  res.json({
    files: files.map((f) => ({
      id: f._id,
      name: f.originalName,
      meta: `PDF • ${(f.size / 1024 / 1024).toFixed(2)} MB`,
    })),
  });
}

export async function deleteFile(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  const file = await File.findOne({ _id: id, userId });
  if (!file) return res.status(404).json({ ok: false });

  const bucket = getGridFSBucket();
  await bucket.delete(file.fileId);

  await File.deleteOne({ _id: id });

  res.json({ ok: true });
}

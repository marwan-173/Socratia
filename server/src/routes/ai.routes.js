import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  chatWithFile,
  addNoteToChat,
  getUserChats,
  getChatById,
} from "../controllers/ai.controller.js";

import { compareWithFiles } from "../controllers/ai.compare.controller.js";

const router = express.Router();

console.log("[ROUTE] AI routes initialized");

router.post("/chat", requireAuth, chatWithFile);
router.post("/notes", requireAuth, addNoteToChat);
router.get("/chats", requireAuth, getUserChats);
router.get("/chats/:id", requireAuth, getChatById);

router.post("/compare", requireAuth, compareWithFiles);

export default router;

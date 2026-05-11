import File from "../models/File.js";
import { getGridFSBucket } from "../config/db.js";
import { runSocraticSession } from "../ai/socratic.service.js";
import Chat from "../models/Chat.js";

console.log("[CONTROLLER] AI controller loaded");

export async function chatWithFile(req, res) {
  try {
    console.log("=== /api/ai/chat HIT ===");
    console.log("BODY:", req.body);
    console.log("USER:", req.userId || req.user?._id);
    console.log("TIME:", new Date().toISOString());

    // 1. Extract mode from body (default to "socratic")
    const { chatId, fileId, messages = [], mode = "socratic" } = req.body;
    const userId = req.userId || req.user?._id;

    if (!userId || !chatId || !fileId) {
      console.warn("[CHAT] Missing data", { userId, chatId, fileId });
      return res.status(400).json({ ok: false, error: "Missing data" });
    }

    /* =========================
       FILE META
    ========================= */
    const fileMeta = await File.findById(fileId);
    if (!fileMeta) {
      console.warn("[CHAT] File not found", { fileId });
      return res.status(404).json({ ok: false, error: "File not found" });
    }

    /* =========================
       LOAD FILE FROM GRIDFS
    ========================= */
    console.log("[CHAT] Loading file from GridFS", {
      gridFsId: fileMeta.fileId,
      mimeType: fileMeta.mimeType,
    });

    const bucket = getGridFSBucket();
    const stream = bucket.openDownloadStream(fileMeta.fileId);
    const chunks = [];
    for await (const c of stream) chunks.push(c);
    const buffer = Buffer.concat(chunks);

    console.log("[CHAT] File loaded", { size: buffer.length });

    /* =========================
       AI (Pass mode)
    ========================= */
    console.log("[AI] Running session", {
      chatId,
      mode,
      messagesCount: messages.length,
    });

    const reply = await runSocraticSession({
      fileBuffer: buffer,
      mimeType: fileMeta.mimeType,
      chatHistory: messages,
      mode: mode, // 👈 Passing the mode here
    });

    if (!reply) {
      console.error("[AI] Empty reply");
      return res.status(500).json({ ok: false, error: "Empty AI reply" });
    }

    /* =========================
       PREPARE MESSAGES
    ========================= */
    const updates = [];

    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      updates.push({ role: "user", text: last.text });
    }

    updates.push({ role: "assistant", text: reply });

    console.log("[CHAT] Saving messages", {
      chatId,
      newMessages: updates.length,
    });

    /* =========================
       ATOMIC SAVE (NO save())
    ========================= */
    await Chat.findOneAndUpdate(
      { chatId, userId },
      {
        $setOnInsert: {
          chatId,
          userId,
          fileId,
          // 2. Save the mode type to DB
          type: mode,
          paperName: fileMeta.originalName,
        },
        $push: {
          messages: { $each: updates },
        },
      },
      {
        upsert: true,
        runValidators: true, // safety
      }
    );

    console.log("[CHAT] Saved successfully", { chatId });

    return res.json({ ok: true, reply, chatId });
  } catch (err) {
    console.error("🔥 CHAT ERROR");
    console.error(err.message);
    console.error(err.stack);
    return res.status(500).json({ ok: false, error: "Chat failed" });
  }
}

// ============================
// ADD NOTE TO CHAT
// ============================
export async function addNoteToChat(req, res) {
  const { chatId, text } = req.body;
  const userId = req.userId || req.user?._id;

  if (!chatId || !text?.trim()) {
    return res.status(400).json({ ok: false, error: "Missing data" });
  }

  const chat = await Chat.findOneAndUpdate(
    { chatId, userId },
    {
      $push: { notes: { text: text.trim() } },
    },
    { new: true }
  );

  if (!chat) {
    return res.status(404).json({
      ok: false,
      error: "Chat not initialized yet",
    });
  }

  return res.json({ ok: true, note: chat.notes.at(-1) });
}

// ============================
// GET ALL CHATS (RECENT ACTIVITY)
// ============================
export async function getUserChats(req, res) {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const chats = await Chat.find({ userId })
      .select("chatId fileId paperName type createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      ok: true,
      chats: chats.map((c) => ({
        chatId: c.chatId,
        fileId: c.fileId,
        title: c.paperName,
        type: c.type,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error("[CHATS] Fetch failed:", err);
    return res.status(500).json({ ok: false, error: "Failed to fetch chats" });
  }
}

// ============================
// GET SINGLE CHAT (VIEW MODE)
// ============================
export async function getChatById(req, res) {
  try {
    const userId = req.userId || req.user?.id || req.user?._id;
    const chatId = req.params.id;

    if (!userId) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ ok: false, error: "Missing chatId" });
    }

    const chat = await Chat.findOne({
      chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({ ok: false, error: "Chat not found" });
    }

    return res.json({
      ok: true,
      chat: {
        chatId: chat.chatId,
        fileId: chat.fileId,
        paperName: chat.paperName,
        type: chat.type,
        messages: chat.messages,
        notes: chat.notes,
        createdAt: chat.createdAt,
      },
    });
  } catch (err) {
    console.error("[CHAT] Fetch single failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch chat",
    });
  }
}

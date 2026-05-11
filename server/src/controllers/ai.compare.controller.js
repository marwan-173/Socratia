import File from "../models/File.js";
import Chat from "../models/Chat.js"; // 👈 THIS WAS MISSING
import { getGridFSBucket } from "../config/db.js";
import { runComparisonSession } from "../ai/socratic.service.js";

export async function compareWithFiles(req, res) {
  const reqId = `cmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const t0 = Date.now();

  const log = (...args) => console.log(`[COMPARE][${reqId}]`, ...args);
  const warn = (...args) => console.warn(`[COMPARE][${reqId}]`, ...args);
  const errlog = (...args) => console.error(`[COMPARE][${reqId}]`, ...args);

  try {
    log("=== /api/ai/compare HIT ===");
    log("TIME:", new Date().toISOString());
    log("USER:", req.userId || req.user?._id || req.user?.id);

    // Body debugging (safe-ish: don't print huge messages arrays fully)
    log("BODY keys:", Object.keys(req.body || {}));
    log("BODY chatId:", req.body?.chatId);
    log("BODY fileIds:", req.body?.fileIds);
    log(
      "BODY messages length:",
      Array.isArray(req.body?.messages) ? req.body.messages.length : "not-array"
    );
    if (Array.isArray(req.body?.messages) && req.body.messages.length) {
      const last = req.body.messages.at(-1);
      log("BODY last message:", {
        role: last?.role,
        textLen: last?.text?.length,
        textPreview:
          typeof last?.text === "string" ? last.text.slice(0, 120) : last?.text,
      });
    }

    const userId = req.userId || req.user?._id;
    const { chatId, fileIds = [], messages = [] } = req.body;

    // Validation logs
    if (!userId) warn("Missing userId");
    if (!chatId) warn("Missing chatId");
    if (!Array.isArray(fileIds))
      warn("fileIds is not an array:", typeof fileIds, fileIds);
    if (Array.isArray(fileIds)) log("fileIds length:", fileIds.length);

    if (!userId || !chatId || !Array.isArray(fileIds) || fileIds.length !== 2) {
      warn("Invalid data", { userId: !!userId, chatId: !!chatId, fileIds });
      return res.status(400).json({ ok: false, error: "Invalid data" });
    }

    // Normalize / ensure unique ids
    const fileIdsUnique = [...new Set(fileIds.map(String))];
    log("fileIds unique:", fileIdsUnique);
    if (fileIdsUnique.length !== 2) {
      warn("fileIds are duplicated or invalid", { fileIds, fileIdsUnique });
      return res
        .status(400)
        .json({ ok: false, error: "fileIds must be 2 distinct ids" });
    }
    /* =========================
   DUPLICATE AUTO-START GUARD
   (React StrictMode protection)
========================= */
    if (Array.isArray(messages) && messages.length === 0) {
      log("Checking duplicate auto-start guard");

      const existing = await Chat.findOne({ chatId, userId }).lean();

      if (
        existing &&
        Array.isArray(existing.messages) &&
        existing.messages.length
      ) {
        log("Duplicate auto-start detected — returning last assistant reply", {
          chatId,
          messagesCount: existing.messages.length,
        });

        const lastAssistant = [...existing.messages]
          .reverse()
          .find((m) => m.role === "assistant");

        if (lastAssistant?.text) {
          return res.json({
            ok: true,
            reply: lastAssistant.text,
            chatId,
          });
        }
      }
    }

    /* =========================
       LOAD FILE METADATA
    ========================= */
    log("Stage: LOAD_FILE_METADATA start");
    const tMeta0 = Date.now();

    const files = await File.find({
      _id: { $in: fileIdsUnique },
      userId,
    });

    log("Stage: LOAD_FILE_METADATA done", {
      ms: Date.now() - tMeta0,
      found: files.length,
      files: files.map((f) => ({
        _id: String(f._id),
        originalName: f.originalName,
        mimeType: f.mimeType,
        size: f.size,
        gridFsId: String(f.fileId),
      })),
    });

    if (files.length !== 2) {
      warn("Files not found or not owned by user", {
        requested: fileIdsUnique,
        foundIds: files.map((f) => String(f._id)),
      });
      return res.status(404).json({ ok: false, error: "Files not found" });
    }

    /* =========================
       LOAD FILE BUFFERS
    ========================= */
    log("Stage: LOAD_FILE_BUFFERS start");
    const tBuf0 = Date.now();
    const bucket = getGridFSBucket();
    log("GridFS bucket ready:", !!bucket);

    const buffers = await Promise.all(
      files.map(async (f, idx) => {
        const fileTag = `File${idx === 0 ? "A" : "B"}`;

        log(`${fileTag}: openDownloadStream`, {
          metaId: String(f._id),
          gridFsId: String(f.fileId),
          name: f.originalName,
          mimeType: f.mimeType,
          declaredSize: f.size,
        });

        const tStream0 = Date.now();
        const stream = bucket.openDownloadStream(f.fileId);

        let chunksCount = 0;
        let bytes = 0;
        const chunks = [];

        // Stream debug events
        stream.on("error", (e) => {
          errlog(`${fileTag}: stream error`, e?.message, e);
        });
        stream.on("end", () => {
          log(`${fileTag}: stream end`, {
            ms: Date.now() - tStream0,
            chunksCount,
            bytes,
          });
        });

        for await (const c of stream) {
          chunksCount += 1;
          bytes += c.length;
          chunks.push(c);

          // progress log every ~5MB
          if (bytes % (5 * 1024 * 1024) < c.length) {
            log(`${fileTag}: streaming progress`, { bytes });
          }
        }

        const buffer = Buffer.concat(chunks);
        log(`${fileTag}: buffer ready`, {
          ms: Date.now() - tStream0,
          chunksCount,
          bytes,
          bufferLen: buffer.length,
        });

        return {
          name: f.originalName,
          mimeType: f.mimeType,
          buffer,
        };
      })
    );

    log("Stage: LOAD_FILE_BUFFERS done", {
      ms: Date.now() - tBuf0,
      buffers: buffers.map((b) => ({
        name: b.name,
        mimeType: b.mimeType,
        bufferLen: b.buffer?.length,
      })),
    });

    // sanity checks
    const empty = buffers.filter((b) => !b.buffer || b.buffer.length === 0);
    if (empty.length) {
      warn(
        "One or more buffers are empty",
        empty.map((e) => e.name)
      );
      return res
        .status(500)
        .json({ ok: false, error: "One or more files failed to load" });
    }

    /* =========================
       AI (Gemini comparison)
    ========================= */
    log("Stage: AI start");
    const tAi0 = Date.now();

    log("AI input", {
      chatHistoryLen: Array.isArray(messages) ? messages.length : "not-array",
      lastRole:
        Array.isArray(messages) && messages.length
          ? messages.at(-1)?.role
          : null,
      files: buffers.map((b) => ({
        name: b.name,
        mimeType: b.mimeType,
        bufferLen: b.buffer.length,
      })),
    });

    const reply = await runComparisonSession({
      files: buffers,
      chatHistory: messages,
    });

    log("Stage: AI done", {
      ms: Date.now() - tAi0,
      replyType: typeof reply,
      replyLen: typeof reply === "string" ? reply.length : null,
      replyPreview: typeof reply === "string" ? reply.slice(0, 200) : reply,
    });

    if (!reply) {
      errlog("Empty AI reply");
      return res.status(500).json({ ok: false, error: "Empty AI reply" });
    }

    /* =========================
       SAVE CHAT (ATOMIC)
    ========================= */
    log("Stage: SAVE_CHAT start");
    const tSave0 = Date.now();

    const last =
      Array.isArray(messages) && messages.length ? messages.at(-1) : null;
    const toPush = [
      last?.role === "user" ? { role: "user", text: last.text } : null,
      { role: "assistant", text: reply },
    ].filter(Boolean);

    log("SAVE payload", {
      setOnInsert: {
        chatId,
        userId: String(userId),
        type: "comparison",
        fileIds: fileIdsUnique,
        paperName: `${files[0].originalName} vs ${files[1].originalName}`,
      },
      pushCount: toPush.length,
      pushPreview: toPush.map((m) => ({
        role: m.role,
        textLen: m.text?.length,
        textPreview: m.text?.slice(0, 120),
      })),
    });

    const saved = await Chat.findOneAndUpdate(
      { chatId, userId },
      {
        $setOnInsert: {
          chatId,
          userId,
          type: "comparison",
          fileIds: fileIdsUnique,
          paperName: `${files[0].originalName} vs ${files[1].originalName}`,
        },
        $push: {
          messages: { $each: toPush },
        },
      },
      { upsert: true, new: true }
    );

    log("Stage: SAVE_CHAT done", {
      ms: Date.now() - tSave0,
      saved: !!saved,
      savedId: saved?._id ? String(saved._id) : null,
      savedChatId: saved?.chatId,
      savedType: saved?.type,
      savedFileIds: saved?.fileIds?.map(String),
      savedMessagesCount: saved?.messages?.length,
    });

    log("Total request time:", `${Date.now() - t0}ms`);
    return res.json({ ok: true, reply, chatId });
  } catch (e) {
    errlog("🔥 COMPARE ERROR", e?.message);
    errlog(e?.stack);
    return res.status(500).json({ ok: false, error: "Compare failed" });
  }
}

import mongoose from "mongoose";

/* =========================
   Message Schema (existing)
========================= */
const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/* =========================
   Note Schema (NEW)
========================= */
const NoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* =========================
   Chat Schema
========================= */
const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true, // 🔥 important
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },

    fileIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "File",
      default: [],
    },
    // 🔽 NEW: session type
    type: {
      type: String,
      enum: ["socratic", "comparison", "summary", "quiz"],
      required: true,
      default: "socratic",
      index: true,
    },

    // Existing messages
    messages: {
      type: [MessageSchema],
      default: [],
    },
    paperName: {
      type: String,
      required: true,
    },
    // 🔽 NEW: notes array
    notes: {
      type: [NoteSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);

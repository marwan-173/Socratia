import { useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api.js";

export default function SessionNotes({
  chatId,
  notes: initialNotes = [],
  readOnly = false,
}) {
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [saving, setSaving] = useState(false);

  // ✅ عند History mode: حمّل notes الجاهزة
  useEffect(() => {
    if (readOnly) {
      setNotes(initialNotes);
    }
  }, [readOnly, initialNotes]);

  async function handleSaveNote() {
    if (readOnly) return;
    if (!noteInput.trim() || !chatId) return;

    setSaving(true);

    try {
      const res = await apiFetch("/ai/notes", {
        method: "POST",
        body: {
          chatId,
          text: noteInput,
        },
      });

      if (res?.note) {
        setNotes((prev) => [...prev, res.note]);
        setNoteInput("");
      }
    } catch (err) {
      console.error("[NOTES] Failed to save note", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside
      className="rounded-3xl border p-5 shadow-lg backdrop-blur"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div
        className="text-sm font-semibold"
        style={{ color: "var(--text-main)" }}
      >
        Session Notes
      </div>

      {!readOnly && (
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          Write down insights or questions you want to revisit.
        </p>
      )}

      {/* ✏️ Input (Learn mode فقط) */}
      {!readOnly && (
        <>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="mt-4 h-32 w-full resize-none rounded-2xl border px-4 py-3 text-sm placeholder:opacity-50 focus:ring-2 focus:ring-blue-500/40"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
            }}
            placeholder="Your note…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSaveNote();
              }
            }}
          />

          <button
            onClick={handleSaveNote}
            disabled={saving}
            className="mt-3 w-full rounded-xl py-2 text-sm font-medium transition"
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              color: "rgb(96, 165, 250)",
              opacity: saving ? 0.5 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : "Save note"}
          </button>
        </>
      )}

      {/* 📌 Notes list (Learn + History) */}
      <div className="mt-4 space-y-2">
        {notes.length === 0 ? (
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            No notes yet.
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note._id ?? note.id ?? index}
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                backgroundColor: "var(--bg-main)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
                border: "1px solid",
              }}
            >
              {note.text}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

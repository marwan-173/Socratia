import { useRef } from "react";
import PaperCard from "./PaperCard";

export default function PapersGrid({
  files,
  selected,
  setSelected,
  onUploadFile,
  onSaveFile,
  onDeleteFile,
}) {
  const fileInputRef = useRef(null);

  const toggleFile = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  return (
    <section>
      {/* Header + Upload */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Your papers</h2>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={onUploadFile}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border px-4 py-2 text-sm font-semibold text-white hover:opacity-80 transition"
            style={{
              backgroundColor: "rgb(59, 130, 246)",
              borderColor: "rgba(59, 130, 246, 0.4)",
            }}
          >
            + Upload
          </button>
        </div>
      </div>

      {files.length === 0 && (
        <div
          className="rounded-3xl border p-8 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
        >
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            No papers uploaded yet
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {files.map((file) => (
          <PaperCard
            key={file.id}
            file={file}
            isSelected={selected.includes(file.id)}
            onToggle={() => toggleFile(file.id)}
            onSave={() => onSaveFile(file)}
            onDelete={() => onDeleteFile(file)}
          />
        ))}
      </div>
    </section>
  );
}

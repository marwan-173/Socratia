export default function PaperCard({
  file,
  isSelected,
  onToggle,
  onSave,
  onDelete,
}) {
  const isLocal = !!file._localFile;

  return (
    <div
      className={`relative rounded-3xl border p-5 backdrop-blur transition`}
      style={{
        backgroundColor: isSelected
          ? "rgba(59, 130, 246, 0.1)"
          : "var(--bg-card)",
        borderColor: isSelected
          ? "rgba(59, 130, 246, 0.6)"
          : "var(--border-main)",
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
          Selected
        </div>
      )}

      <button onClick={onToggle} className="w-full text-left">
        <div
          className="text-sm font-semibold"
          style={{ color: "var(--text-main)" }}
        >
          {file.name}
        </div>
        <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {file.meta}
        </div>
      </button>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isLocal && (
          <button
            type="button"
            onClick={onSave}
            className="pointer-events-auto rounded-xl px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:opacity-80 transition"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            Save
          </button>
        )}

        <button
          onClick={onDelete}
          className="flex-1 rounded-xl px-3 py-1.5 text-xs text-red-400"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

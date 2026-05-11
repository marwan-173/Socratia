export default function SessionHeader({ paperName, onBack }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Socratic Session
        </div>
        <h1
          className="mt-1 text-xl font-bold"
          style={{ color: "var(--text-main)" }}
        >
          {paperName}
        </h1>
      </div>

      <button
        onClick={onBack}
        className="rounded-xl border px-4 py-2 text-sm font-semibold transition"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
          color: "var(--text-main)",
        }}
      >
        ← Back to Workspace
      </button>
    </div>
  );
}

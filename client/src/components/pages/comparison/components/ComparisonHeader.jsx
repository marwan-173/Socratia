export default function ComparisonHeader({ paperA, paperB, onBack }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--text-main)" }}
        >
          {paperA} <span style={{ color: "var(--text-muted)" }}>vs</span>{" "}
          {paperB}
        </h1>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Socratic comparison session
        </p>
      </div>

      <button
        onClick={onBack}
        className="rounded-xl px-4 py-2 text-sm transition"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
          color: "var(--text-main)",
          border: "1px solid",
        }}
      >
        Back
      </button>
    </header>
  );
}

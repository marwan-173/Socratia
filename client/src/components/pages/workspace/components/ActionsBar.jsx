export default function ActionsBar({
  selected,
  setSelected,
  selectedFiles,
  navigate,
  onViewHistory,
}) {
  const selectedCount = selected.length;

  const onLearn = () => {
    if (selectedCount !== 1) return;

    const f = selectedFiles[0];

    console.log("[LEARN] Open session for file:", f.id);
    const sessionKey = crypto.randomUUID(); // 👈 NEW

    console.log("[LEARN] Open NEW session for file:", f.id, sessionKey);
    navigate("/socratic-session", {
      state: {
        fileId: f.id,
        paperName: f.name,
        mode: "new",
        sessionKey,
      },
    });
  };

  const onCompare = () => {
    if (selectedCount !== 2) return;

    const [a, b] = selectedFiles;
    const sessionKey = crypto.randomUUID();

    console.log(
      "[COMPARE] Open NEW comparison session",
      a.id,
      b.id,
      sessionKey
    );

    navigate("/comparison", {
      state: {
        fileIds: [a.id, b.id],
        paperNames: [a.name, b.name],
        mode: "new",
        sessionKey,
      },
    });
  };

  return (
    <div
      className="mt-6 rounded-3xl border p-4 backdrop-blur"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Selected:{" "}
          <span className="font-semibold text-blue-400">{selectedCount}/2</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onLearn}
            disabled={selectedCount !== 1}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
              selectedCount === 1
                ? "bg-blue-500 text-white"
                : "cursor-not-allowed opacity-50"
            }`}
            style={{
              backgroundColor:
                selectedCount === 1 ? "rgb(59, 130, 246)" : "var(--bg-main)",
              color: selectedCount === 1 ? "white" : "var(--text-muted)",
              border:
                selectedCount !== 1 ? "1px solid var(--border-main)" : "none",
            }}
          >
            Learn
          </button>

          <button
            onClick={onCompare}
            disabled={selectedCount !== 2}
            className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition`}
            style={{
              backgroundColor:
                selectedCount === 2
                  ? "rgba(59, 130, 246, 0.25)"
                  : "var(--bg-main)",
              color:
                selectedCount === 2 ? "rgb(59, 130, 246)" : "var(--text-muted)",
              border: "1px solid",
              borderColor:
                selectedCount === 2
                  ? "rgba(59, 130, 246, 0.5)"
                  : "var(--border-main)",
              cursor: selectedCount !== 2 ? "not-allowed" : "pointer",
              opacity: selectedCount !== 2 ? 0.5 : 1,
            }}
          >
            Compare
          </button>

          <button
            onClick={() => setSelected([])}
            disabled={!selectedCount}
            className="rounded-2xl px-5 py-2.5 text-sm border border-white/15 bg-white/5"
          >
            Clear
          </button>

          <button
            onClick={onViewHistory}
            className="rounded-2xl px-5 py-2.5 text-sm bg-blue-500/10 border border-blue-400/20"
          >
            View all history
          </button>
        </div>
      </div>
    </div>
  );
}

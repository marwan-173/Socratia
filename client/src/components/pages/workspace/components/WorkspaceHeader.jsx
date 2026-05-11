export default function WorkspaceHeader({ fileInputRef, setFiles }) {
  const onFilesPicked = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const now = Date.now();
    const newItems = picked.map((file, idx) => ({
      id: `local-${now}-${idx}`,
      name: file.name,
      meta: `${file.type.toUpperCase()} • ${(file.size / 1024 / 1024).toFixed(
        2
      )} MB`,
      _localFile: file,
    }));

    setFiles((prev) => [...newItems, ...prev]);
    e.target.value = "";
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Workspace
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Select <span style={{ color: "var(--text-main)" }}>one</span> paper
            to learn or <span style={{ color: "var(--text-main)" }}>two</span>{" "}
            papers to compare.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={onFilesPicked}
          />
        </div>
      </div>
    </>
  );
}

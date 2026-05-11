export default function ComparisonSidePanel() {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_35px_rgba(59,130,246,0.08)] backdrop-blur">
      <div className="text-sm font-semibold text-white/90">
        Comparison notes
      </div>
      <p className="mt-2 text-sm text-white/70">
        Write key similarities/differences you want to remember.
      </p>

      <textarea
        className="mt-4 h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/40"
        placeholder="Notes…"
      />

      <div className="mt-5 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
        <div className="text-xs font-semibold text-blue-100">Socratic tip</div>
        <div className="mt-1 text-sm text-white/75">
          When you compare, always ask: “Compared to what?” and “Based on which
          evidence?”
        </div>
      </div>
    </aside>
  );
}

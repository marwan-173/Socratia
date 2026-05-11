export default function HomePage({ onStart }) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
        backgroundImage:
          "radial-gradient(60% 40% at 50% 0%, rgba(59, 130, 246, 0.25), transparent 60%)",
      }}
    >
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <section
          className="relative overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur sm:p-10"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Let an AI tutor guide you through research papers
            </h1>

            <p
              className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--text-muted)" }}
            >
              A calm Socratic workspace that helps you understand academic
              papers by asking the right questions — step by step, without
              overwhelming you.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.40)] hover:bg-blue-400 transition"
              >
                Open Socratic Workspace
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Socratic learning",
              desc: "Guiding questions that push your thinking instead of dumping answers.",
            },
            {
              title: "Paper-focused",
              desc: "Work with one paper at a time and stay aligned with its content.",
            },
            {
              title: "Comparison ready",
              desc: "Later you’ll compare two papers side-by-side for methods & results.",
            },
            {
              title: "Calm UI",
              desc: "Dark, glassy layout designed for reading and concentration.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border p-5 shadow-lg backdrop-blur"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-main)",
              }}
            >
              <div className="text-base font-semibold">{c.title}</div>
              <div
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {c.desc}
              </div>
            </div>
          ))}
        </section>

        <section
          id="about"
          className="mt-10 rounded-3xl border p-6 backdrop-blur sm:p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
        >
          <h2 className="text-lg font-semibold">About</h2>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Socratia is a Socratic learning app for reading and comparing
            academic papers. You’ll upload papers, choose a learning mode
            (single paper or comparison), and the assistant will guide you with
            questions.
          </p>

          <div className="mt-5 flex">
            <button
              onClick={onStart}
              className="rounded-2xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
            >
              Sign in to start
            </button>
          </div>
        </section>

        <footer
          className="mt-10 text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Socratia — AI-powered research assistant. All rights reserved © 2026.
        </footer>
      </main>
    </div>
  );
}

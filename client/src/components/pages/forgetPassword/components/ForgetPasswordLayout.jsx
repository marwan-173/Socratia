export default function ForgetPasswordLayout({ theme, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        backgroundImage:
          theme === "dark"
            ? "radial-gradient(60% 40% at 50% 0%, rgba(59, 130, 246, 0.22), transparent 60%), linear-gradient(180deg, #05070f, #03040a)"
            : "radial-gradient(60% 40% at 50% 0%, rgba(59, 130, 246, 0.15), transparent 60%)",
        color: "var(--text-main)",
      }}
    >
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-2xl gap-6">
          <section
            style={{
              borderRadius: "1.5rem",
              border: `1px solid var(--border-main)`,
              backgroundColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(59, 130, 246, 0.08)",
              padding: "2rem",
              boxShadow:
                theme === "dark"
                  ? "0 0 40px rgba(59, 130, 246, 0.08)"
                  : "0 0 20px rgba(59, 130, 246, 0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}

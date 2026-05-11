import { NavLink } from "react-router-dom";
import useSignIn from "../../hooks/useSignIn";
import useTheme from "../../hooks/useTheme";

export default function SignInPage() {
  const { email, password, setEmail, setPassword, submit, error, loading } =
    useSignIn();
  const { theme } = useTheme();

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
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Left: intro */}
          <section
            style={{
              borderRadius: "1.5rem",
              border: `1px solid var(--border-main)`,
              backgroundColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(59, 130, 246, 0.08)",
              padding: "1.5rem",
              boxShadow:
                theme === "dark"
                  ? "0 0 40px rgba(59, 130, 246, 0.08)"
                  : "0 0 20px rgba(59, 130, 246, 0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h1
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--text-main)" }}
            >
              Sign in to Socratia
            </h1>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Continue your Socratic workspace and access your saved papers.
            </p>

            <div
              className="mt-6 rounded-2xl p-4"
              style={{
                border: `1px solid var(--border-main)`,
                backgroundColor:
                  theme === "dark"
                    ? "rgba(0, 0, 0, 0.2)"
                    : "rgba(59, 130, 246, 0.1)",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--text-main)" }}
              >
                What you'll do next
              </div>
              <ul
                className="mt-2 space-y-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <li>• View your uploaded papers</li>
                <li>• Choose one paper to learn</li>
                <li>• Or compare two papers</li>
              </ul>
            </div>

            <div
              className="mt-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Don't have an account?{" "}
              <NavLink
                to="/signup"
                className="font-semibold hover:opacity-80 transition"
                style={{
                  color:
                    theme === "dark"
                      ? "rgb(147, 197, 253)"
                      : "rgb(59, 130, 246)",
                }}
              >
                Create one
              </NavLink>
            </div>
          </section>

          {/* Right: form */}
          <section
            style={{
              borderRadius: "1.5rem",
              border: `1px solid var(--border-main)`,
              backgroundColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(59, 130, 246, 0.08)",
              padding: "1.5rem",
              boxShadow:
                theme === "dark"
                  ? "0 0 40px rgba(59, 130, 246, 0.08)"
                  : "0 0 20px rgba(59, 130, 246, 0.05)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  style={{ color: "var(--text-main)" }}
                  className="text-sm font-medium"
                >
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    borderColor: "var(--border-main)",
                    color: "var(--text-main)",
                  }}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div>
                <label
                  style={{ color: "var(--text-main)" }}
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    borderColor: "var(--border-main)",
                    color: "var(--text-main)",
                  }}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <div className="mt-2 text-right">
                  <NavLink
                    to="/forget-password"
                    className="text-xs font-medium hover:opacity-80 transition"
                    style={{
                      color:
                        theme === "dark"
                          ? "rgb(147, 197, 253)"
                          : "rgb(59, 130, 246)",
                    }}
                  >
                    Forgot password?
                  </NavLink>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    borderRadius: "1rem",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    color: "rgb(254, 91, 91)",
                    padding: "1rem",
                  }}
                  className="text-sm"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor:
                    theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
                  borderRadius: "0.75rem",
                  boxShadow:
                    theme === "dark"
                      ? "0 0 35px rgba(59, 130, 246, 0.4)"
                      : "0 0 15px rgba(59, 130, 246, 0.2)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s",
                  color: "white",
                  padding: "0.75rem 1rem",
                  fontWeight: "600",
                }}
                className="font-semibold text-white"
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor =
                      theme === "dark"
                        ? "rgb(37, 99, 235)"
                        : "rgb(29, 78, 216)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor =
                    theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)";
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <NavLink
                to="/"
                style={{ color: "var(--text-muted)" }}
                className="hover:opacity-80 transition"
              >
                ← Back to Home
              </NavLink>

              <NavLink
                to="/signup"
                style={{
                  borderRadius: "0.75rem",
                  border: `1px solid var(--border-main)`,
                  backgroundColor: "var(--bg-main)",
                  color: "var(--text-main)",
                  padding: "0.5rem 1rem",
                  fontWeight: "600",
                }}
                className="hover:opacity-80 transition"
              >
                Sign Up
              </NavLink>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

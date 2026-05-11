import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useRegister } from "../../../hooks/useRegister";
import useTheme from "../../../hooks/useTheme";

export default function SignUpForm({ onSuccess }) {
  const { register, loading, error } = useRegister();
  const { theme } = useTheme();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  }

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
              Create your account
            </h1>

            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Sign up to save your papers, track your learning sessions, and
              continue anytime.
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
                What you'll get
              </div>
              <ul
                className="mt-2 space-y-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <li>• Your personal paper library</li>
                <li>• Socratic learning sessions</li>
                <li>• Paper comparison sessions</li>
              </ul>
            </div>

            <div
              className="mt-6 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Already have an account?{" "}
              <NavLink
                to="/signin"
                className="font-semibold hover:opacity-80 transition"
                style={{
                  color:
                    theme === "dark"
                      ? "rgb(147, 197, 253)"
                      : "rgb(59, 130, 246)",
                }}
              >
                Sign in
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
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <form onSubmit={onSubmit} className="space-y-4">
                {[
                  ["Username", "username", "text"],
                  ["First name", "firstName", "text"],
                  ["Last name", "lastName", "text"],
                  ["Email", "email", "email"],
                ].map(([label, name, type]) => (
                  <div key={name}>
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--text-main)" }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={{
                        backgroundColor: "var(--bg-main)",
                        borderColor: "var(--border-main)",
                        color: "var(--text-main)",
                      }}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                ))}

                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: "var(--text-main)" }}
                  >
                    Date of birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    style={{
                      backgroundColor: "var(--bg-main)",
                      borderColor: "var(--border-main)",
                      color: "var(--text-main)",
                    }}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                {[
                  ["Password", "password"],
                  ["Confirm password", "confirmPassword"],
                ].map(([label, name]) => (
                  <div key={name}>
                    <label
                      className="text-sm font-medium"
                      style={{ color: "var(--text-main)" }}
                    >
                      {label}
                    </label>
                    <input
                      type="password"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      style={{
                        backgroundColor: "var(--bg-main)",
                        borderColor: "var(--border-main)",
                        color: "var(--text-main)",
                      }}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                  </div>
                ))}

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
                    marginTop: "0.5rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "1rem",
                    backgroundColor:
                      theme === "dark"
                        ? "rgb(59, 130, 246)"
                        : "rgb(37, 99, 235)",
                    paddingLeft: "1.5rem",
                    paddingRight: "1.5rem",
                    paddingTop: "0.75rem",
                    paddingBottom: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "white",
                    boxShadow:
                      theme === "dark"
                        ? "0 0 35px rgba(59, 130, 246, 0.4)"
                        : "0 0 15px rgba(59, 130, 246, 0.2)",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1,
                    transition: "all 0.2s",
                  }}
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
                      theme === "dark"
                        ? "rgb(59, 130, 246)"
                        : "rgb(37, 99, 235)";
                  }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                <div
                  className="text-center text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  By creating an account, you agree to our terms.
                </div>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <NavLink
                  to="/signin"
                  style={{ color: "var(--text-muted)" }}
                  className="hover:opacity-80 transition"
                >
                  ← Back to Sign In
                </NavLink>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

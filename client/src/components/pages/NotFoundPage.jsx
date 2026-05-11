import { NavLink } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

export default function NotFoundPage() {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 text-center">
        <div
          style={{
            borderRadius: "1.5rem",
            border: `1px solid var(--border-main)`,
            backgroundColor:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(59, 130, 246, 0.08)",
            padding: "3rem",
            boxShadow:
              theme === "dark"
                ? "0 0 40px rgba(59, 130, 246, 0.08)"
                : "0 0 20px rgba(59, 130, 246, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontSize: "4rem",
              fontWeight: "700",
              lineHeight: "1",
              marginBottom: "1rem",
              background:
                "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(139, 92, 246) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>

          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--text-main)", marginBottom: "1rem" }}
          >
            Page Not Found
          </h1>

          <p
            className="mt-4 text-lg"
            style={{ color: "var(--text-muted)", marginBottom: "2rem" }}
          >
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-8 space-y-4 sm:flex sm:justify-center sm:gap-4 sm:space-y-0">
            <NavLink
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                backgroundColor:
                  theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "white",
                textDecoration: "none",
                boxShadow:
                  theme === "dark"
                    ? "0 0 35px rgba(59, 130, 246, 0.4)"
                    : "0 0 15px rgba(59, 130, 246, 0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "rgb(37, 99, 235)" : "rgb(29, 78, 216)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor =
                  theme === "dark" ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)";
              }}
            >
              ← Back to Home
            </NavLink>

            <NavLink
              to="/signin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                border: `1px solid var(--border-main)`,
                backgroundColor: "var(--bg-main)",
                color: "var(--text-main)",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              className="hover:opacity-80"
            >
              Sign In
            </NavLink>
          </div>
        </div>
      </main>
    </div>
  );
}

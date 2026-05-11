import { NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import HelperText from "./HelperText";
import useTheme from "../../hooks/useTheme";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("socratia_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Navbar({ variant = "home" }) {
  const user = getStoredUser();
  const displayName = user?.username || user?.fullName || user?.email || "User";
  const { theme, toggleTheme } = useTheme();

  const showHomeBtn =
    variant === "signin" || variant === "signup" || variant === "app";

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-4 py-3 sm:px-6">
        {/* Left: Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center gap-3">
            <img
              src="/logo_head.png"
              alt="Socratia Logo"
              className="h-9 w-9 rounded-2xl object-cover ring-1 ring-blue-400/30
                         shadow-[0_0_25px_rgba(59,130,246,0.25)]"
            />
            <div className="text-sm font-semibold tracking-wide">SOCRATIA</div>
          </NavLink>
        </div>

        {/* Middle: Welcome (app only) */}
        <div className="flex justify-center">
          {variant === "app" && (
            <div
              className="hidden sm:flex items-center gap-2 rounded-2xl border
                         px-4 py-2 text-sm font-semibold shadow"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-main)",
              }}
            >
              <span className="text-[var(--text-muted)]">Welcome,</span>
              <span>{displayName}</span>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end gap-3 text-sm">
          {showHomeBtn && (
            <NavLink
              to="/"
              className="rounded-xl border px-4 py-2 font-semibold transition"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-main)",
              }}
            >
              Home
            </NavLink>
          )}

          {/* 🌙 / ☀️ Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl border px-3 py-2 transition hover:scale-105"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
            }}
            title="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* Home: helper text inline + Sign In */}
          {variant === "home" && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-[var(--text-muted)]">
                Don’t have an account?{" "}
                <NavLink
                  to="/signup"
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Sign up
                </NavLink>
              </span>

              <NavLink
                to="/signin"
                className="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white dark:text-white
                           shadow-[0_0_30px_rgba(59,130,246,0.35)]
                           hover:bg-blue-400 transition"
              >
                Sign In
              </NavLink>
            </div>
          )}

          {/* App: user menu */}
          {variant === "app" && user && <UserMenu user={user} />}
        </div>
      </div>

      {/* Helper text row (NOT for home) */}
      {variant !== "home" && <HelperText variant={variant} />}
    </header>
  );
}

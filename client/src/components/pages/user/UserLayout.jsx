import { Navigate, Outlet, NavLink } from "react-router-dom";

export default function UserLayout() {
  const token = localStorage.getItem("socratia_token");

  if (!token) return <Navigate to="/signin" replace />;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
        backgroundImage:
          "radial-gradient(60% 40% at 50% 0%, rgba(59, 130, 246, 0.22), transparent 60%)",
      }}
    >
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* User navigation */}
        <div className="mb-8 flex gap-3">
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-semibold transition border`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive
                ? "rgb(59, 130, 246)"
                : "var(--bg-card)",
              borderColor: isActive
                ? "rgb(59, 130, 246)"
                : "var(--border-main)",
              color: isActive ? "white" : "var(--text-main)",
            })}
          >
            Profile
          </NavLink>

          <NavLink
            to="/user/security"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-semibold transition border`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive
                ? "rgb(59, 130, 246)"
                : "var(--bg-card)",
              borderColor: isActive
                ? "rgb(59, 130, 246)"
                : "var(--border-main)",
              color: isActive ? "white" : "var(--text-main)",
            })}
          >
            Security
          </NavLink>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

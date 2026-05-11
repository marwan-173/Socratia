import { Navigate, Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const token = localStorage.getItem("socratia_token");
  const user = JSON.parse(localStorage.getItem("socratia_user") || "null");

  if (!token) return <Navigate to="/signin" replace />;
  if (user?.role !== "admin") return <Navigate to="/workspace" replace />;

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
        {/* Admin navigation */}
        <div className="mb-8 flex gap-3">
          <NavLink
            to="/admin/users"
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
            Users
          </NavLink>
        </div>

        {/* Child page */}
        <Outlet />
      </main>
    </div>
  );
}

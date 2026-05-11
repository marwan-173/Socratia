import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../../lib/api.js";
import Modal from "../../Modal";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
    );
  }, [query, users]);

  async function onDelete(id, email) {
    if (!window.confirm(`Delete user: ${email}?`)) return;
    await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  async function onResetPassword(id, email) {
    const newPassword = window.prompt(
      `Set NEW password for ${email}\n(min 8 characters):`
    );
    if (!newPassword) return;

    await apiFetch(`/admin/users/${id}/password`, {
      method: "PATCH",
      body: { newPassword },
    });

    setModalTitle("Success");
    setModalMessage("Password reset successfully.");
    setModalOpen(true);
  }

  async function onChangeRole(id, email, currentRole) {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role for ${email} to ${nextRole}?`)) return;

    await apiFetch(`/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role: nextRole },
    });

    loadUsers();
  }

  return (
    <section
      className="rounded-3xl border p-6 shadow-lg backdrop-blur"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Manage users (delete, reset password, change role).
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name/email/role..."
          className="w-full sm:w-80 rounded-2xl border px-4 py-3 text-sm placeholder:opacity-50 outline-none ring-blue-500/40 focus:ring-2"
          style={{
            backgroundColor: "var(--bg-main)",
            borderColor: "var(--border-main)",
            color: "var(--text-main)",
          }}
        />
      </div>

      {error && (
        <div
          className="mb-4 rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(239, 68, 68, 0.2)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "rgb(239, 68, 68)",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ color: "var(--text-muted)" }}>
              <tr
                style={{
                  borderColor: "var(--border-main)",
                  borderBottomWidth: "1px",
                }}
              >
                <th className="py-3 pr-3">Username</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Role</th>
                <th className="py-3 pr-3">Created</th>
                <th className="py-3 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderColor: "var(--border-main)",
                    borderBottomWidth: "1px",
                    color: "var(--text-main)",
                  }}
                >
                  <td className="py-3 pr-3">{u.username || "—"}</td>
                  <td className="py-3 pr-3">{u.email}</td>
                  <td className="py-3 pr-3">{u.role}</td>
                  <td
                    className="py-3 pr-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex gap-2 flex-wrap">
                      {/* Reset password */}
                      <button
                        onClick={() => onResetPassword(u.id, u.email)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold border transition"
                        style={{
                          backgroundColor: "rgba(217, 119, 6, 0.1)",
                          borderColor: "rgba(217, 119, 6, 0.3)",
                          color: "rgb(217, 119, 6)",
                        }}
                      >
                        Reset
                      </button>

                      {/* Toggle role */}
                      <button
                        onClick={() => onChangeRole(u.id, u.email, u.role)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold border transition"
                        style={{
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          borderColor: "rgba(59, 130, 246, 0.3)",
                          color: "rgb(96, 165, 250)",
                        }}
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(u.id, u.email)}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold border transition"
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          borderColor: "rgba(239, 68, 68, 0.3)",
                          color: "rgb(239, 68, 68)",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      >
        <p style={{ color: "var(--text-main)" }}>{modalMessage}</p>
      </Modal>
    </section>
  );
}

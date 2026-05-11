import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

function clearAuthStorage() {
  localStorage.removeItem("socratia_token");
  localStorage.removeItem("socratia_user");
}

export default function UserMenu({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    message: "",
    title: "",
  });

  const displayName = user?.fullName || user?.email || "User";

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function logout() {
    clearAuthStorage();
    navigate("/signin", { replace: true });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border px-3 py-2 font-semibold transition"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
        }}
      >
        <span className="text-base">👤</span>
        <span className="hidden sm:inline text-sm">{displayName}</span>
        <span className="text-xs text-[var(--text-muted)]">▼</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border shadow-lg"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
        >
          {user && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/user/profile");
              }}
              className="w-full px-4 py-3 text-left text-sm transition"
              style={{
                color: "var(--text-main)",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              User Panel
            </button>
          )}
          {user?.role === "admin" && (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/users");
              }}
              className="w-full px-4 py-3 text-left text-sm text-blue-400 transition"
              onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Admin Panel
            </button>
          )}

          <button
            onClick={() => {
              setConfirmModal({
                open: true,
                type: "switch",
                title: "Switch Account",
                message: "Sign out and go to Sign In?",
              });
            }}
            className="w-full px-4 py-3 text-left text-sm transition"
            style={{
              color: "var(--text-main)",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Switch account
          </button>

          <button
            onClick={() => {
              setConfirmModal({
                open: true,
                type: "signout",
                title: "Sign Out",
                message: "Are you sure you want to sign out?",
              });
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-400 transition"
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Sign out
          </button>
        </div>
      )}

      <Modal
        open={confirmModal.open}
        title={confirmModal.title}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
      >
        <p style={{ color: "var(--text-main)", marginBottom: "1rem" }}>
          {confirmModal.message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setConfirmModal({ ...confirmModal, open: false });
              if (confirmModal.type === "switch") {
                setOpen(false);
                logout();
              } else if (confirmModal.type === "signout") {
                logout();
              }
            }}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfirmModal({ ...confirmModal, open: false })}
            className="flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition"
            style={{
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

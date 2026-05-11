import { useState } from "react";
import { apiFetch } from "../../../lib/api.js";
import Modal from "../../Modal.jsx";

export default function UserSecurityPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // success | error

  function openModal(type, title, message) {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  }

  async function updatePassword() {
    // Frontend validation
    if (!oldPassword || !newPassword || !confirm) {
      return openModal("error", "Missing fields", "All fields are required.");
    }
    if (newPassword.length < 8) {
      return openModal(
        "error",
        "Weak password",
        "New password must be at least 8 characters."
      );
    }
    if (newPassword !== confirm) {
      return openModal(
        "error",
        "Mismatch",
        "New password and confirmation do not match."
      );
    }

    try {
      setLoading(true);

      await apiFetch("/user/password", {
        method: "PATCH",
        body: { oldPassword, newPassword },
      });

      setOldPassword("");
      setNewPassword("");
      setConfirm("");

      openModal(
        "success",
        "Password updated",
        "Your password was updated successfully."
      );
    } catch (err) {
      // apiFetch غالبًا يرمي Error(message) من السيرفر
      openModal(
        "error",
        "Update failed",
        err?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section
        className="rounded-3xl border p-6 backdrop-blur"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
        }}
      >
        <h2
          className="mb-6 text-lg font-semibold"
          style={{ color: "var(--text-main)" }}
        >
          Security
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none ring-blue-500/40 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
              border: "1px solid",
            }}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none ring-blue-500/40 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
              border: "1px solid",
            }}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none ring-blue-500/40 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
              border: "1px solid",
            }}
          />
        </div>

        <button
          onClick={updatePassword}
          disabled={loading}
          className="mt-6 rounded-xl px-6 py-2.5 font-semibold transition hover:opacity-90 disabled:opacity-60 text-white"
          style={{
            backgroundColor: "rgb(59, 130, 246)",
          }}
        >
          {loading ? "Updating..." : "Change password"}
        </button>
      </section>

      <Modal
        open={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      >
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor:
              modalType === "success"
                ? "rgba(16, 185, 129, 0.2)"
                : "rgba(239, 68, 68, 0.2)",
            backgroundColor:
              modalType === "success"
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color:
              modalType === "success"
                ? "rgb(16, 185, 129)"
                : "rgb(239, 68, 68)",
          }}
        >
          {modalMessage}
        </div>

        <button
          onClick={() => setModalOpen(false)}
          className="mt-4 w-full rounded-xl px-4 py-2 font-semibold hover:bg-blue-400 transition text-white"
          style={{
            backgroundColor: "rgb(59, 130, 246)",
          }}
        >
          OK
        </button>
      </Modal>
    </>
  );
}

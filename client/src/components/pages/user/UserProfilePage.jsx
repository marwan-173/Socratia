import { useState } from "react";
import { apiFetch } from "../../../lib/api.js";
import Modal from "../../Modal";

export default function UserProfilePage() {
  const user = JSON.parse(localStorage.getItem("socratia_user") || "null");

  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  async function updateEmail() {
    if (!email) {
      setModalTitle("Validation Error");
      setModalMessage("Email is required");
      setModalOpen(true);
      return;
    }
    setLoading(true);

    await apiFetch("/user/email", {
      method: "PATCH",
      body: { email },
    });

    setModalTitle("Success");
    setModalMessage("Email updated successfully");
    setModalOpen(true);
    setLoading(false);
  }

  return (
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
        Profile
      </h2>

      {/* Email */}
      <div className="mb-6">
        <label
          className="mb-2 block text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Email
        </label>
        <div className="flex gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none ring-blue-500/40 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
              border: "1px solid",
            }}
          />
          <button
            onClick={updateEmail}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-blue-400 transition text-white"
            style={{
              backgroundColor: "rgb(59, 130, 246)",
            }}
          >
            Update
          </button>
        </div>
      </div>

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

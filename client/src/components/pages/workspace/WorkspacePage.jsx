import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api.js";
import WorkspaceHeader from "./components/WorkspaceHeader";
import ActionsBar from "./components/ActionsBar";
import PapersGrid from "./components/PapersGrid";
import ActivityPanel from "./components/ActivityPanel";

export default function WorkspacePage() {
  const navigate = useNavigate();
  const activityRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [confirmFile, setConfirmFile] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function loadChats() {
      try {
        const res = await apiFetch("/ai/chats");
        setChats(res.chats || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadChats();
  }, []);

  // 🔐 auth guard
  useEffect(() => {
    const token = localStorage.getItem("socratia_token");
    if (!token) window.location.href = "/signin";
  }, []);

  // ✅ LOAD FILES FROM DB
  useEffect(() => {
    async function loadFiles() {
      try {
        const res = await apiFetch("/files");
        setFiles(res.files || []);
      } catch (err) {
        console.error(err.message);
      }
    }

    loadFiles();
  }, []);

  const selectedFiles = useMemo(
    () => files.filter((f) => selected.includes(f.id)),
    [files, selected]
  );

  // ⬆️ upload (local preview)
  function onUploadFile(e) {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    const now = Date.now();
    const newFiles = picked.map((file, idx) => ({
      id: `local-${now}-${idx}`,
      name: file.name,
      meta: `PDF • ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      size: file.size,
      _localFile: file,
    }));

    setFiles((prev) => [...newFiles, ...prev]);
    e.target.value = "";
  }

  // 💾 save to DB
  async function onSaveFile(file) {
    const formData = new FormData();
    formData.append("file", file._localFile);

    const res = await fetch("/api/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("socratia_token")}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    // ✅ reload from DB
    const data = await apiFetch("/files");
    setFiles(data.files || []);
  }

  async function confirmDelete() {
    await apiFetch(`/files/${confirmFile.id}`, { method: "DELETE" });
    setFiles((prev) => prev.filter((f) => f.id !== confirmFile.id));
    setConfirmFile(null);
  }
  // 🗑 delete
  function onDeleteFile(file) {
    // local file
    if (file._localFile) {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      return;
    }

    // DB file →  popup
    setConfirmFile(file);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
      }}
    >
      <main className="mx-auto max-w-6xl px-4 py-10">
        <WorkspaceHeader />

        <ActionsBar
          selected={selected}
          setSelected={setSelected}
          selectedFiles={selectedFiles}
          navigate={navigate}
          onViewHistory={() =>
            activityRef.current?.scrollIntoView({ behavior: "smooth" })
          }
        />

        {confirmFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div
              className="w-80 rounded-2xl p-6"
              style={{
                backgroundColor: "var(--bg-card)",
              }}
            >
              <h3 className="text-sm font-semibold">Delete file?</h3>
              <p
                className="mt-2 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                This action cannot be undone.
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setConfirmFile(null)}
                  className="flex-1 rounded-xl py-2 text-xs transition"
                  style={{
                    backgroundColor: "var(--bg-main)",
                    borderColor: "var(--border-main)",
                    border: "1px solid",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl py-2 text-xs text-red-400 transition"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto_360px]">
          <PapersGrid
            files={files}
            selected={selected}
            setSelected={setSelected}
            onUploadFile={onUploadFile}
            onSaveFile={onSaveFile}
            onDeleteFile={onDeleteFile}
          />

          <div className="relative hidden lg:block h-full">
            <div
              className="mx-3 h-full w-px"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.35), transparent)",
              }}
            />
          </div>

          <ActivityPanel
            chats={chats}
            onOpenChat={(chat) => {
              console.log("OPEN CHAT:", chat);

              if (chat.type === "comparison") {
                const names = chat.title?.split(" vs ");

                navigate("/comparison", {
                  state: {
                    chatId: chat.chatId,
                    fileIds: chat.fileIds, // إن وُجدت
                    paperNames: names,
                    mode: "view",
                    sessionKey: "history",
                  },
                });
              } else {
                // socratic
                navigate("/socratic-session", {
                  state: {
                    chatId: chat.chatId,
                    fileId: chat.fileId,
                    paperName: chat.title || chat.paperName,
                    mode: "view",
                    sessionKey: "history",
                  },
                });
              }
            }}
            ref={activityRef}
          />
        </div>
      </main>
    </div>
  );
}

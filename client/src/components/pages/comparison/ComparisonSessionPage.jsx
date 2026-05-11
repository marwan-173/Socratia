import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../../../lib/api";

import ComparisonHeader from "./components/ComparisonHeader";
import ComparisonDialogue from "./components/ComparisonDialogue";
import SessionNotes from "../socratic/components/SessionNotes";
import useComparisonSession from "../../../hooks/useComparisonSession";

export default function ComparisonSessionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.state?.mode; // "view" | undefined
  const chatId = location.state?.chatId;
  const fileIds = location.state?.fileIds;
  const paperNames = location.state?.paperNames || ["Paper A", "Paper B"];
  const sessionKey = location.state?.sessionKey;

  const session = useComparisonSession({
    fileIds,
    sessionKey,
    enabled: mode !== "view",
  });

  const { setMessages } = session;
  const [notes, setNotes] = useState([]);

  // 🔐 Auth guard
  useEffect(() => {
    const token = localStorage.getItem("socratia_token");
    if (!token) window.location.href = "/signin";
  }, []);

  // 🛑 Protection
  useEffect(() => {
    if (mode !== "view") {
      if (!Array.isArray(fileIds) || fileIds.length !== 2) {
        navigate("/workspace");
      }
    }
  }, [fileIds, mode, navigate]);

  // 📥 Load old comparison chat
  useEffect(() => {
    if (mode === "view" && chatId) {
      apiFetch(`/ai/chats/${chatId}`).then((res) => {
        setMessages(res.chat?.messages || []);
        setNotes(res.chat?.notes || []);
      });
    }
  }, [mode, chatId]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
        backgroundImage:
          "radial-gradient(70% 45% at 50% 0%, rgba(59, 130, 246, 0.22), transparent 60%), radial-gradient(45% 30% at 15% 60%, rgba(168, 85, 247, 0.12), transparent 65%)",
      }}
    >
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ComparisonHeader
          paperA={paperNames[0]}
          paperB={paperNames[1]}
          onBack={() => navigate("/workspace")}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <ComparisonDialogue
            messages={session.messages}
            thinking={session.thinking}
            input={session.input}
            setInput={session.setInput}
            onSend={session.sendMessage} // ✅ THIS IS THE FIX
            bottomRef={session.bottomRef}
          />

          <SessionNotes
            chatId={session.chatId}
            notes={notes}
            readOnly={mode === "view"}
          />
        </div>
      </main>
    </div>
  );
}

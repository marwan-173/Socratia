import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api.js";

/**
 * useComparisonSession
 *
 * Manages a Socratic-style comparison session between TWO files.
 *
 * Guarantees:
 * - Auto-starts exactly once
 * - StrictMode-safe
 * - Stable chatId persisted in sessionStorage
 * - One chat per (fileIds + sessionKey)
 */
export default function useComparisonSession({
  fileIds,
  enabled = true,
  sessionKey,
}) {
  /* =========================================================
     CONSTANT REFERENCES
  ========================================================= */
  const bottomRef = useRef(null);
  const chatIdRef = useRef(null);
  const startedRef = useRef(false);

  /* =========================================================
     STATE
  ========================================================= */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  /* =========================================================
     CHAT ID INITIALIZATION
     
     - One chat per (fileIds + sessionKey)
     - Order-sensitive (A vs B ≠ B vs A)
  ========================================================= */
  useEffect(() => {
    if (!Array.isArray(fileIds) || fileIds.length !== 2 || !sessionKey) return;

    const keyPart = fileIds.join("_");
    const storageKey = `socratia_compare_${keyPart}_${sessionKey}`;

    let chatId = sessionStorage.getItem(storageKey);

    if (!chatId) {
      chatId = crypto.randomUUID();
      sessionStorage.setItem(storageKey, chatId);
      console.log("[COMPARE] New chatId generated:", chatId);
    } else {
      console.log("[COMPARE] Reusing chatId:", chatId);
    }

    chatIdRef.current = chatId;
    startedRef.current = false;
    setMessages([]);
  }, [fileIds]);

  /* =========================================================
     AUTO START (FIRST AI TURN)
  ========================================================= */
  useEffect(() => {
    if (!enabled) return;
    if (!Array.isArray(fileIds) || fileIds.length !== 2) return;
    if (!chatIdRef.current) return;

    const startedKey = `socratia_compare_started_${chatIdRef.current}`;
    if (sessionStorage.getItem(startedKey)) {
      console.log("[COMPARE] Auto-start already executed, skipping");
      return;
    }

    sessionStorage.setItem(startedKey, "1");
    setThinking(true);

    console.log("[COMPARE] Auto-start triggered", chatIdRef.current);

    apiFetch("/ai/compare", {
      method: "POST",
      body: {
        chatId: chatIdRef.current,
        fileIds,
        messages: [],
      },
    })
      .then((res) => {
        if (!res?.reply) throw new Error("Empty AI reply");

        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            text: res.reply,
          },
        ]);
      })
      .catch(() => {
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            text: "Let’s begin carefully. What do you think is the most fundamental difference between these two papers?",
          },
        ]);
      })
      .finally(() => {
        setThinking(false);
      });
  }, [fileIds, enabled]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  /* =========================================================
     SEND USER MESSAGE
  ========================================================= */
  async function sendMessage(text) {
    if (!enabled) return;
    if (!text.trim()) return;
    if (!chatIdRef.current) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setThinking(true);

    try {
      const res = await apiFetch("/ai/compare", {
        method: "POST",
        body: {
          chatId: chatIdRef.current,
          fileIds,
          messages: nextMessages,
        },
      });

      if (!res?.reply) throw new Error("Empty reply");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: res.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Let’s slow down. Compared to the other paper, what claim here feels weaker or stronger?",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  /* =========================================================
     PUBLIC API
  ========================================================= */
  return {
    messages,
    setMessages,
    input,
    setInput,
    thinking,
    sendMessage,
    bottomRef,
    isReadOnly: !enabled,
    chatId: chatIdRef.current,
  };
}

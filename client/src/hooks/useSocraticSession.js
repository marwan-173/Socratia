import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api.js";

/**
 * useSocraticSession
 *
 * Manages a single Socratic AI chat session per file.
 *
 * Key guarantees:
 * - Auto-starts the session automatically
 * - Starts ONLY ONCE (even in React StrictMode)
 * - Uses a stable chatId stored in sessionStorage
 * - Prevents duplicate chats and mixed languages
 */
export default function useSocraticSession({
  fileId,
  enabled = true,
  sessionKey,
}) {
  /* =========================================================
     CONSTANT REFERENCES (stable across renders)
  ========================================================= */
  const bottomRef = useRef(null); // For auto-scroll
  const chatIdRef = useRef(null); // Stable chat identity
  const startedRef = useRef(false); // Guards auto-start

  /* =========================================================
     STATE
  ========================================================= */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  /* =========================================================
     CHAT ID INITIALIZATION (StrictMode-safe)
     
     - One chatId per fileId
     - Persisted in sessionStorage
     - Survives mount/unmount cycles
  ========================================================= */
  useEffect(() => {
    if (!fileId || !sessionKey) return;

    const storageKey = `socratia_chat_${fileId}_${sessionKey}`;
    let chatId = sessionStorage.getItem(storageKey);

    if (!chatId) {
      chatId = crypto.randomUUID();
      sessionStorage.setItem(storageKey, chatId);
      console.log("[CHAT] New chatId generated:", chatId);
    } else {
      console.log("[CHAT] Reusing chatId:", chatId);
    }

    chatIdRef.current = chatId;
    //startedRef.current = false; // allow auto-start once per file
    setMessages([]);
  }, [fileId]);

  /* =========================================================
     AUTO START (FIRST AI TURN)
     
     - Runs automatically
     - Guaranteed to run ONCE
     - Safe under StrictMode
  ========================================================= */
  useEffect(() => {
    if (!enabled) return;
    if (!fileId) return;
    if (!chatIdRef.current) return;
    if (startedRef.current) return;

    startedRef.current = true;
    setThinking(true);

    console.log("[CHAT] Auto-start triggered", chatIdRef.current);

    apiFetch("/ai/chat", {
      method: "POST",
      body: {
        chatId: chatIdRef.current,
        fileId,
        messages: [],
      },
    })
      .then((res) => {
        if (!res?.reply) {
          throw new Error("Empty AI reply");
        }

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
            text: "Let’s begin together. As you read the document, what concept feels most central so far?",
          },
        ]);
      })
      .finally(() => {
        setThinking(false);
      });
  }, [fileId, enabled]);

  /* =========================================================
     AUTO SCROLL TO BOTTOM
  ========================================================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  /* =========================================================
     SEND USER MESSAGE (CONTINUE CHAT)
  ========================================================= */
  async function sendMessage(text) {
    if (!enabled) return;
    if (!text.trim()) return;
    if (!fileId || !chatIdRef.current) return;

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
      const res = await apiFetch("/ai/chat", {
        method: "POST",
        body: {
          chatId: chatIdRef.current,
          fileId,
          messages: nextMessages,
        },
      });

      if (!res?.reply) {
        throw new Error("Empty reply");
      }

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
          text: "Something went wrong. Let’s refocus — what part of the document seems most confusing right now?",
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
    setMessages, // used only for history/view mode
    input,
    setInput,
    thinking,
    sendMessage,
    bottomRef,
    isReadOnly: !enabled,
    chatId: chatIdRef.current,
  };
}

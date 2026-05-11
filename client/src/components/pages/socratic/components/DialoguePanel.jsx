import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function DialoguePanel({
  messages,
  input,
  setInput,
  thinking,
  sendMessage,
  bottomRef,
}) {
  return (
    <section
      className="rounded-3xl border shadow-lg backdrop-blur"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-main)",
      }}
    >
      <div
        className="border-b px-5 py-4"
        style={{
          borderColor: "var(--border-main)",
        }}
      >
        <div
          className="text-sm font-semibold"
          style={{ color: "var(--text-main)" }}
        >
          Socratic Dialogue
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Answer thoughtfully — the goal is understanding, not speed.
        </div>
      </div>

      <div className="h-[55vh] overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <MessageBubble key={m.id ?? i} {...m} />
        ))}

        {thinking && (
          <div
            className="mr-auto max-w-[90%] rounded-3xl border px-4 py-3 text-sm"
            style={{
              backgroundColor: "var(--bg-main)",
              borderColor: "var(--border-main)",
              color: "var(--text-muted)",
            }}
          >
            Socrates is thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput input={input} setInput={setInput} onSend={sendMessage} />
    </section>
  );
}

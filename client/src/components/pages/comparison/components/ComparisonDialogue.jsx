import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ComparisonDialogue({
  messages,
  thinking,
  input,
  setInput,
  onSend,
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
          Socratic Comparison Dialogue
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Compare with reasons: claim + evidence from each paper.
        </div>
      </div>

      <div className="h-[55vh] overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
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

      <div
        className="border-t px-5 py-4"
        style={{
          borderColor: "var(--border-main)",
        }}
      >
        <MessageInput input={input} setInput={setInput} onSend={onSend} />
      </div>
    </section>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className="max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed border"
      style={{
        marginLeft: isUser ? "auto" : "0",
        backgroundColor: isUser ? "var(--user-msg-bg)" : "var(--bg-main)",
        borderColor: isUser ? "var(--user-msg-border)" : "var(--border-main)",
        color: "var(--text-main)",
      }}
    >
      <div className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {isUser ? "You" : "Socrates"}
      </div>
      {message.text}
    </div>
  );
}

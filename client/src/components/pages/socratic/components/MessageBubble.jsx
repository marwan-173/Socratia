export default function MessageBubble({ role, text }) {
  return (
    <div
      className="max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-relaxed border"
      style={{
        marginLeft: role === "user" ? "auto" : "0",
        backgroundColor:
          role === "user" ? "var(--user-msg-bg)" : "var(--bg-main)",
        borderColor:
          role === "user" ? "var(--user-msg-border)" : "var(--border-main)",
        color: "var(--text-main)",
      }}
    >
      <div className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {role === "user" ? "You" : "Socrates"}
      </div>
      {text}
    </div>
  );
}

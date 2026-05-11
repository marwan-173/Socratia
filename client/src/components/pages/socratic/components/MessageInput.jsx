export default function MessageInput({ input, setInput, onSend }) {
  return (
    <div
      className="border-t px-5 py-4"
      style={{
        borderColor: "var(--border-main)",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          onSend(input);
        }}
        className="flex gap-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you think the author is trying to prove?"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!input.trim()) return;
              onSend(input);
            }
          }}
          className="flex-1 resize-none rounded-2xl border px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          style={{
            backgroundColor: "var(--bg-main)",
            borderColor: "var(--border-main)",
            color: "var(--text-main)",
          }}
        />

        <button
          type="submit"
          className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:bg-blue-400 transition"
          style={{
            backgroundColor: "rgb(59, 130, 246)",
          }}
        >
          Respond
        </button>
      </form>
    </div>
  );
}

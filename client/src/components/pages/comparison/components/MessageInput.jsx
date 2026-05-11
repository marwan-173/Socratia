export default function MessageInput({ input, setInput, onSend }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend(input);
      }}
      className="flex gap-3"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What is one key difference you can justify with evidence?"
        className="flex-1 rounded-2xl border px-4 py-3 text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
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
  );
}

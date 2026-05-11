import { forwardRef } from "react";

const ActivityPanel = forwardRef(({ chats, onOpenChat }, ref) => {
  return (
    <aside ref={ref}>
      <div className="mb-3 flex justify-between">
        <h2 className="text-sm font-semibold">Recent activity</h2>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Chats
        </span>
      </div>

      <div
        className="rounded-3xl border p-5 backdrop-blur"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
        }}
      >
        {chats.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            No chats yet.
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <button
                key={chat.chatId}
                onClick={() => onOpenChat(chat)}
                className="w-full text-left rounded-2xl p-4 transition"
                style={{
                  backgroundColor: "var(--bg-main)",
                  border: "1px solid var(--border-main)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-main)" }}
                >
                  {chat.paperName}
                </div>
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-main)" }}
                >
                  {chat.title}
                </div>

                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(chat.createdAt).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

export default ActivityPanel;

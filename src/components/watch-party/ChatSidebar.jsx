import ChatMessageItem from "./ChatMessageItem";
import ChatInput from "./ChatInput";
import { mockMessages } from "../../pages/WatchPartyPage";

const ChatSidebar = () => {
  return (
    <div className="flex flex-col h-full bg-bgSection rounded-lg overflow-hidden border border-white/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-cardBg border-b border-white/10">
        <h3 className="text-sm font-medium text-textPrimary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-textSecondary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
          แชทสด
        </h3>
        <span className="text-xs text-textMuted">
          {mockMessages.length} ข้อความ
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cardBg scrollbar-track-transparent">
        {mockMessages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
      </div>

      {/* Chat Input */}
      <ChatInput />
    </div>
  );
};

export default ChatSidebar;

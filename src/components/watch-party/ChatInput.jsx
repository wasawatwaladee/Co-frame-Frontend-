const ChatInput = () => {
  return (
    <div className="p-4 bg-bgSection border-t border-white/10">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="พิมพ์ข้อความ..."
          className="w-full bg-cardBg text-textPrimary placeholder-textMuted text-sm rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <button className="absolute right-2 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 transform -rotate-45 translate-x-0.5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

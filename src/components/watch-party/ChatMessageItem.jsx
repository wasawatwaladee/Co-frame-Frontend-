const ChatMessageItem = ({ message }) => {
  const { user, avatarColor, time, text } = message;
  const initial = user.charAt(0);

  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${avatarColor} ring-2 ring-black/20`}
      >
        {initial}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span
            className={`text-sm font-medium ${
              user === "มาร์ค" ? "text-primary" : "text-textPrimary"
            }`}
          >
            {user}
          </span>
          <span className="text-xs text-textMuted">{time}</span>
        </div>
        <p className="text-sm text-textSecondary leading-relaxed bg-white/5 p-2 rounded-r-lg rounded-bl-lg inline-block max-w-[90%]">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;

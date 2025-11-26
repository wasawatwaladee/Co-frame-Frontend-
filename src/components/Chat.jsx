// stream_project/frontend/src/components/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";

export default function Chat({ roomId }) {
  // --- ส่วน Logic เดิม ไม่เปลี่ยนแปลง ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesRef = useRef();
  const [myName, setMyName] = useState("");

  useEffect(() => {
    socket.on("your_name", (name) => {
      setMyName(name);
    });

    // listen for chat messages
    socket.on("receive_chat", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        messagesRef.current?.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 50);
    });

    // Optionally, you could request room_state to get chat history
    socket.on("room_state", (state) => {
      if (state?.chat) setMessages(state.chat);
    });

    return () => {
      socket.off("your_name");
      socket.off("receive_chat");
      socket.off("room_state");
    };
  }, [roomId]);

  const send = () => {
    if (!input) return;
    socket.emit("send_chat", { roomId, text: input });
    // setMessages((prev) => [...prev, { sender: "Me", text: input, ts: Date.now() }]); // (Comment เดิมของคุณ)
    setInput("");
  };
  // ------------------------------------

  // --- ส่วนแสดงผล (UI) แต่ง CSS ใหม่ ---
  return (
    <div className="flex flex-col h-full bg-[#111111] border-l border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-[#1a1a1a] flex justify-between items-center shadow-md">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Live Chat
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d50000] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d50000]"></span>
        </span>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#111111]"
      >
        {messages.map((m, i) => {
          // เช็คว่าเป็นข้อความของเราหรือไม่ เพื่อจัดซ้าย/ขวา และเปลี่ยนสี
          const isMe = m.sender === myName || m.sender === "Me";

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {/* ชื่อผู้ส่ง (แสดงเฉพาะคนอื่น) */}
                {!isMe && (
                  <span className="text-[10px] text-[#b3b3b3] mb-1 ml-1 font-medium">
                    {m.sender}
                  </span>
                )}

                {/* กล่องข้อความ */}
                <div
                  className={`px-3 py-2 text-sm wrap-break-words shadow-sm ${
                    isMe
                      ? "bg-[#d50000] text-white rounded-2xl rounded-tr-sm" // ของเรา: สีแดง
                      : "bg-[#1a1a1a] text-[#e0e0e0] rounded-2xl rounded-tl-sm border border-white/5" // คนอื่น: สีเทาเข้ม
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/10 bg-[#1a1a1a] flex items-center gap-2">
        <input
          className="flex-1 px-4 py-2.5 rounded-full bg-[#000000] text-[#ffffff] text-sm focus:outline-none focus:ring-1 focus:ring-[#d50000] placeholder-[#b3b3b3] border border-white/5"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="p-2.5 bg-[#d50000] rounded-full text-white hover:bg-[#b20000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
        >
          {/* Icon ส่งข้อความ (ลูกศร) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 transform -rotate-45 translate-x-0.5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

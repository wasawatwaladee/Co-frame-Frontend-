import { useEffect, useState, useRef } from "react";

import { socket } from "../socket";

export default function Chat({ roomId, user }) {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const messagesRef = useRef(null);
  console.log('socket', socket)

  const [myId, setMyId] = useState(user?.username || socket.id);

  useEffect(() => {
    
    socket.on("receive_chat", (msg) => {
      setMessages((prev) => [...prev, msg]);

      setTimeout(() => {
        messagesRef.current?.scrollTo({
          top: messagesRef.current.scrollHeight,

          behavior: "smooth",
        });
      }, 40);
    });

    socket.on("room_state", (state) => {
      if (state?.chat) setMessages(state.chat);

      // ⭐️ เพิ่มการอัปเดต myName จาก state.yourName
      if (state?.yourName) setMyId(state.yourName);
    });

    // Cleanup Listener
    return () => {
      socket.off("your_name"); 
      socket.off("receive_chat");
      socket.off("room_state");
    };
  }, [roomId, user]);

  const send = () => {
    if (!input.trim()) return;

    socket.emit("send_chat", {
      roomId,

      text: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesRef}
        className="flex-1 p-4 overflow-y-auto min-h-0 space-y-3"
      >
        {messages.map((m, i) => {
          // const isMe = m.sender === myName;
          const isMe = myId === m.socketId || myId === m.sender;
          console.log('m', m)
          console.log("m.sender", m.sender);
          console.log("myName", myId);

          return (
            <div
              key={i}
              className={`flex w-full ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-xl ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                
                  <div className="text-xs text-gray-400 mb-1">{m.sender}</div>
                

                <div>{m.text}</div>

                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(m.ts).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-md bg-[#1E1E1E] text-sm"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />

        <button onClick={send} className="px-3 py-2 bg-blue-600 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
}

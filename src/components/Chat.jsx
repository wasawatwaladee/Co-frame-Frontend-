// stream_project/frontend/src/components/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";

export default function Chat({ roomId }) {
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
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    });

    // Optionally, you could request room_state to get chat history (VideoPlayer receives room_state)
    socket.on("room_state", (state) => {
      if (state?.chat) setMessages(state.chat);
    });

    return () => {
      socket.off("your_name")
      socket.off("receive_chat");
      socket.off("room_state");
    };
  }, [roomId]);

  const send = () => {
    if (!input) return;
    socket.emit("send_chat", { roomId, text: input });
    setMessages((prev) => [...prev/* , { sender: "Me", text: input, ts: Date.now() } */]);
    setInput("");
  };

  return (
    <div className="fl
    ex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">Chat</h3>
      </div>

      <div ref={messagesRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i}>
            <div className="text-sm font-semibold">{m.sender}</div>
            <div className="text-sm text-gray-300">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-800 flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-md bg-[#1E1E1E] text-sm focus:outline-none"
          placeholder="Say something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="px-3 py-2 bg-blue-600 rounded-md">Send</button>
      </div>
    </div>
  );
}

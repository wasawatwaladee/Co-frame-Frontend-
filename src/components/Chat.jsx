import { useEffect, useState, useRef } from "react";

import { socket } from "../socket";
import { useNavigate } from "react-router";

export default function Chat({ roomId, user }) {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const messagesRef = useRef(null);
  
  const navigate = useNavigate()

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

  const handleSenderClick = (username) => {
      if (username && username !== "Unknown") {
          navigate(`/profile/${username}`);
      }
  };


  const send = () => {
    if (!input.trim()) return;

    socket.emit("send_chat", {
      roomId,

      text: input,
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div
        ref={messagesRef}
        className="flex-1 p-4 overflow-y-auto min-h-0 space-y-3"
      >
        {messages.map((m, i) => {
          // const isMe = m.sender === myName;
          const isMe = myId === m.socketId || myId === m.sender;
          const senderUsername = m.sender; // ใช้ชื่อผู้ส่งจาก Message Object
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
                    ? "bg-gradient-to-br from-red-600 to-red-950 text-white rounded-br-none"
                    : "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-200 rounded-bl-none"
                }`}
              >
                
                  <div 
                  className="text-xs mb-1 font-bold cursor-pointer transition-colors"
                  onClick={() => handleSenderClick(senderUsername)}
                  style={{ color: isMe ? '#e0f7fa' : '#a0a0a0' }}
                  >{m.sender}</div>
                

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

        <button 
          onClick={send} 
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:from-red-700 hover:to-red-800 transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-red-600/60 transform cursor-pointer flex items-center justify-center gap-2 min-w-fit"
          disabled={!input.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
          Send
        </button>
      </div>
    </div>
  );
}


// import { useEffect, useState, useRef } from "react";
// import { socket } from "../socket";
// import { useNavigate } from "react-router-dom"; // ⭐️ [UPDATE] ใช้ useNavigate จาก react-router-dom

// export default function Chat({ roomId, user }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesRef = useRef(null);
  
//   const navigate = useNavigate()

//   const [myId, setMyId] = useState(user?.username || socket.id);

//   useEffect(() => {
    
//     socket.on("receive_chat", (msg) => {
//       setMessages((prev) => [...prev, msg]);

//       setTimeout(() => {
//         messagesRef.current?.scrollTo({
//           top: messagesRef.current.scrollHeight,
//           behavior: "smooth",
//         });
//       }, 40);
//     });

//     socket.on("room_state", (state) => {
//       if (state?.chat) setMessages(state.chat);

//       // ⭐️ เพิ่มการอัปเดต myName จาก state.yourName
//       if (state?.yourName) setMyId(state.yourName);
//     });

//     // Cleanup Listener
//     return () => {
//       socket.off("your_name"); 
//       socket.off("receive_chat");
//       socket.off("room_state");
//     };
//   }, [roomId, user]);

//   const handleSenderClick = (username) => {
//       if (username && username !== "Unknown") {
//           navigate(`/profile/${username}`);
//       }
//   };


//   const send = () => {
//     if (!input.trim()) return;

//     socket.emit("send_chat", {
//       roomId,
//       text: input,
//     });

//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-full bg-[#121212]">
//       <div
//         ref={messagesRef}
//         // ⭐️ [CSS Enhancement] ปรับ Padding และ Scrollbar
//         className="flex-1 p-4 overflow-y-auto min-h-0 space-y-3 custom-scrollbar" 
//       >
//         {messages.map((m, i) => {
//           const isMe = myId === m.sender; 
//           const senderUsername = m.sender; 
          
//           return (
//             <div
//               key={i}
//               className={`flex w-full ${
//                 isMe ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 // ⭐️ [CSS Enhancement] Chat Bubble Style
//                 className={`max-w-[80%] px-4 py-3 rounded-xl shadow-md transition-all duration-200 ${
//                   isMe
//                     ? "bg-red-600 text-white rounded-br-sm"
//                     : "bg-gray-800 text-gray-200 rounded-tl-sm"
//                 }`}
//               >
                
//                   <div 
//                       className={`text-xs mb-1 font-semibold cursor-pointer transition-colors ${isMe ? 'text-red-100/90' : 'text-gray-400 hover:text-white'}`}
//                       onClick={() => handleSenderClick(senderUsername)}
//                       title={`View ${m.sender}'s Profile`}
//                   >
//                       {m.sender}
//                   </div>
                

//                 <div className="text-sm">{m.text}</div>

//                 <div className="text-[10px] text-gray-500 mt-1 flex justify-end">
//                   {new Date(m.ts).toLocaleTimeString()}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="p-4 border-t border-gray-700 flex items-center gap-2 bg-[#121212] shrink-0">
//         <input
//           // ⭐️ [CSS Enhancement] Input Style
//           className="flex-1 px-4 py-2 rounded-full bg-[#252525] border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
//           placeholder="Say something..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && send()}
//         />

//         <button 
//           onClick={send} 
//           // ⭐️ [CSS Enhancement] Send Button Style
//           className="px-4 py-2 bg-red-600 rounded-full text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
//           disabled={!input.trim()}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

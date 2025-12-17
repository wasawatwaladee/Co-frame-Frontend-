import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import useUserStore from "../stores/Store";
import { socket } from "../socket";
import authApi from "../api/api";

// คอมโพเนนต์ Modal สำหรับกรอกรหัสผ่าน
const PasswordModal = ({ joinError, roomPassword, setRoomPassword, handleJoinRoom }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000 animate-fade-in">
            {/* Blurred Background with Cinema Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-500"></div>
            
            {/* Modal Content */}
            <div className="relative bg-white text-zinc-900 rounded-3xl w-full max-w-sm mx-4 shadow-2xl shadow-black/80 border border-zinc-200 animate-cinema-enter overflow-hidden">
                {/* Cinema Light Effect */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 blur-[100px] rounded-full transition-all duration-300 ${
                    roomPassword.length > 3 ? 'bg-green-500/50' : 'bg-red-500/50'
                }`}></div>

                {/* Header */}
                <div className="relative px-6 py-5 text-center border-b border-zinc-200 bg-zinc-50">
                    <h2 className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text text-transparent uppercase drop-shadow-sm">
                        Enter Access Code
                    </h2>
                    <p className="text-zinc-600 text-xs mt-1.5 font-medium tracking-wide">
                        Verify your party password
                    </p>
                </div>

                {/* Content */}
                <div className="py-8 px-6">
                    {/* Password Input */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wide">Party Password</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={roomPassword}
                                onChange={(e) => setRoomPassword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom(roomPassword)}
                                className={`flex-1 px-3 py-2 rounded-lg bg-zinc-50 border-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
                                    roomPassword.length > 3 
                                        ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500' 
                                        : 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                                }`}
                            />
                            {/* Toggle Password Visibility Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-2 p-1 rounded-lg transition-colors cursor-pointer ${
                                    roomPassword.length > 3
                                        ? 'text-zinc-600 hover:text-green-600 hover:bg-green-100'
                                        : 'text-zinc-600 hover:text-red-600 hover:bg-red-100'
                                }`}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        {/* Password Character Count Indicator */}
                        {roomPassword && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-zinc-300 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-300 ${
                                            roomPassword.length > 3 
                                                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                                : 'bg-gradient-to-r from-red-500 to-red-600'
                                        }`}
                                        style={{ width: `${Math.min((roomPassword.length / 20) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className={`text-xs font-semibold whitespace-nowrap ${
                                    roomPassword.length > 3 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                }`}>
                                    {roomPassword.length} {roomPassword.length === 1 ? 'character' : 'characters'}
                                </span>
                            </div>
                        )}
                        
                        <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Your password is secure and encrypted
                        </p>
                    </div>
                    
                    {/* Error Message */}
                    {joinError && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg overflow-hidden">
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-600 shrink-0 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 text-xs font-semibold tracking-wide">{joinError}</p>
                            </div>
                        </div>
                    )}

                    {/* Enter Button */}
                    <button
                        onClick={() => handleJoinRoom(roomPassword)}
                        className={`w-full group relative overflow-hidden text-white py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
                            roomPassword.length > 3
                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]'
                                : 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)]'
                        }`}
                        disabled={!roomPassword}
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            roomPassword.length > 3
                                ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-400'
                                : 'bg-gradient-to-r from-red-400 via-red-500 to-red-400'
                        }`}></div>
                        <span className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                            <span>Enter Room</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}


export default function RoomPage() {
  // ⭐️ 1. Hooks ทั้งหมดต้องอยู่ระดับสูงสุดของฟังก์ชัน
  const { movieId, roomToken } = useParams();
  const [searchParams] = useSearchParams(); 
  const [movie, setMovie] = useState(null);

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [roomPassword, setRoomPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [joinError, setJoinError] = useState("");
  
  // รหัสผ่านจาก URL (สำหรับผู้สร้างห้อง)
  const creatorPassword = useRef(searchParams.get("pass")); 

  const isWatchParty = !!roomToken;
  // แก้ไข: ใช้ movie?.id เพื่อป้องกันการอ้างอิงถึง id ก่อนที่ movie จะถูกโหลด
  const roomId = isWatchParty ? `movie-${movie?.id}-${roomToken}` : `private-${movie?.id}`;


  // ⭐️ 2. useEffect สำหรับ Fetch Movie Data (ต้องมาก่อน Logic อื่น)
  useEffect(() => {
  if (!movieId) return;

    // ⭐️⭐️ เปลี่ยนจากการใช้ fetch ไปใช้ authApi.get() ⭐️⭐️
    authApi.get(`/movies/${movieId}`) 
      .then((resp) => {
        console.log('resp', resp)
        // เมื่อใช้ authApi/axios, response data อยู่ใน r.data แล้ว
        setMovie(resp.data);
      })
      .catch(console.error);

  }, [movieId]);


  // ⭐️ 3. ฟังก์ชันหลักในการส่งคำขอเข้าร่วมห้องไปยัง Socket Server
  const handleJoinRoom = (password) => {
    setJoinError("");
    
    // ใช้รหัสผ่านที่ติดมากับ URL ก่อน (สำหรับผู้สร้างห้อง) หรือรหัสผ่านที่กรอกใน Modal
    const passwordToSend = creatorPassword.current || password || "";

    if (isWatchParty && movie) { // ตรวจสอบว่า movie ถูกโหลดแล้ว
      // ส่งรหัสผ่านไปให้ Server ตรวจสอบ
      socket.emit("join_room", {
        roomId: `movie-${movie.id}-${roomToken}`, // ใช้อ้างอิงแบบเต็ม
        movieId: movie.id,
        roomPassword: passwordToSend, 
      });

      // รอผลการตรวจสอบจาก Server
      // ใช้ socket.once เพื่อรับ Event เพียงครั้งเดียวเมื่อมีการ Join Room
      socket.once("join_error", (data) => {
        setJoinError(data.message);
        setRoomPassword(""); 
      });

      // ถ้าเข้าห้องได้ (รับ State จาก Server)
      socket.once("room_state", () => {
          setShowPasswordModal(false);
      });
    } else if (!isWatchParty) {
        // Single Private Mode: เข้าได้เลย
        setShowPasswordModal(false);
    }
  };
  
  // ⭐️ 4. Effect สำหรับการจัดการสถานะเริ่มต้นเมื่อเข้าหน้า
  useEffect(() => {
    if (!movie) return; // รอยืนยันว่า movie ถูกโหลดแล้ว

    if (isWatchParty) {
        // ถ้าเป็นผู้สร้างห้อง (มี pass query param แม้เป็นค่าว่าง)
        // ตรวจสอบ creatorPassword.current ว่าไม่ใช่ null (หมายความว่ามี ?pass= อยู่ใน URL)
        if (creatorPassword.current !== null) { 
            handleJoinRoom(creatorPassword.current);
        } else {
            // ผู้เข้าร่วมห้อง: แสดง Modal เพื่อให้กรอกรหัสผ่าน
            setShowPasswordModal(true);
        }
    } else {
        // Single Private: ปิด Modal และเข้าหน้าทันที
        setShowPasswordModal(false);
    }
    
    // Cleanup Listener
    return () => {
        // ต้อง off listeners ที่ผูกด้วย socket.once ด้วย
        socket.off("join_error");
        socket.off("room_state");
    }
  }, [isWatchParty, movie, roomToken]); // เพิ่ม roomToken ใน Dependency Array

  // ----------------------------------------------------------------

  if (!movie) return <div className="p-6 text-white">Loading...</div>;

  // ⭐️ 5. การ Render ตามเงื่อนไข (อยู่ใน Top Level Return)
  if (isWatchParty && showPasswordModal) {
    return (
        <PasswordModal 
            joinError={joinError}
            roomPassword={roomPassword}
            setRoomPassword={setRoomPassword}
            handleJoinRoom={handleJoinRoom}
        />
    );
  }
  
  // โค้ดหลักเมื่อเข้าห้องได้แล้ว หรือเป็น Single Private
  return (
    <>
      

      <div className="w-full h-screen flex bg-black text-white overflow-hidden">
        <div className={`flex-1 bg-black flex items-center justify-center relative ${isWatchParty ? '' : 'w-full'}`}>
          <VideoPlayer 
            roomId={roomId} 
            movie={movie} 
            user={user} 
            isWatchParty={isWatchParty} 
          />
        </div>

        {isWatchParty && (
          <div className="w-[350px] bg-black border-l border-gray-800 flex flex-col">
            <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-centertext-lg text-red-600 font-bold">
              LIVE CHAT
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio-icon lucide-radio animate-pulse"><path d="M16.247 7.761a6 6 0 0 1 0 8.478"/><path d="M19.075 4.933a10 10 0 0 1 0 14.134"/><path d="M4.925 19.067a10 10 0 0 1 0-14.134"/><path d="M7.753 16.239a6 6 0 0 1 0-8.478"/><circle cx="12" cy="12" r="2"/></svg>
            </div>
            <div className="flex-1 min-h-0">
              <Chat roomId={roomId} user={user} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import VideoPlayer from "../components/VideoPlayer";
// import Chat from "../components/Chat";
// import useUserStore from "../stores/Store";
// import { socket } from "../socket";
// import authApi from "../api/api";

// // คอมโพเนนต์ Modal สำหรับกรอกรหัสผ่าน (ปรับปรุง Tailwind CSS)
// const PasswordModal = ({ joinError, roomPassword, setRoomPassword, handleJoinRoom }) => {
//     const [showPassword, setShowPassword] = useState(false);
    
//     return (
//         // ⭐️ [CSS Enhancement] Backdrop และ Animation
//         <div className="fixed inset-0 z-[100] flex items-center justify-center perspective-1000 animate-fade-in">
//             {/* Blurred Background with Cinema Overlay */}
//             <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500"></div>
            
//             {/* Modal Content */}
//             <div className="relative bg-[#1A1A1A] text-white rounded-xl w-full max-w-sm mx-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-red-800/20 animate-cinema-enter overflow-hidden">
//                 {/* Header */}
//                 <div className="relative px-6 py-5 text-center border-b border-red-800/30 bg-[#121212]">
//                     <h2 className="text-xl font-extrabold tracking-widest text-red-500 uppercase drop-shadow-md">
//                         Access Restricted
//                     </h2>
//                     <p className className="text-gray-400 text-sm mt-1 font-medium">
//                         Enter Party Password to join the room
//                     </p>
//                 </div>

//                 {/* Content */}
//                 <div className="py-8 px-6">
//                     {/* Password Input */}
//                     <div className="mb-6">
//                         <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Party Password</label>
//                         <div className="relative flex items-center">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="••••••••"
//                                 value={roomPassword}
//                                 onChange={(e) => setRoomPassword(e.target.value)}
//                                 onKeyDown={(e) => e.key === "Enter" && handleJoinRoom(roomPassword)}
//                                 className={`flex-1 px-4 py-3 rounded-lg bg-[#252525] border-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 w-full ${
//                                     roomPassword.length > 3 
//                                         ? 'border-green-600/50 focus:ring-green-500/50' 
//                                         : 'border-gray-600 focus:ring-red-500/50'
//                                 }`}
//                             />
//                             {/* Toggle Password Visibility Button */}
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 p-1 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-white"
//                                 title={showPassword ? "Hide password" : "Show password"}
//                             >
//                                 {showPassword ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>
                        
//                         {/* Password Character Count Indicator */}
//                         {roomPassword && (
//                             <div className="mt-2 flex items-center gap-2">
//                                 <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
//                                     <div 
//                                         className={`h-full transition-all duration-300 ${
//                                             roomPassword.length > 3 
//                                                 ? 'bg-green-500' 
//                                                 : 'bg-red-500'
//                                         }`}
//                                         style={{ width: `${Math.min((roomPassword.length / 20) * 100, 100)}%` }}
//                                     ></div>
//                                 </div>
//                                 <span className={`text-xs font-semibold whitespace-nowrap ${
//                                     roomPassword.length > 3 
//                                         ? 'text-green-500' 
//                                         : 'text-red-500'
//                                 }`}>
//                                     {roomPassword.length} characters
//                                 </span>
//                             </div>
//                         )}
                        
//                     </div>
                    
//                     {/* Error Message */}
//                     {joinError && (
//                         // ⭐️ [CSS Enhancement] Error Box
//                         <div className="mb-5 p-3 bg-red-900/30 border border-red-700/50 rounded-lg overflow-hidden">
//                             <div className="flex items-start gap-2">
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-400 shrink-0 mt-0.5">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.875a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <p className="text-red-300 text-sm font-medium tracking-wide">{joinError}</p>
//                             </div>
//                         </div>
//                     )}

//                     {/* Enter Button */}
//                     <button
//                         onClick={() => handleJoinRoom(roomPassword)}
//                         className={`w-full group relative overflow-hidden py-3 rounded-lg font-bold text-base uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ${
//                             roomPassword.length > 3
//                                 ? 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-900/30'
//                                 : 'bg-gray-700 text-gray-400 cursor-not-allowed'
//                         }`}
//                         disabled={!roomPassword || roomPassword.length < 1}
//                     >
//                         <span className="relative z-10 flex items-center justify-center gap-2">
//                             <span>Join Stream</span>
//                         </span>
//                     </button>
                    
//                     <p className="text-xs text-gray-600 mt-4">
//                         *If you are the creator, the password from the URL will be used.
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }


// export default function RoomPage() {
//   // ⭐️ 1. Hooks ทั้งหมดต้องอยู่ระดับสูงสุดของฟังก์ชัน
//   const { movieId, roomToken } = useParams();
//   const [searchParams] = useSearchParams(); 
//   const [movie, setMovie] = useState(null);

//   const user = useUserStore((state) => state.user);
//   const navigate = useNavigate();

//   const [roomPassword, setRoomPassword] = useState("");
//   const [showPasswordModal, setShowPasswordModal] = useState(true);
//   const [joinError, setJoinError] = useState("");
  
//   // รหัสผ่านจาก URL (สำหรับผู้สร้างห้อง)
//   const creatorPassword = useRef(searchParams.get("pass")); 

//   const isWatchParty = !!roomToken;
//   // แก้ไข: ใช้ movie?.id เพื่อป้องกันการอ้างอิงถึง id ก่อนที่ movie จะถูกโหลด
//   const roomId = isWatchParty ? `movie-${movie?.id}-${roomToken}` : `private-${movie?.id}`;


//   // ⭐️ 2. useEffect สำหรับ Fetch Movie Data (ต้องมาก่อน Logic อื่น)
//   useEffect(() => {
//   if (!movieId) return;

//     // ⭐️⭐️ เปลี่ยนจากการใช้ fetch ไปใช้ authApi.get() ⭐️⭐️
//     authApi.get(`/movies/${movieId}`) 
//       .then((resp) => {
//         console.log('resp', resp)
//         // เมื่อใช้ authApi/axios, response data อยู่ใน r.data แล้ว
//         setMovie(resp.data);
//       })
//       .catch(console.error);

//   }, [movieId]);


//   // ⭐️ 3. ฟังก์ชันหลักในการส่งคำขอเข้าร่วมห้องไปยัง Socket Server
//   const handleJoinRoom = (password) => {
//     setJoinError("");
    
//     // ใช้รหัสผ่านที่ติดมากับ URL ก่อน (สำหรับผู้สร้างห้อง) หรือรหัสผ่านที่กรอกใน Modal
//     const passwordToSend = creatorPassword.current || password || "";

//     if (isWatchParty && movie) { // ตรวจสอบว่า movie ถูกโหลดแล้ว
//       // ส่งรหัสผ่านไปให้ Server ตรวจสอบ
//       socket.emit("join_room", {
//         roomId: `movie-${movie.id}-${roomToken}`, // ใช้อ้างอิงแบบเต็ม
//         movieId: movie.id,
//         roomPassword: passwordToSend, 
//       });

//       // รอผลการตรวจสอบจาก Server
//       // ใช้ socket.once เพื่อรับ Event เพียงครั้งเดียวเมื่อมีการ Join Room
//       socket.once("join_error", (data) => {
//         setJoinError(data.message);
//         setRoomPassword(""); 
//       });

//       // ถ้าเข้าห้องได้ (รับ State จาก Server)
//       socket.once("room_state", () => {
//           setShowPasswordModal(false);
//       });
//     } else if (!isWatchParty) {
//         // Single Private Mode: เข้าได้เลย
//         setShowPasswordModal(false);
//     }
//   };
  
//   // ⭐️ 4. Effect สำหรับการจัดการสถานะเริ่มต้นเมื่อเข้าหน้า
//   useEffect(() => {
//     if (!movie) return; // รอยืนยันว่า movie ถูกโหลดแล้ว

//     if (isWatchParty) {
//         // ถ้าเป็นผู้สร้างห้อง (มี pass query param แม้เป็นค่าว่าง)
//         // ตรวจสอบ creatorPassword.current ว่าไม่ใช่ null (หมายความว่ามี ?pass= อยู่ใน URL)
//         if (creatorPassword.current !== null) { 
//             handleJoinRoom(creatorPassword.current);
//         } else {
//             // ผู้เข้าร่วมห้อง: แสดง Modal เพื่อให้กรอกรหัสผ่าน
//             setShowPasswordModal(true);
//         }
//     } else {
//         // Single Private: ปิด Modal และเข้าหน้าทันที
//         setShowPasswordModal(false);
//     }
    
//     // Cleanup Listener
//     return () => {
//         // ต้อง off listeners ที่ผูกด้วย socket.once ด้วย
//         socket.off("join_error");
//         socket.off("room_state");
//     }
//   }, [isWatchParty, movie, roomToken]); // เพิ่ม roomToken ใน Dependency Array

//   // ----------------------------------------------------------------

//   if (!movie) return <div className="p-6 text-white">Loading...</div>;

//   // ⭐️ 5. การ Render ตามเงื่อนไข (อยู่ใน Top Level Return)
//   if (isWatchParty && showPasswordModal) {
//     return (
//         <PasswordModal 
//             joinError={joinError}
//             roomPassword={roomPassword}
//             setRoomPassword={setRoomPassword}
//             handleJoinRoom={handleJoinRoom}
//         />
//     );
//   }
  
//   // โค้ดหลักเมื่อเข้าห้องได้แล้ว หรือเป็น Single Private
//   return (
//     <>
//       <div className="w-full h-screen flex bg-[#0A0A0A] text-white overflow-hidden">
        
//         {/* ⭐️ [CSS Enhancement] Video Player Section */}
//         <div className={`flex-1 bg-[#0A0A0A] flex flex-col ${isWatchParty ? '' : 'w-full'}`}>
//           <VideoPlayer 
//             roomId={roomId} 
//             movie={movie} 
//             user={user} 
//             isWatchParty={isWatchParty} 
//           />
//         </div>

//         {isWatchParty && (
//           // ⭐️ [CSS Enhancement] Chat Sidebar
//           <div className="w-[350px] bg-[#121212] border-l border-gray-800 flex flex-col shadow-2xl">
//             <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center font-bold text-xl text-red-500 uppercase tracking-wider">
//               Live Chat
//             </div>
//             <div className="flex-1 min-h-0">
//               <Chat roomId={roomId} user={user} />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
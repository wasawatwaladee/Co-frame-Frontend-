import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import { siteConfig } from "../constant/config";
import useUserStore from "../stores/Store";
import { socket } from "../socket";

// คอมโพเนนต์ Modal สำหรับกรอกรหัสผ่าน
const PasswordModal = ({ joinError, roomPassword, setRoomPassword, handleJoinRoom }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 text-black shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Join Watch Party
                </h2>
                <p className="text-sm text-center text-gray-500 mb-4">
                    โปรดกรอกรหัสผ่านเพื่อเข้าห้อง
                </p>
                
                <input
                    type="password"
                    placeholder="Room Password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinRoom(roomPassword)}
                    className="w-full px-4 py-2 rounded-lg border mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                {joinError && (
                    <p className="text-red-500 text-sm mb-3">{joinError}</p>
                )}

                <button
                    onClick={() => handleJoinRoom(roomPassword)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold"
                >
                    Join Room
                </button>

               
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

    fetch(`${siteConfig.SERVER_URL}/movies/${movieId}`)
      .then((r) => r.json())
      .then(setMovie)
      .catch(console.error);

  }, [movieId]);
  console.log('movie from roompage', movie)
  console.log('movieId', movieId)

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
      <button onClick={() => navigate("/")}>Back</button>

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
          <div className="w-[350px] bg-[#121212] border-l border-gray-800 flex flex-col">
            <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center font-semibold text-lg">
              Stream
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
// MovieCard.jsx (ปรับปรุงสำหรับ Password Modal)
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/Store";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [code, setCode] = useState("")
  const [partyPassword, setPartyPassword] = useState("") // ⭐️ เพิ่ม state สำหรับรหัสผ่านห้อง

  const openSingle = ()=>{
    navigate(`/room/${movie.id}`)
  }

  const openParty = () => {
    const token = Math.random().toString(36).slice(2,9).toUpperCase()
    setCode(token)
    // ⭐️ ไม่ต้องรีเซ็ตรหัสผ่านตรงนี้ เพราะผู้ใช้เพิ่งกรอก
    // แต่เปิด Modal
  }

  const startParty = () => {
    // ⭐️ ส่งรหัสผ่านไปเป็น Query Parameter (เข้ารหัส URI เพื่อความปลอดภัย)
    const encodedPassword = encodeURIComponent(partyPassword);
    navigate(`/room/${movie.id}/${code}${partyPassword ? `?pass=${encodedPassword}` : ''}`);
  }


  return (
    <div>
    <div className="group relative cursor-pointer">
       <button onClick={()=>setIsModalOpen(true)}>

      <div className="aspect-2/3 w-full overflow-hidden rounded-lg bg-cardBg shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl">
        {/* Poster Image */}
       
        <img
          src={movie.thumbnail }
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
       

        {/* Overlay (Gradient & Info) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-ratingGold text-xs">★</span>
            <span className="text-xs text-textSecondary font-medium">
              {movie.rating}
            </span>
          </div>
        </div>
      </div>
       </button>
    </div>
    {/* Modal */}
    {(isModalOpen && user) && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-black shadow-xl">

            {!code && (
              <>
                <h2 className="text-lg font-bold mb-4 text-center">
                  Choose Watching Mode
                </h2>

                <button
                  onClick={openSingle}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3 font-semibold"
                >
                  Single Private
                </button>
                
               

                <button
                  onClick={openParty}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold"
                >
                  Watch Party
                </button>
              </>
            )}



            
            {code && (
              <div className="text-center">
                <h3 className="font-semibold">Your Party Code</h3>
                <p className="text-2xl font-bold my-3">{code}</p>

                {partyPassword && (
                    <p className="text-sm text-gray-500 mb-4">Password: {partyPassword}</p>
                )}

                <button
                  onClick={startParty}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
                >
                  Start Party
                </button>
              </div>
            )}
             <button
              className="mt-4 w-full text-center text-gray-600 text-sm"
              onClick={() => {
                setCode("");
                setPartyPassword("");
                setIsModalOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
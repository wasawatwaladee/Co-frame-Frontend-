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
       <button onClick={()=>setIsModalOpen(true)} className="cursor-pointer">

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
        <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000 animate-fade-in">
          {/* Blurred Background with Cinema Overlay */}
          <div className="absolute inset-0 bg-black/80 transition-opacity duration-500" onClick={() => {
            setCode("");
            setPartyPassword("");
            setIsModalOpen(false);
          }}></div>
          
          {/* Modal Content */}
          <div className={`relative bg-white text-zinc-900 rounded-3xl w-full mx-4 shadow-2xl shadow-black/80 border border-zinc-200 animate-cinema-enter overflow-hidden transition-all duration-500 ${code ? 'max-w-lg' : 'max-w-3xl'}`}>
            {/* Cinema Light Effect */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 blur-[100px] rounded-full transition-all duration-300 ${
              code ? 'bg-green-500/50' : 'bg-blue-500/50'
            }`}></div>

            {/* Header */}
            <div className={`relative px-8 text-center border-b border-zinc-200 bg-zinc-50 transition-all duration-500 ${code ? 'py-4' : 'py-8'}`}>
              <h2 className={`font-black tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600 bg-clip-text text-transparent uppercase drop-shadow-sm transition-all duration-500 ${code ? 'text-lg' : 'text-3xl md:text-4xl'}`}>
                Select Experience
              </h2>
              <p className={`text-zinc-600 font-medium tracking-wide transition-all duration-500 ${code ? 'text-xs mt-1' : 'text-sm md:text-base mt-2'}`}>
                {code ? 'Share your party code' : 'Choose how you want to enjoy this title'}
              </p>
            </div>

            {/* Content */}
            <div className={`flex items-center justify-center transition-all duration-500 ${code ? 'p-6 min-h-auto' : 'p-8 md:p-12 min-h-[400px]'}`}>
              {!code ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {/* Single Private Box */}
                  <div
                    onClick={openSingle}
                    className="group relative h-64 overflow-hidden rounded-2xl bg-zinc-50 border-2 border-zinc-200 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-zinc-50 transition-opacity duration-500 group-hover:opacity-80"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="mb-6 p-4 bg-blue-100 rounded-full border border-blue-300 group-hover:bg-blue-200 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-wide group-hover:text-blue-600 transition-colors">Private Screening</h3>
                      <p className="text-zinc-600 text-sm font-medium group-hover:text-zinc-700">Immersive solo experience</p>
                    </div>
                  </div>

                  {/* Watch Party Box */}
                  <div
                    onClick={openParty}
                    className="group relative h-64 overflow-hidden rounded-2xl bg-zinc-50 border-2 border-zinc-200 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-zinc-50 transition-opacity duration-500 group-hover:opacity-80"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                      <div className="mb-6 p-4 bg-purple-100 rounded-full border border-purple-300 group-hover:bg-purple-200 group-hover:border-purple-400 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2 tracking-wide group-hover:text-purple-600 transition-colors">Watch Party</h3>
                      <p className="text-zinc-600 text-sm font-medium group-hover:text-zinc-700">Stream with friends</p>
                    </div>
                  </div>
                </div>
              ) : code ? (
                <div className="flex flex-col items-center justify-center w-full animate-fade-in">
                  <div className="relative w-full max-w-md p-8 rounded-2xl bg-zinc-50 border-2 border-zinc-200 text-center overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-green-500/50 blur-[50px]"></div>

                    <div className="mb-8 p-5 bg-green-100 rounded-full inline-flex border border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v9.651c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                      </svg>
                    </div>
                    
                    <p className="text-zinc-700 text-sm font-bold tracking-widest uppercase mb-4">Your Party Ticket</p>
                    <div className="relative mb-8 p-4 bg-white rounded-xl border border-zinc-300">
                      <p className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 drop-shadow-lg font-mono">
                        {code}
                      </p>
                    </div>

                    <p className="text-zinc-600 text-xs mb-6">Share this code with friends to join your party</p>

                    <button
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-4 cursor-pointer"
                      onClick={startParty}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                        <span>Start Party</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </button>

                    <button
                      className="text-zinc-500 hover:text-zinc-700 transition-colors text-xs font-medium py-2 w-full cursor-pointer"
                      onClick={() => {
                        setCode("");
                        setPartyPassword("");
                      }}
                    >
                      Select Different Mode
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setCode("");
                setPartyPassword("");
                setIsModalOpen(false);
              }}
              className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all duration-300 z-20 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
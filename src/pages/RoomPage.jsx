import React, { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";

export default function RoomPage() {
  const { movieId, roomToken } = useParams();
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;
    const url = (import.meta.env.VITE_SERVER_URL || "http://localhost:5500") + `/movies/${movieId}`;
    console.log("url",url)
    fetch(url)
      .then((r) => r.json())
      .then(setMovie)
      .catch((e) => {
        console.error(e);
      });
  }, [movieId]);

  if (!movie) return <div className="p-6 text-white">Loading movie...</div>;

  const roomId = `movie-${movie.id}-${roomToken || "default"}`;




  return (
    <>
    <button onClick={()=>navigate('/')}>Back</button>

    <div className="w-full h-screen flex bg-black text-white overflow-hidden">
      
      {/* LEFT — Video */}
      <div className="flex-1 bg-black flex items-center justify-center relative">
        <VideoPlayer roomId={roomId} movie={movie} />
      </div>

      {/* RIGHT — Chat */}
      <div className="w-[350px] bg-[#121212] border-l border-gray-800 flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center font-semibold text-lg">
          Stream
          <div className="flex items-center gap-4 text-gray-300">
            <button>⚙️</button>
            <button>🔗</button>
          </div>
        </div>

        <div className="flex-1">
          <Chat roomId={roomId} />
        </div>
      </div>
    </div>
    </>
  );
}

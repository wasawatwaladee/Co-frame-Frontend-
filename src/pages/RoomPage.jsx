import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import { siteConfig } from "../constant/config";
import useUserStore from "../stores/Store";

export default function RoomPage() {
  const { movieId, roomToken } = useParams();
  const [movie, setMovie] = useState(null);

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieId) return;

    fetch(`${siteConfig.SERVER_URL}/movies/${movieId}`)
      .then((r) => r.json())
      .then(setMovie)
      .catch(console.error);
  }, [movieId]);

  if (!movie) return <div className="p-6 text-white">Loading...</div>;

  const roomId = `movie-${movie.id}-${roomToken || "default"}`;

  return (
    <>
      <button onClick={() => navigate("/")}>Back</button>

      <div className="w-full h-screen flex bg-black text-white overflow-hidden">
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <VideoPlayer roomId={roomId} movie={movie} user={user} />
        </div>

        <div className="w-[350px] bg-[#121212] border-l border-gray-800 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center font-semibold text-lg">
            Stream
          </div>

          <div className="flex-1 min-h-0">
            <Chat roomId={roomId} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}


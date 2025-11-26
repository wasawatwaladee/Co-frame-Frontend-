import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";

export default function RoomPage() {
  const { movieId, roomToken } = useParams();
  const navigate = useNavigate();

  // State
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatMobile, setShowChatMobile] = useState(false); // สำหรับเปิด/ปิดแชทในมือถือ

  // Room ID Logic
  const roomId = `movie-${movieId}-${roomToken || "default"}`;

  useEffect(() => {
    if (!movieId) return;

    // URL Backend
    const serverUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:5500";
    const url = `${serverUrl}/movies/${movieId}`;

    setIsLoading(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Movie not found");
        return r.json();
      })
      .then((data) => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("ไม่พบข้อมูลภาพยนตร์ หรือเซิร์ฟเวอร์มีปัญหา");
        setIsLoading(false);
      });
  }, [movieId]);

  // Function: Copy Link to Clipboard
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("คัดลอกลิงก์เรียบร้อย! ส่งให้เพื่อนได้เลย");
  };

  // --- 1. Loading State ---
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-bgMain flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-textSecondary animate-pulse">
          กำลังเตรียมโรงหนัง...
        </p>
      </div>
    );
  }

  // --- 2. Error State ---
  if (error || !movie) {
    return (
      <div className="h-screen w-full bg-bgMain flex flex-col items-center justify-center gap-6 text-white p-4 text-center">
        <div className="bg-bgSection p-6 rounded-lg border border-white/10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-primary mb-2">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-textSecondary mb-6">
            {error || "ไม่พบภาพยนตร์ที่คุณต้องการ"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-md transition-colors font-medium"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // --- 3. Main UI (Room) ---
  return (
    <div className="flex flex-col h-screen bg-bgMain text-textPrimary overflow-hidden font-sans">
      {/* === HEADER (Top Bar) === */}
      <header className="h-14 bg-bgSection border-b border-white/5 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 relative shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-textSecondary hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all group shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">ออก</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

          <h1 className="text-sm lg:text-base font-semibold text-textPrimary truncate">
            {movie.title}
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded border border-primary/20 text-xs font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            ชวนเพื่อน
          </button>

          {/* Mobile Chat Toggle Button */}
          <button
            onClick={() => setShowChatMobile(!showChatMobile)}
            className="lg:hidden p-2 text-textSecondary hover:text-white bg-white/5 rounded-md relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            {/* Dot notification indicator (Optional) */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-bgSection"></span>
          </button>
        </div>
      </header>

      {/* === CONTENT AREA === */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. LEFT: Video Player (Expand to fill) */}
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-linear-to-b from-bgSection/20 to-transparent pointer-events-none"></div>

          <VideoPlayer roomId={roomId} movie={movie} />
        </div>

        {/* 2. RIGHT: Chat Sidebar */}
        {/* Desktop: Always visible | Mobile: Toggled via state */}
        <div
          className={`
                fixed inset-y-0 right-0 z-30 w-full sm:w-[350px] bg-bgSection border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out
                lg:relative lg:transform-none lg:translate-x-0 lg:block
                ${showChatMobile ? "translate-x-0" : "translate-x-full"}
            `}
        >
          {/* Mobile Close Chat Button */}
          <div className="lg:hidden flex items-center justify-between p-3 border-b border-white/10 bg-bgSection">
            <span className="text-sm font-semibold">Live Chat</span>
            <button
              onClick={() => setShowChatMobile(false)}
              className="p-1 hover:bg-white/10 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Component */}
          <div className="h-full lg:h-auto flex flex-col">
            <Chat roomId={roomId} />
          </div>
        </div>

        {/* Mobile Overlay (Click to close chat) */}
        {showChatMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setShowChatMobile(false)}
          ></div>
        )}
      </div>
    </div>
  );
}

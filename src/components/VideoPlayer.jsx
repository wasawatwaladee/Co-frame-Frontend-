// stream_project/frontend/src/components/VideoPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

// Helper function จัดรูปแบบเวลา 00:00:00
const formatTime = (seconds) => {
  if (!seconds) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoPlayer({ roomId, movie }) {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  // States
  const [status, setStatus] = useState({ playing: false, time: 0 });
  const [info, setInfo] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // สำหรับ Update UI
  const [showControls, setShowControls] = useState(true); // สำหรับซ่อน/แสดงปุ่ม
  const [volume, setVolume] = useState(1);

  const DRIFT_THRESHOLD = 0.5;
  let controlsTimeout = null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // join room on mount
    socket.emit("join_room", { roomId, movieId: movie.id });

    // receive initial room state
    socket.on("room_state", (state) => {
      setStatus({ playing: state.playing, time: state.time });
      syncToState(state);
      setInfo("Synced");
    });

    // receive remote action
    socket.on("player_action", ({ action, currentTime }) => {
      applyRemoteAction(action, currentTime);
    });

    // --- Event Listeners สำหรับ Socket Logic (คงเดิมไว้) ---
    const onPlay = () => {
      const t = video.currentTime;
      socket.emit("player_action", { roomId, action: "play", currentTime: t });
      setStatus((s) => ({ ...s, playing: true, time: t }));
    };
    const onPause = () => {
      const t = video.currentTime;
      socket.emit("player_action", { roomId, action: "pause", currentTime: t });
      setStatus((s) => ({ ...s, playing: false, time: t }));
    };
    const onSeeked = () => {
      const t = video.currentTime;
      socket.emit("player_action", { roomId, action: "seek", currentTime: t });
      setStatus((s) => ({ ...s, time: t }));
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime); // Update UI
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      socket.off("room_state");
      socket.off("player_action");
    };
  }, [roomId, movie.id]);

  // --- Logic Sync Video (คงเดิมไว้) ---
  function syncToState(state) {
    const v = videoRef.current;
    if (!v) return;
    const desired = state.time || 0;
    const drift = Math.abs(v.currentTime - desired);

    if (drift > DRIFT_THRESHOLD) {
      v.currentTime = desired;
    }
    if (state.playing) {
      const p = v.play();
      if (p && p.catch) p.catch(() => setInfo("Click play to start"));
    } else {
      v.pause();
    }
  }

  function applyRemoteAction(action, currentTime) {
    const v = videoRef.current;
    if (!v) return;

    const drift = Math.abs(v.currentTime - currentTime);
    if (drift > DRIFT_THRESHOLD) {
      v.currentTime = currentTime;
    }

    if (action === "play") {
      const p = v.play();
      if (p && p.catch) p.catch(() => setInfo("Click play to start"));
    } else if (action === "pause") {
      v.pause();
    }
  }

  // --- UI Interactions ---

  const handlePlayPause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    const bar = progressBarRef.current;
    if (!v || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * v.duration;

    v.currentTime = newTime; // This triggers 'seeked' -> socket emit
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Progress Bar Width Calculation
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="w-full h-full relative bg-black group overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 1. Video Element (ซ่อน Native Controls) */}
      <video
        ref={videoRef}
        src={movie.video_url}
        className="w-full h-full object-contain pointer-events-none" // pointer-events-none เพื่อให้คลิกที่ Container หลักแทน
        playsInline
      />

      {/* 2. Big Center Play Button (Overlay) */}
      {(!status.playing || info) && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="flex flex-col items-center gap-4">
            <button className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-primary/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {info && (
              <div className="text-white bg-black/70 px-4 py-1 rounded-full text-sm animate-pulse">
                {info}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Custom Control Bar (Bottom Overlay) */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-6 z-20 transition-opacity duration-300 ${
          showControls || !status.playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar Container */}
        <div
          className="relative h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/bar flex items-center"
          ref={progressBarRef}
          onClick={handleSeek}
        >
          {/* Played Line */}
          <div
            className="absolute left-0 h-full bg-primary rounded-full"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Thumb (Dot) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform"></div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="hover:text-primary transition-colors"
            >
              {status.playing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Time Display */}
            <div className="flex items-center gap-1 text-sm font-medium tracking-wide">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/70">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Side: Volume / Title */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-white/90 hidden md:block">
              {movie.title}
            </span>
            {/* (Optional) Volume Icon Placeholder */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white/70 hover:text-white cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// stream_project/frontend/src/components/VideoPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

export default function VideoPlayer({ roomId, movie }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ playing: false, time: 0 });
  const [info, setInfo] = useState("Not synced yet");
  const DRIFT_THRESHOLD = 0.5;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // join room on mount
    socket.emit("join_room", { roomId, movieId: movie.id });

    // receive initial room state (and chat history)
    socket.on("room_state", (state) => {
      setStatus({ playing: state.playing, time: state.time });
      syncToState(state);
      setInfo("Synced to room state");
    });

    // receive remote action (others' play/pause/seek)
    socket.on("player_action", ({ action, currentTime }) => {
      applyRemoteAction(action, currentTime);
    });

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

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", onSeeked);
      socket.off("room_state");
      socket.off("player_action");
    };
  }, [roomId, movie.id]);

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
      if (p && p.catch) p.catch(() => {
        setInfo("Autoplay blocked — click play to start");
      });
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
      if (p && p.catch) p.catch(() => {
        setInfo("Autoplay blocked — click play to start");
      });
    } else if (action === "pause") {
      v.pause();
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <video
        ref={videoRef}
        src={movie.video_url}
        controls
        className="w-full h-[70vh] bg-black object-contain"
      />
      <div className="p-4 text-sm text-gray-300">
        <div><strong>Status:</strong> {status.playing ? "Playing" : "Paused"} — time: {status.time.toFixed(2)}s</div>
        <div className="text-xs mt-2 text-gray-500">{info}</div>
        <div className="mt-2 text-xs text-gray-500">If autoplay blocked, click play once.</div>
      </div>
    </div>
  );
}

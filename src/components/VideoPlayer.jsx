import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import useUserStore from "../stores/Store";

export default function VideoPlayer({ roomId, movie }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ playing: false, time: 0 });
  const [info, setInfo] = useState("Not synced yet");
  const user = useUserStore((state) => state.user);

  const lastLocalAction = useRef({});
  const pendingSeek = useRef(null);
  const seekTimeout = useRef(null);
  const syncInterval = useRef(null);
  const latency = useRef(0.1); // initial 100ms
  const lastServerTime = useRef(Date.now());

  const DRIFT_PLAY = 0.2; // minor drift threshold
  const DRIFT_SEEK = 0.5; // seek drift threshold

  //check
  console.log(movie);

  // ---------------------- predictive + adaptive sync ----------------------
  function applyRemoteAction(action, currentTime, serverTime = Date.now()) {
    const v = videoRef.current;
    if (!v) return;

    // adaptive latency
    const now = Date.now();
    const estimatedLatency = (now - serverTime) / 1000;
    latency.current = latency.current * 0.9 + estimatedLatency * 0.1; // smooth update

    const predictedTime = currentTime + latency.current;

    // skip small drift for play/pause
    if (
      lastLocalAction.current.action === action &&
      Math.abs(lastLocalAction.current.time - predictedTime) < 0.2
    )
      return;

    const drift = Math.abs(v.currentTime - predictedTime);
    const threshold = action === "seek" ? DRIFT_SEEK : DRIFT_PLAY;

    if (drift > threshold) {
      if (action === "seek" && v.readyState < 3) {
        pendingSeek.current = predictedTime;
        v.addEventListener(
          "canplay",
          () => {
            if (pendingSeek.current !== null) {
              v.currentTime = pendingSeek.current;
              pendingSeek.current = null;
            }
          },
          { once: true }
        );
      } else {
        v.currentTime = predictedTime;
      }
    }

    if (action === "play") v.play();
    else if (action === "pause") v.pause();
  }

  function syncToState(state) {
    const v = videoRef.current;
    if (!v) return;

    const predictedTime =
      state.time + ((Date.now() - state.lastUpdate) / 1000 + latency.current);
    const drift = Math.abs(v.currentTime - predictedTime);

    if (drift > DRIFT_PLAY) v.currentTime = predictedTime;

    if (state.playing) {
      const p = v.play();
      if (p && p.catch) p.catch(() => setInfo("Autoplay blocked — click play"));
    } else v.pause();
  }

  // ---------------------- main effect ----------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = "auto"; // preload to avoid seek lag

    socket.emit("join_room", { roomId, movieId: movie.id });

    socket.on("room_state", (state) => {
      lastServerTime.current = Date.now();
      setStatus({ playing: state.playing, time: state.time });
      syncToState(state);
      setInfo("Synced to room state");
    });

    socket.on("player_action", ({ action, currentTime, serverTime }) => {
      lastServerTime.current = serverTime;
      applyRemoteAction(action, currentTime, serverTime);
    });

    const emitAction = (action, time) => {
      lastLocalAction.current = { action, time };
      socket.emit("player_action", {
        roomId,
        action,
        currentTime: time,
        serverTime: Date.now(),
      });
    };

    // heartbeat to correct drift
    const startHeartbeat = () => {
      if (!syncInterval.current) {
        syncInterval.current = setInterval(() => {
          if (video) emitAction("seek", video.currentTime);
        }, 1500);
      }
    };
    const stopHeartbeat = () => {
      if (syncInterval.current) {
        clearInterval(syncInterval.current);
        syncInterval.current = null;
      }
    };

    // local events
    const onPlay = () => {
      emitAction("play", video.currentTime);
      setStatus((s) => ({ ...s, playing: true }));
      startHeartbeat();
    };
    const onPause = () => {
      emitAction("pause", video.currentTime);
      setStatus((s) => ({ ...s, playing: false }));
      stopHeartbeat();
    };
    const onSeeked = () => {
      const t = video.currentTime;
      const emitSeek = (time) => {
        if (seekTimeout.current) clearTimeout(seekTimeout.current);
        seekTimeout.current = setTimeout(() => {
          emitAction("seek", time);
          setStatus((s) => ({ ...s, time }));
        }, 150);
      };

      if (video.readyState < 3) {
        video.addEventListener("canplay", () => emitSeek(t), { once: true });
      } else emitSeek(t);
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
      if (seekTimeout.current) clearTimeout(seekTimeout.current);
      stopHeartbeat();
    };
  }, [roomId, movie.id]);

  return (
    <div className="w-full h-full flex flex-col">
      {/*    {user ?  <video
        ref={videoRef}
        src={movie.video_url}
        controls
        className="w-full h-[70vh] bg-black object-contain"
      /> : 
      <video
        ref={videoRef}
        src={movie.video_url}
        controls = {false}
        className="w-full h-[70vh] bg-black object-contain"
      />} */}

      <video
        ref={videoRef}
        src={movie.video_url}
        controls
        className="w-full h-[70vh] bg-black object-contain"
      />

      <div className="p-4 text-lg">
        <h1>{movie.title}</h1>
      </div>
      <div className="p-4 text-sm text-gray-300">
        <div>
          <strong>Status:</strong> {status.playing ? "Playing" : "Paused"} —
          time: {status.time.toFixed(2)}s
        </div>
        <div className="text-xs mt-2 text-gray-500">{info}</div>
        <div className="mt-2 text-xs text-gray-500">
          Click play if autoplay blocked
        </div>
      </div>
    </div>
  );
}

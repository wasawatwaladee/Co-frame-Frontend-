import React, { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

// ไม่ได้ใช้ useUserStore ในไฟล์นี้โดยตรงแล้ว แต่รวมไว้ใน RoomPage
// import useUserStore from "../stores/Store"; 

export default function VideoPlayer({ roomId, movie, isWatchParty, user }) { // เพิ่ม isWatchParty และ user ใน props
  console.log('user from VideoPlayer', user)
  const videoRef = useRef(null);
  const [status, setStatus] = useState({ playing: false, time: 0 });
  const [info, setInfo] = useState("Not synced yet");
  // const user = useUserStore((state) => state.user); // โยกการรับ user ไปยัง props เพื่อความยืดหยุ่น

  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // Ref สำหรับการซิงค์
  const lastLocalAction = useRef({});
  const pendingSeek = useRef(null);
  const seekTimeout = useRef(null);
  const syncInterval = useRef(null);
  const latency = useRef(0.1); // initial 100ms
  const lastServerTime = useRef(Date.now());

  

  const DRIFT_PLAY = 0.2; // minor drift threshold
  const DRIFT_SEEK = 0.5; // seek drift threshold

  // ---------------------- predictive + adaptive sync functions ----------------------

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
      if (p && p.catch) {
        p.catch(() => {
          setInfo("Autoplay blocked — click play");
          // ⭐️⭐️ ตั้งค่า State เมื่อ Autoplay ถูกบล็อก ⭐️⭐️
          setIsAutoplayBlocked(true); 
        });
      } else {
          // ⭐️⭐️ ถ้าเล่นได้สำเร็จ ให้ปิดสถานะ Autoplay Block ⭐️⭐️
          setIsAutoplayBlocked(false);
      }
    } else v.pause();
  }

  // ---------------------- main effect: Socket.IO connection and logic ----------------------

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = "auto";

    // ⭐️ โหมด Watch Party: เปิดใช้งาน Socket.IO Sync
    if (isWatchParty) {
      setInfo("Watch Party Mode: Connecting to server...");
      
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

      // ฟังก์ชันส่ง Action ไปยัง Server
      const emitAction = (action, time) => {
        const isLoggedIn = !!user?.email;
        if (!isLoggedIn) {
            // อนุญาตให้ User ที่ไม่ได้ล็อกอินใช้ Controls ชั่วคราวเพื่อปลดบล็อก Autoplay เท่านั้น
            if (isAutoplayBlocked) {
                // ไม่ต้องส่ง Action ไป Server แต่ให้ทำการเล่น/หยุดใน Local
                if (action === "play") {
                    video.play();
                    setIsAutoplayBlocked(false); // ปิดสถานะ Block
                } else if (action === "pause") {
                    video.pause();
                }
            }
            return; 
        }

        // สำหรับ User ที่เข้าสู่ระบบ: ส่ง Action ไป Server
        lastLocalAction.current = { action, time };
        socket.emit("player_action", {
          roomId,
          action,
          currentTime: time,
          serverTime: Date.now(),
        });
      };
      
      // Heartbeat สำหรับการซิงค์ Seek ตำแหน่งวิดีโอเป็นระยะ
      const startHeartbeat = () => {
        if (!syncInterval.current) {
          syncInterval.current = setInterval(() => {
            // ส่ง Seek Action เป็นระยะเมื่อวิดีโอกำลังเล่น
            if (video && !video.paused) emitAction("seek", video.currentTime);
          }, 1500); 
        }
      };
      const stopHeartbeat = () => {
        if (syncInterval.current) {
          clearInterval(syncInterval.current);
          syncInterval.current = null;
        }
      };

      // Local Events (เฉพาะใน Watch Party)
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

      // ⭐️ ผูก Event Listeners กับวิดีโอ
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("seeked", onSeeked);

      // Cleanup function
      return () => {
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        video.removeEventListener("seeked", onSeeked);
        socket.off("room_state");
        socket.off("player_action");
        if (seekTimeout.current) clearTimeout(seekTimeout.current);
        stopHeartbeat();
      };

    // ⭐️ โหมด Single Private: ไม่ต้องเชื่อมต่อ Socket.IO
    } else {
      setInfo("Single Private Mode: Not synchronized");
      // ตั้งค่าสถานะเริ่มต้นให้วิดีโอพร้อมเล่น
      setStatus({ playing: false, time: 0 });

      // Clean up เพื่อป้องกันการทำงานค้างของ Socket.IO
      return () => {
        socket.off("room_state");
        socket.off("player_action");
        if (syncInterval.current) clearInterval(syncInterval.current);
        if (seekTimeout.current) clearTimeout(seekTimeout.current);
      };
    }
  }, [roomId, movie.id, isWatchParty, user,isAutoplayBlocked]); // เพิ่ม isWatchParty และ user ใน Dependency Array

  // ----------------------------------------------------------------

  return (
    <div className="w-full h-full flex flex-col">
      <video
        ref={videoRef}
        src={movie.videoUrl}
        // ⭐️ เงื่อนไข Controls: ถ้าเป็น Watch Party และไม่มี user จะปิด Controls
        controls={!isWatchParty || !!user?.email || isAutoplayBlocked}
        className="w-full h-[70vh] bg-black object-contain"
      />

      {isWatchParty && (
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
      )}
      
      {!isWatchParty && (
        <div className="p-4 text-sm text-gray-300">
          <div className="text-xs mt-2 text-gray-500">
            {info}
          </div>
        </div>
      )}
      
      <div className="p-4 text-lg">
        <h1>{movie.title}</h1>
      </div>
    </div>
  );
}
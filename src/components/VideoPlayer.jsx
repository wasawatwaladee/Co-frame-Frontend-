import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom"; // ⭐️ [UPDATE] ใช้ useNavigate จาก react-router-dom

export default function VideoPlayer({ roomId, movie, isWatchParty, user }) { // เพิ่ม isWatchParty และ user ใน props

  const videoRef = useRef(null);
  const [status, setStatus] = useState({ playing: false, time: 0 });
  const [info, setInfo] = useState("Not synced yet");
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // Ref สำหรับการซิงค์
  const lastLocalAction = useRef({});
  const pendingSeek = useRef(null);
  const seekTimeout = useRef(null);
  const syncInterval = useRef(null);
  const latency = useRef(0.1); // initial 100ms
  const lastServerTime = useRef(Date.now());

  const [localTime, setLocalTime] = useState(0); 
  const localClockInterval = useRef(null);

  
const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    
    return `${paddedMinutes}:${paddedSeconds}`;
};



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

    // ⭐️ MARK 2: ฟังก์ชันควบคุม Local Clock
    const startLocalClock = () => {
        if (localClockInterval.current) clearInterval(localClockInterval.current);
        localClockInterval.current = setInterval(() => {
            // ใช้ videoRef.current.currentTime เพื่อดึงเวลาปัจจุบันของวิดีโอ
            if (videoRef.current && !videoRef.current.paused) {
                setLocalTime(videoRef.current.currentTime);
            }
        }, 500); // อัปเดตทุก 500ms
    };

    const stopLocalClock = () => {
        if (localClockInterval.current) {
            clearInterval(localClockInterval.current);
            localClockInterval.current = null;
        }
    };

    // ⭐️ โหมด Watch Party: เปิดใช้งาน Socket.IO Sync
    if (isWatchParty) {
      setInfo("Watch Party Mode: Connecting to server...");
      setStatus({ playing: false, time: 0 });
      
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

      const onPlayPrivate = () => startLocalClock();
      const onPausePrivate = () => stopLocalClock();
      
      video.addEventListener("play", onPlayPrivate);
      video.addEventListener("pause", onPausePrivate);

      // Cleanup function
      return () => {
        stopLocalClock();
          video.removeEventListener("play", onPlayPrivate);
          video.removeEventListener("pause", onPausePrivate);
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


  useEffect(() => {
    // ซิงค์ localTime กับ status.time เมื่อ status อัปเดตจาก Server
    // เพื่อให้ Local Clock เริ่มต้นจากตำแหน่งที่ Server ส่งมา
    setLocalTime(status.time); 
  }, [status.time]);
  // ----------------------------------------------------------------

  const navigate = useNavigate()

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* ⭐️ [CSS Enhancement] Back Button Header */}
      <div className="absolute top-0 left-0 p-4 z-20">
          <button 
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm" 
              onClick={() => navigate("/") }
              title="Go Back to Home"
          >
              <svg width="24px" height="24px" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" className="si-glyph si-glyph-button-arrow-left" fill="#ffffff">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g transform="translate(1.000000, 0.000000)" fill="#ededed">
                          <path d="M0,8.041 C0,3.652 3.582,0.082 7.985,0.082 C12.386,0.082 15.968,3.652 15.968,8.041 C15.968,12.43 12.386,16 7.985,16 C3.582,16 0,12.43 0,8.041 L0,8.041 Z M14.057,8.041 C14.057,4.708 11.342,1.996 8.006,1.996 C4.669,1.996 1.954,4.708 1.954,8.041 C1.954,11.374 4.67,14.086 8.006,14.086 C11.343,14.086 14.057,11.374 14.057,8.041 L14.057,8.041 Z" className="si-glyph-fill"></path>
                          <path d="M7.975,5.02 L4.071,8.022 L7.976,10.973 L7.976,8.97 L11.116,8.97 C11.461,8.97 11.907,8.646 11.907,8.015 C11.907,7.385 11.424,7.04 11.081,7.04 L7.976,7.04 L7.976,5.02 L7.975,5.02 Z" className="si-glyph-fill"></path>
                      </g>
                  </g>
              </svg>      
          </button>
      </div>

      <video
        ref={videoRef}
        src={movie.videoUrl}
        // ⭐️ เงื่อนไข Controls: ถ้าเป็น Watch Party และไม่มี user จะปิด Controls
        controls={!isWatchParty || !!user?.email || isAutoplayBlocked}
        // ⭐️ [CSS Enhancement] วิดีโอขนาดเต็มความกว้างและสูง
        className="w-full h-full bg-black object-contain flex-1" 
        
      />

      {isWatchParty && (
        // ⭐️ [CSS Enhancement] Info Bar
        <>

        <div className="absolute top-0 left-10 w[50%] p-6 text-sm text-white z-10">
          <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
        </div>
        
        <div>
            <div className="flex items-center gap-4">
            <div className="text-gray-300 font-semibold">
              Status: <span className={status.playing ? "text-green-400" : "text-red-400"}>
                  {status.playing ? "Playing" : "Paused"}
              </span>
            </div>
            <div className="text-gray-400">
              {/* Time: {status.time.toFixed(2)}s */}
              Time: {formatTime(localTime)}
            </div>
          </div>
         
        </div>
        </>
      )}
      
      {!isWatchParty && (
        <>
        <div className="absolute top-0 left-10 w[50%] p-6 text-sm text-white  z-10">
          <h1 className="text-xl font-bold text-white mb-1">{movie.title}</h1>
          {/* <div className="text-xs mt-2">{info}</div> */}
        </div>
        
        </>
      )}
    </div>
  );
}
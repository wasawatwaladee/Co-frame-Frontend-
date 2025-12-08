import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WatchOptionsModal({ movie, onClose }) {
  const [partyCode, setPartyCode] = useState("");
  const navigate = useNavigate();

  const handleSingle = () => {
    const movieId = movie?.id || movie?._id;
    if (movieId) {
      navigate(`/room/${movieId}`);
    }
  };

  const handleWatchParty = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPartyCode(code);
  };

  const handleReset = () => {
    setPartyCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center perspective-1000">
      {/* Blurred Background with Cinema Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-500" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-zinc-950 text-white rounded-3xl w-full max-w-3xl mx-4 shadow-2xl shadow-black/80 border border-zinc-800/50 animate-cinema-enter overflow-hidden">
        {/* Cinema Light Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-blue-500/50 blur-[100px] rounded-full"></div>

        {/* Header */}
        <div className="relative px-8 py-8 text-center border-b border-zinc-800/50 bg-zinc-900/30">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent uppercase drop-shadow-sm">
            Select Experience
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 font-medium tracking-wide">
            Choose how you want to enjoy this title
          </p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 min-h-[400px] flex items-center justify-center">
          {!partyCode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Single Private Box */}
              <div
                onClick={handleSingle}
                className="group relative h-64 overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-zinc-900/80 to-zinc-950 transition-opacity duration-500 group-hover:opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-6 p-4 bg-blue-500/10 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-wide group-hover:text-blue-400 transition-colors">Private Screening</h3>
                  <p className="text-zinc-400 text-sm font-medium group-hover:text-zinc-300">Immersive solo experience</p>
                </div>
              </div>

              {/* Watch Party Box */}
              <div
                onClick={handleWatchParty}
                className="group relative h-64 overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-zinc-900/80 to-zinc-950 transition-opacity duration-500 group-hover:opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-6 p-4 bg-purple-500/10 rounded-full border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40 group-hover:scale-110 transition-all duration-500 shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-wide group-hover:text-purple-400 transition-colors">Watch Party</h3>
                  <p className="text-zinc-400 text-sm font-medium group-hover:text-zinc-300">Stream with friends</p>
                </div>
              </div>
            </div>
          ) : partyCode ? (
            <div className="flex flex-col items-center justify-center w-full animate-fade-in">
              <div className="relative w-full max-w-md p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-green-500/50 blur-[50px]"></div>

                <div className="mb-8 p-5 bg-green-500/10 rounded-full inline-flex border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v9.651c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                  </svg>
                </div>
                
                <p className="text-zinc-400 text-sm font-bold tracking-widest uppercase mb-4">Your Party Ticket</p>
                <div className="relative mb-8 p-4 bg-black/40 rounded-xl border border-zinc-800/50">
                  <p className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 drop-shadow-lg font-mono">
                    {partyCode}
                  </p>
                </div>

                <p className="text-zinc-400 text-xs mb-6">Share this code with friends to join your party</p>

                <button
                  className="w-full group relative overflow-hidden bg-white text-black font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] mb-4"
                  onClick={() => {
                    const movieId = movie?.id || movie?._id;
                    if (movieId) {
                      navigate(`/room/${movieId}/${partyCode}`);
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                    <span>Start Party</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </button>

                <button
                  className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs font-medium py-2 w-full"
                  onClick={handleReset}
                >
                  Select Different Mode
                </button>
              </div>
            </div>
          ) : null}
        </div>

      {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
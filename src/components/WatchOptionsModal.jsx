import { useState } from "react";

export default function WatchOptionsModal({ movie, onClose }) {
  const [partyCode, setPartyCode] = useState("");

  const handleSingle = () => {
    window.location.href = `/player/${movie.id}`;
  };

  const handleWatchParty = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPartyCode(code);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Choose Watching Mode</h2>

        {!partyCode ? (
          <>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg mb-3"
              onClick={handleSingle}
            >
              Single Private
            </button>

            <button
              className="w-full bg-purple-600 text-white py-2 rounded-lg"
              onClick={handleWatchParty}
            >
              Watch Party
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="font-semibold">Your Party Code:</p>
            <p className="text-3xl font-bold my-3">{partyCode}</p>

            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg"
              onClick={() =>
                (window.location.href = `/player/${movie.id}?party=${partyCode}`)
              }
            >
              Start Party
            </button>
          </div>
        )}

        <button className="mt-4 text-sm text-gray-600" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

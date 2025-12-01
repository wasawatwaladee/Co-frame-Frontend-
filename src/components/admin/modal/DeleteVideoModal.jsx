export default function DeleteVideoModal({ isOpen, onClose, videoData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-xl border border-white/10 shadow-2xl p-6 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          ยืนยันการลบวิดีโอ?
        </h3>
        <p className="text-textSecondary text-sm mb-6">
          คุณต้องการลบวิดีโอ <br />
          <span className="text-white font-semibold">
            "{videoData?.title}"
          </span>{" "}
          <br />
          ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-2.5 rounded-lg transition-colors border border-white/5"
          >
            ยกเลิก
          </button>
          <button className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-red-900/20">
            ลบวิดีโอ
          </button>
        </div>
      </div>
    </div>
  );
}

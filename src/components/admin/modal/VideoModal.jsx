export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-[#1a1a1a] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-bold text-white">เพิ่มวิดีโอใหม่</h3>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Content (Scrollable) */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* 1. ชื่อวิดีโอ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">
              ชื่อวิดีโอ
            </label>
            <input
              type="text"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* 2. คำอธิบาย */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">
              คำอธิบาย
            </label>
            <textarea
              rows="3"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          {/* --- เพิ่มใหม่: 3. URL วิดีโอ --- */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">
              URL วิดีโอ (ไฟล์หนัง)
            </label>
            <input
              type="text"
              placeholder="https://example.com/movie.mp4"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* 4. URL รูปภาพปก */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">
              URL รูปภาพปก
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* 5. Row: หมวดหมู่ & ระยะเวลา */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">
                หมวดหมู่
              </label>
              <div className="relative">
                <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="action">Action</option>
                  <option value="drama">Drama</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="romance">Romance</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-textMuted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">
                ระยะเวลา (นาที:วินาที)
              </label>
              <input
                type="text"
                placeholder="45:30"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* 6. วันที่อัพโหลด */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">
              วันที่อัพโหลด
            </label>
            <div className="relative">
              <input
                type="date"
                defaultValue="2025-11-26"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex items-center gap-3 bg-[#151515] shrink-0">
          <button className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/20">
            เพิ่มวิดีโอ
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 rounded-lg transition-colors border border-white/5"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}

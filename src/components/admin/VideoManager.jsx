import { useState } from "react";
import VideoModal from "../admin/modal/VideoModal"; // Import Modal ที่สร้างใหม่

// Mock Data (เหมือนเดิม)
const mockVideos = [
  {
    id: 1,
    title: "The Crown Season 5",
    desc: "เรื่องราวของราชวงศ์อังกฤษ",
    tag: "ดราม่า",
    duration: "52:30",
    date: "2024-11-01",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    title: "Stranger Things",
    desc: "เรื่องราวลึกลับในเมืองเล็กๆ",
    tag: "ไซไฟ",
    duration: "45:20",
    date: "2024-11-05",
    thumbnail:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    title: "Money Heist",
    desc: "แผนปล้นที่ยิ่งใหญ่ที่สุด",
    tag: "แอคชั่น",
    duration: "48:15",
    date: "2024-11-10",
    thumbnail:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    title: "Bridgerton",
    desc: "ความรักในยุครีเจนซี่",
    tag: "โรแมนติก",
    duration: "55:40",
    date: "2024-11-15",
    thumbnail:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
  },
];

export default function VideoManager() {
  // 1. เพิ่ม State ควบคุมการเปิด/ปิด Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">จัดการวิดีโอ</h2>

        <div className="flex w-full md:w-auto gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="ค้นหาวิดีโอ..."
              className="w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-3 text-textMuted"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          {/* Add Button -> 2. ผูก Event onClick ให้เปิด Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-red-900/20"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            เพิ่มวิดีโอ
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-4">
        {mockVideos.map((video) => (
          <div
            key={video.id}
            className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center group hover:bg-[#252525] transition-colors border border-transparent hover:border-white/5"
          >
            {/* ... (ส่วนแสดงรายการวิดีโอ เหมือนเดิม) ... */}
            <div className="w-full md:w-48 h-28 shrink-0 relative rounded-lg overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex-1 w-full text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-1">
                {video.title}
              </h3>
              <p className="text-textSecondary text-sm mb-2">{video.desc}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-textMuted">
                <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-textSecondary">
                  {video.tag}
                </span>
                <span>•</span>
                <span>{video.duration}</span>
                <span>•</span>
                <span>{video.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-textSecondary hover:text-white hover:bg-white/10 rounded-lg transition-colors">
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <button className="p-2 text-textSecondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. เรียกใช้ Modal Component */}
      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

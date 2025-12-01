import { useState } from "react";
import VideoManager from "../components/admin/VideoManager";
import UserManager from "../components/admin/UserManager";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("videos"); // 'videos' or 'users'

  return (
    <div className="min-h-screen bg-bgMain text-textPrimary font-sans p-6 pt-20">
      {" "}
      {/* pt-20 เผื่อ Navbar */}
      <div className="max-w-7xl mx-auto">
        {/* --- Page Header & Tabs --- */}
        <div className="flex items-center gap-8 border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === "videos"
                ? "text-textPrimary"
                : "text-textMuted hover:text-textPrimary"
            }`}
          >
            จัดการวิดีโอ
            {activeTab === "videos" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === "users"
                ? "text-textPrimary"
                : "text-textMuted hover:text-textPrimary"
            }`}
          >
            จัดการผู้ใช้
            {activeTab === "users" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md"></span>
            )}
          </button>
        </div>

        {/* --- Content Area --- */}
        <div className="animate-fade-in">
          {activeTab === "videos" ? <VideoManager /> : <UserManager />}
        </div>
      </div>
    </div>
  );
}

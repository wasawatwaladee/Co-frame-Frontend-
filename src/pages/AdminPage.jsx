import { useState } from "react";
import VideoManager from "../components/admin/VideoManager";
import UserManager from "../components/admin/UserManager";
import PostManager from "../components/admin/PostManager";
import CommentManager from "../components/admin/CommentManager";
import CategoryManager from "../components/admin/CategoriesManager";

export default function AdminPage() {
  // 1. แก้ไข: กำหนดค่าเริ่มต้นเป็น 'videos' และรับรู้ถึงแท็บ 'post'
  const [activeTab, setActiveTab] = useState("videos"); // 'videos', 'users', หรือ 'post'

  const renderContent = () => {
    // 2. แก้ไข: ใช้ switch case หรือ ternary operator ที่ชัดเจนเพื่อแสดงผลคอมโพเนนต์ที่ถูกต้อง
    switch (activeTab) {
      case "videos":
        return <VideoManager />;
      case "users":
        return <UserManager />;
      case "post":
        return <PostManager />;
      case "comments":
        return <CommentManager />;
      case "categories":
        return <CategoryManager />;
      default:
        return <VideoManager />; // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-bgMain text-textPrimary font-sans p-6 pt-20">
      {" "}
      {/* pt-20 เผื่อ Navbar */}
      <div className="max-w-7xl mx-auto">
        {/* --- Page Header & Tabs --- */}
        <div className="flex items-center gap-8 border-b border-white/10 mb-8">
          {/* จัดการวิดีโอ */}
          <TabButton
            label="จัดการวิดีโอ"
            tabKey="videos"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* จัดการผู้ใช้ */}
          <TabButton
            label="จัดการผู้ใช้"
            tabKey="users"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* จัดการโพส - **แก้ไข: ต้องอ้างอิง activeTab === "post" สำหรับ class และ span** */}
          <TabButton
            label="จัดการโพส"
            tabKey="post"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {/* 2. เพิ่มปุ่มแท็บ "จัดการคอมเมนต์" */}
          <TabButton
            label="จัดการคอมเมนต์"
            tabKey="comments"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <TabButton
            label="จัดการหมวดหมู่"
            tabKey="categories"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* --- Content Area --- */}
        <div className="animate-fade-in">
          {/* เรียกใช้ฟังก์ชัน renderContent ที่แก้ไขแล้ว */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// **คอมโพเนนต์เสริมสำหรับปุ่มแท็บเพื่อลดความซ้ำซ้อน**
const TabButton = ({ label, tabKey, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabKey)}
    className={`pb-4 text-lg font-medium transition-colors relative ${
      activeTab === tabKey
        ? "text-textPrimary"
        : "text-textMuted hover:text-textPrimary"
    }`}
  >
    {label}
    {activeTab === tabKey && (
      <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md"></span>
    )}
  </button>
);
import { useState } from "react";
import VideoManager from "../components/admin/VideoManager";
import UserManager from "../components/admin/UserManager";
import PostManager from "../components/admin/PostManager";
import CommentManager from "../components/admin/CommentManager";
import CategoryManager from "../components/admin/CategoriesManager";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("videos");

  const renderContent = () => {
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
        return <VideoManager />;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Manage your content, users, posts, comments, and categories
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b bg-white border-gray-200 mb-6">
          <div className="flex items-center gap-8">
            <TabButton
              label="Videos"
              tabKey="videos"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              label="Users"
              tabKey="users"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              label="Posts"
              tabKey="post"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              label="Comments"
              tabKey="comments"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              label="Categories"
              tabKey="categories"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Professional Tab Button Component
const TabButton = ({ label, tabKey, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tabKey)}
    className={`text-sm font-semibold pb-3 border-b-2 transition-all duration-300 cursor-pointer ${
      activeTab === tabKey
        ? "border-red-600 text-red-600"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
    }`}
  >
    {label}
  </button>
);
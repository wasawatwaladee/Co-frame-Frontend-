import { useEffect, useState } from "react";
import MainLayout from "../layouts/Layout";
import SidebarTrending from "../components/SidebarTrending";
import PostContainer from "../components/PostContainer";
import SidebarCommunity from "../components/SidebarSteam";
import CreatePost from "../components/CreatePost";
import PostForm from "../components/PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";
import { siteConfig } from "../constant/config";

const OpenSidebarButton = ({ onClick, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`fixed top-20 right-4 p-3 rounded-full z-50 shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer ${
      isDarkMode
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-red-600 text-white hover:bg-red-700"
    }`}
    title="Open Trending"
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      ></path>
    </svg>
  </button>
);

const Modal = ({ children, onClose, isDarkMode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
    {/* Dark Background */}
    <div 
      className="absolute inset-0 bg-black/50 transition-opacity duration-300" 
      onClick={onClose}
    ></div>
    
    {/* Modal Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);




function communityPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedHashtag, setSelectedHashtag] = useState(null); 
  // const [activeTab, setActiveTab] = useState("For You");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(true);

  const openSidebarModal = () => setIsSidebarModalOpen(true);
  const closeSidebarModal = () => setIsSidebarModalOpen(false);
  const openCreatePostModal = () => setIsCreatePostModalOpen(true);
  const closeCreatePostModal = () => setIsCreatePostModalOpen(false);

  const categories = useUserStore((state) => state.categories);
  const getCategories = useUserStore((state) => state.getCategories);
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  const [posts,setPosts] = useState([])
  // 🔥 MARK 1: NEW STATE - ตัวนับสำหรับบังคับให้ PostContainer โหลดใหม่
  const [postRefreshKey, setPostRefreshKey] = useState(0); 
  
  // 🔥 MARK 2: NEW STATE - ตัวนับสำหรับบังคับให้ SidebarTrending โหลดใหม่
  const [trendingRefreshKey, setTrendingRefreshKey] = useState(0);
  // 🔥 MARK 3: NEW FUNCTION - สั่งรีเฟรช Post Feed
  const triggerPostRefresh = () => setPostRefreshKey(prev => prev + 1);
  
  // 🔥 MARK 4: NEW FUNCTION - สั่งรีเฟรช Trending Sidebar
  const triggerTrendingRefresh = () => setTrendingRefreshKey(prev => prev + 1);


  

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleCategoryClick = (id) => {
       setSelectedCategoryId(id);
    setSelectedHashtag(null); 
    console.log(`Category ID clicked: ${id}`);
  };

   const handleHashtagClick = (hashtag) => {
      setSelectedHashtag(hashtag);
      setSelectedCategoryId(null); // เคลียร์ Category ID เมื่อเลือก Hashtag
      // setIsSidebarModalOpen(false); // ปิด Sidebar หลังเลือก (ทางเลือก)
      console.log(`Hashtag clicked: ${hashtag}`);
  };

  return (
    <MainLayout>
      <div className="flex h-full animate-fade-in">
        {/* Left Sidebar - Categories */}
        <SidebarCommunity
          onSelect={handleCategoryClick}
          activeId={selectedCategoryId}
        />

        {/* Center Content Area */}
        <div className="flex-1 ml-64 mr-80 h-full">
          {/* Top Navigation Tabs */}
          <div
            className={`border-b ${
              isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
            }`}
          >
            {/* <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-8">
                {["For You", "Following", "Movies"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-semibold pb-3 border-b-2 transition-all duration-200 cursor-pointer ${
                      activeTab === tab
                        ? "border-red-600 text-red-600"
                        : isDarkMode
                        ? "border-transparent text-gray-400 hover:text-gray-200"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div> */}
          </div>

          {/* Create Post Section - Using CreatePost Component */}
          <CreatePost onOpenForm={openCreatePostModal} isDarkMode={isDarkMode} />

          {/* Posts Feed */}
          <div className="pb-8">
            <PostContainer categoryId={selectedCategoryId} 
            selectedHashtag = {selectedHashtag}
            refreshKey={postRefreshKey}
            onTrendingRefresh={triggerTrendingRefresh}/>
            
            
          </div>
        </div>

        {/* Right Sidebar - Trending */}
        {isSidebarModalOpen && (
          <div>
            <SidebarTrending
              onClose={closeSidebarModal}
              selectedCategory={selectedCategoryId}
              onHashtagClick={handleHashtagClick}
              refreshKey={trendingRefreshKey}
            />
          </div>
        )}

        {!isSidebarModalOpen && (
          <OpenSidebarButton onClick={openSidebarModal} isDarkMode={isDarkMode} />
        )}

        {isCreatePostModalOpen && (
          <Modal onClose={closeCreatePostModal} isDarkMode={isDarkMode}>
            <PostForm onPostCreated={() => {
              closeCreatePostModal();
            }} 
            onClose={closeCreatePostModal} 
            onPostRefresh={triggerPostRefresh}
            onTrendingRefresh={triggerTrendingRefresh}
            />
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}

export default communityPage;


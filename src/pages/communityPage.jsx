import { useEffect, useState } from "react";
import MainLayout from "../layouts/Layout";
import SidebarTrending from "../components/SidebarTrending";
import PostContainer from "../components/PostContainer";
import SidebarCommunity from "../components/SidebarSteam";
import useUserStore from "../stores/Store";

const OpenSidebarButton = ({ onClick }) => (
  // ⭐️ [CSS Enhancement] ปุ่มเปิด Sidebar
  <button
    onClick={onClick}
    className="fixed top-20 right-0 p-3 bg-red-600 text-white z-50 rounded-l-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
    title="Open Trending"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
    </svg>
  </button>
);

function communityPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // ⭐️ [ADD] State ใหม่สำหรับเก็บ Hashtag ที่ถูกเลือก
  const [selectedHashtag, setSelectedHashtag] = useState(null); 

  const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(true);
  const openSidebarModal = () => setIsSidebarModalOpen(true);
  const closeSidebarModal = () => setIsSidebarModalOpen(false);

  const categories = useUserStore((state) => state.categories); 
  const getCategories = useUserStore((state) => state.getCategories);
  
  useEffect(() => {
    getCategories();
  }, [getCategories]);


  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    // ⭐️ [UPDATE] เคลียร์ Hashtag เมื่อเลือก Category ใหม่
    setSelectedHashtag(null); 
    console.log(`Category ID clicked: ${id}`);
  };
  
  // ⭐️ [ADD] ฟังก์ชันใหม่: จัดการเมื่อมีการคลิก Hashtag
  const handleHashtagClick = (hashtag) => {
      setSelectedHashtag(hashtag);
      setSelectedCategoryId(null); // เคลียร์ Category ID เมื่อเลือก Hashtag
      setIsSidebarModalOpen(false); // ปิด Sidebar หลังเลือก (ทางเลือก)
      console.log(`Hashtag clicked: ${hashtag}`);
  };


  return (
    <MainLayout>
      <SidebarCommunity
        onSelect={handleCategoryClick}
        activeId={selectedCategoryId}
      />

      {/* ⭐️ [UPDATE] ส่ง selectedHashtag ไป PostContainer และปรับ Layout */}
      <div className="ml-64 pt-4 px-4 md:px-8"> 
        <PostContainer 
            categoryId={selectedCategoryId}
            selectedHashtag={selectedHashtag} 
        />
      </div>
      
     {isSidebarModalOpen && (
        <div>
          <SidebarTrending 
            onClose={closeSidebarModal} 
            selectedCategory={selectedCategoryId }
            onHashtagClick={handleHashtagClick} // ⭐️ [PASS] ส่ง Handler ไป SidebarTrending
          />
        </div>
      )}

      {/* ⭐️ แสดงปุ่มเปิด Sidebar เมื่อ isSidebarModalOpen เป็น false */}
      {!isSidebarModalOpen && (
        <OpenSidebarButton onClick={openSidebarModal} />
      )}

    </MainLayout>
  );
}

export default communityPage;
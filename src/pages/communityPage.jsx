import {  useEffect, useState } from "react";
import MainLayout from "../layouts/Layout";
import SidebarTrending from "../components/SidebarTrending";
import PostContainer from "../components/PostContainer";
import SidebarCommunity from "../components/SidebarSteam";
import useUserStore from "../stores/Store";

const OpenSidebarButton = ({ onClick }) => (
  // ตำแหน่งปุ่มที่มุมขวาบน เมื่อ Sidebar ปิดอยู่
  <button
    onClick={onClick}
    className="fixed top-20 right-0 p-2 bg-red-600 text-white z-50 rounded-l-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
    title="Open Trending"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
    </svg>
  </button>
);

function communityPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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

    console.log(`Category ID clicked: ${id}`);
  };

  return (
    <MainLayout>
      <SidebarCommunity
        onSelect={handleCategoryClick}
        activeId={selectedCategoryId}
      />

      <div className="ml-64 pt-4">
        <PostContainer categoryId={selectedCategoryId} />
      </div>
      
     {isSidebarModalOpen && (
        <div>
          <SidebarTrending 
            onClose={closeSidebarModal} 
            selectedCategory={selectedCategoryId } // ส่ง category ที่เลือกไป
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

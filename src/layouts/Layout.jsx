import React from "react";
import Navbar from "../components/NavBar";
import useUserStore from "../stores/Store";

const MainLayout = ({ children }) => {
  const isDarkMode = useUserStore(state => state.isDarkMode);

  return (
    // Wrapper หลัก: กำหนดสีพื้นหลัง, ฟอนต์, และความสูงขั้นต่ำ, isDarkMode = Kay
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} font-sans selection:bg-primary selection:text-white flex flex-col transition-colors duration-300`}>
      {/* 1. Navbar (ติดอยู่ด้านบนเสมอ) */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

import Navbar from "../components/NavBar";

const MainLayout = ({ children }) => {
  return (
    // Wrapper หลัก: กำหนดสีพื้นหลัง, ฟอนต์, และความสูงขั้นต่ำ
    <div className="min-h-screen bg-bgMain text-textPrimary font-sans selection:bg-primary selection:text-white flex flex-col">
      {/* 1. Navbar (ติดอยู่ด้านบนเสมอ) */}
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

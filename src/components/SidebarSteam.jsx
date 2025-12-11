import { useState, useEffect } from "react";
import axios from "axios";

// รับ Props:
// onSelect: ฟังก์ชันส่งค่า ID กลับไปบอกหน้าหลักว่าเลือกหมวดไหน
// activeId: ID ที่ถูกเลือกอยู่ (เพื่อทำไฮไลท์สีแดง)
function SidebarCommunity({ onSelect, activeId }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // ยิงไป API ที่เราทำไว้สำหรับ Community Category
        // (Route ที่คุณทำไว้ใน categories.route.js)
        const res = await axios.get("http://localhost:5500/api/categories");
        console.log('res', res)
        // res.data.categories ควรจะเป็น array ของ object: [{id: 1, name: "Review"}, ...]
        // เราจะเพิ่ม "ALL POSTS" ไว้ตัวแรกสุด
        const allOption = { id: null, name: "ALL POSTS" };

        setCategories([allOption, ...res.data.categories]);
      } catch (error) {
        console.error("Error fetching community categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="fixed top-0 mt-20 left-0 h-[calc(100vh-80px)] w-64 p-4 overflow-y-auto bg-black text-white z-40 shadow-xl border-r border-gray-800 scrollbar-hide">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 ml-2 mt-2">
        Community Board
      </h3>

      <div className="flex flex-col space-y-2">
        {categories.map((category) => (
          <button
            key={category.id || "all"} // ใช้ id เป็น key (ถ้าเป็น all ให้ใช้ string 'all')
            onClick={() => onSelect(category.id)} // ส่ง ID กลับไป (ไม่ใช่ส่งชื่อ)
            className={`
              relative flex items-center p-3 rounded-lg text-left transition-all duration-200 group
              ${
                // เช็คว่า ID ตรงกันไหม (ถ้า activeId เป็น null และ category.id เป็น null คือเลือก ALL)
                activeId === category.id
                  ? "bg-red-600 text-white font-semibold shadow-md shadow-red-900/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            {/* เส้นสีแดงด้านซ้าย */}
            <span
              className={`
                absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-300
                ${
                  activeId === category.id
                    ? "bg-white"
                    : "bg-transparent group-hover:bg-red-500"
                }
              `}
            />

            {/* ชื่อหมวดหมู่ */}
            <span className="ml-3 tracking-wide truncate text-sm">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarCommunity;
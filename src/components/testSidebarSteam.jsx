import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/Store";
import { siteConfig } from "../constant/config";

function SidebarCommunity({ onSelect, activeId }) {
  const [categories, setCategories] = useState([]);
  const isDarkMode = useUserStore((state) => state.isDarkMode);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${siteConfig.SERVER_URL}/api/categories`);
        console.log("res", res);
        const allOption = { id: null, name: "ALL POSTS" };
        setCategories([allOption, ...res.data.categories]);
      } catch (error) {
        console.error("Error fetching community categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 p-4 overflow-y-auto z-40 shadow-2xl border-r scrollbar-hide transition-colors duration-300 rounded-r-3xl ${
        isDarkMode
          ? "bg-gray-950 border-gray-900"
          : "bg-gradient-to-br from-white via-gray-50 to-white border-gray-200"
      }`}
    >
      {/* Header with Cinema Effect */}
      <div className={`relative px-4 py-4 mb-4 border-b rounded-lg ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 blur-[40px] rounded-full ${
          isDarkMode ? 'bg-red-500/20' : 'bg-red-400/20'
        }`}></div>
        
        <h3 className={`text-xs font-black uppercase tracking-widest bg-gradient-to-r ${
          isDarkMode 
            ? 'from-red-400 via-red-500 to-red-600' 
            : 'from-red-600 via-red-500 to-red-700'
        } bg-clip-text text-transparent`}>
          Community
        </h3>
        <p className={`text-xs mt-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Categories
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        {categories.map((category) => (
          <button
            key={category.id || "all"}
            onClick={() => onSelect(category.id)}
            className={`relative flex items-center p-3 rounded-xl text-left transition-all duration-300 group cursor-pointer overflow-hidden transform hover:scale-105 hover:translate-x-1 ${
              activeId === category.id
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-600/30"
                : isDarkMode
                ? "text-gray-400 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
                : "text-gray-600 hover:bg-gray-100 hover:text-black hover:shadow-sm"
            }`}
          >
            {/* Hover gradient effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/0 transition-all duration-300`}></div>
            
            {/* Active indicator line */}
            <span
              className={`absolute left-0 top-0 h-full w-1 rounded-r-md transition-all duration-300 ${
                activeId === category.id
                  ? "bg-white"
                  : "bg-transparent group-hover:bg-red-400"
              }`}
            />

            {/* Category name */}
            <span className="ml-3 tracking-wide truncate text-sm font-medium relative z-10">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarCommunity;
import React, { useEffect, useMemo, useState } from 'react';
import useUserStore from '../stores/Store';
import axios from 'axios';
import { siteConfig } from '../constant/config';

const TRENDING_API_URL = `${siteConfig.SERVER_URL}/api/trending/hashtags`; 

function SidebarTrending({ selectedCategory , onClose, onOpen,onHashtagClick}) {
    const categories = useUserStore(state => state.categories);
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [isClosing, setIsClosing] = useState(false);
    const [trendingData, setTrendingData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [displayCategoryName, setDisplayCategoryName] = useState('ALL'); 

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose ? onClose() : onOpen();
      }, 500); // Match animation duration
    };
    

     useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);

            let url = TRENDING_API_URL;
            if (selectedCategory) {
                // ส่ง categoryId ไปให้ Backend กรอง
                url += `?categoryId=${selectedCategory}`;
            }

            try {
                const res = await axios.get(url);
                // ⭐️ ตั้งค่า Trending Data ที่ถูกจัดเรียงและนับมาแล้วจาก Backend
                setTrendingData(res.data.trending);
            } catch (err) {
                console.error("Error fetching trending hashtags:", err);
                setTrendingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [selectedCategory]);

        useEffect(() => {
        let name;
        if (!selectedCategory) {
            name = 'ALL ';
        } else {
            const selectedCat = Array.isArray(categories) 
                ? categories.find(c => c.id === selectedCategory)
                : null;
            
            name = selectedCat?.name || selectedCategory; 
        }
        setDisplayCategoryName(name);

    }, [selectedCategory, categories]); 

 

    

  return (
    <div className={`fixed top-16 right-0 p-4 h-[calc(100vh-4rem)] w-80 overflow-y-auto z-40 shadow-2xl border-l transition-colors duration-300 rounded-l-3xl ${isClosing ? 'animate-slide-out-right' : ''} ${
      isDarkMode 
        ? 'bg-gray-950 border-gray-900' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'
    }`}>
      {/* Header with Cinema Effect */}
      <div className={`relative px-4 py-4 mb-4 border-b rounded-lg flex items-center justify-between ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 blur-[40px] rounded-full ${
          isDarkMode ? 'bg-red-500/20' : 'bg-red-400/20'
        }`}></div>
        
        <div className="relative z-10">
          <h3 className={`text-xs font-black uppercase tracking-widest bg-gradient-to-r ${
            isDarkMode 
              ? 'from-red-400 via-red-500 to-red-600' 
              : 'from-red-600 via-red-500 to-red-700'
          } bg-clip-text text-transparent`}>
            Trending
          </h3>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {displayCategoryName}
          </p>
        </div>

        <button 
          onClick={handleClose}
          className={`p-2 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDarkMode 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-200 text-gray-500 hover:text-black'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

     
        

        {loading ? (
                <p className="text-center text-gray-500 mt-10 animate-pulse">Loading trending...</p>
             ) : (
                <div className="space-y-6 mt-4">
                    
                    {trendingData.length > 0 ? (
                        trendingData.map((section) => (
                            // ⭐️ [CSS Enhancement] Group Box
                            <div key={section.categoryName} className="bg-[#1C1C1C] p-4 rounded-lg shadow-inner shadow-black/30 border border-gray-700/50">
                                
                                {/* Header ของ Group */}
                                <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white border-b border-gray-600 pb-2">
                                    {section.categoryName}
                                </h3>

                                {/* List Hashtags */}
                                <ul className="space-y-3 pt-2">
                                    {section.trendingHashtags.map((item, index) => (
                                        <li key={item.hashtag} className="flex justify-between items-center text-sm pb-1 border-b border-gray-800 last:border-b-0 group">
                                            <div className='flex items-center gap-3'>
                                                <span className="font-extrabold text-red-500 text-base">{index + 1}.</span>
                                                {/* ⭐️ [CSS Enhancement] Hashtag Link Style */}
                                                <span 
                                                    className="text-gray-200 hover:text-red-400 cursor-pointer transition-colors duration-200 font-medium truncate"
                                                    onClick={() => onHashtagClick(item.hashtag)} // ⭐️ [ADD] เรียก Handler เมื่อคลิก
                                                    title={`Filter by ${item.hashtag}`}
                                                >
                                                    {item.hashtag}
                                                </span>
                                            </div>
                                            {/* ⭐️ [CSS Enhancement] Count Style */}
                                            <span className="text-xs text-gray-500 font-bold px-2 py-0.5 rounded-full bg-gray-700/50">
                                                {item.count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            
                            </div>
                        ))
                    ) : (
                         <p className="text-gray-500 text-center mt-10">No trending hashtags found.</p>
                    )}
                </div>
             )}


        
        </div>
  );
}

export default SidebarTrending;
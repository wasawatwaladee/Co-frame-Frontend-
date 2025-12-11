import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from '../stores/Store';
import { siteConfig } from '../constant/config';


// ⭐️ URL ใหม่สำหรับ Trending Hashtag
const TRENDING_API_URL = `${siteConfig.SERVER_URL}/api/trending/hashtags`; 

// ⭐️ [UPDATE] รับ onHashtagClick เป็น Prop
function SidebarTrending({ selectedCategory , onClose, onHashtagClick}) {
    // ใช้ categories เพื่อหาชื่อ Header เท่านั้น (ไม่จำเป็นต้อง getCategories ในนี้)
    const categories = useUserStore(state => state.categories);
    
    // ⭐️ ใช้ State ใหม่สำหรับเก็บ Trending Hashtags
    const [trendingData, setTrendingData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // ชื่อ Header (Logic การหาชื่อเหมือนเดิม)
    const [displayCategoryName, setDisplayCategoryName] = useState('ALL'); 
    
    
    // 1. Fetch Trending Hashtags (เมื่อ Category เปลี่ยน)
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


    // 2. useEffect สำหรับอัปเดตชื่อ Header (Logic เหมือนเดิม)
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
    // ⭐️ [CSS Enhancement] ปรับพื้นหลังเป็น Darker Black และ Shadow
    <div className='fixed top-0 mt-20 right-0 p-4 h-[calc(100vh-80px)] w-[350px] overflow-y-auto bg-[#0A0A0A] text-white z-40 shadow-[0_0_20px_rgba(220,38,38,0.3)]'>
            <button 
                onClick={onClose}
                className='absolute top-3 right-3 text-red-500 hover:text-white transition-colors duration-200 font-bold text-xl'
            >
                X
            </button>
            {/* ⭐️ [CSS Enhancement] Header Bar */}
            <h2 className="text-2xl font-extrabold border-b border-red-600 pb-2 mb-4 text-red-500 uppercase tracking-wider">
                Trending : {displayCategoryName} 
            </h2>

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
import React, { useMemo, useState } from 'react';


function SidebarTrending({ selectedCategory }) {

  const [trendingData] = useState([
        // ... (ข้อมูลเดิมทั้งหมด) ...
        { 
            category: 'HORROR', 
            movies: [
                { id: 101, title: 'The Silent House', views: '2.5M views' },
                { id: 102, title: 'Nightmare Alley', views: '1.8M views' },
            ] 
        },
        { 
            category: 'COMEDY', 
            movies: [
                { id: 201, title: 'Crazy Rich Asians', views: '3.1M views' },
                { id: 202, title: 'The Office Movie', views: '2.9M views' },
            ] 
        },
        { 
            category: 'SCI-FI', 
            movies: [
                { id: 301, title: 'Dune: Part Two', views: '4.5M views' },
                { id: 302, title: 'Cyberpunk Rising', views: '3.8M views' },
            ] 
        },
        { 
            category: 'CARTOON', 
            movies: [
                { id: 401, title: 'Spider-Verse 3', views: '5.2M views' },
                { id: 402, title: 'Elemental Journey', views: '4.1M views' },
            ] 
        },
        { 
            category: 'braaaaa 1', 
            movies: [
                { id: 501, title: 'Mystery Film X', views: '1.2M views' },
            ] 
        },
    ])

    const filteredTrending = useMemo(() => {
        const data = trendingData.find(item => item.category === selectedCategory);
        
        return data ? [data] : trendingData; 
    }, [selectedCategory, trendingData]);

  return (
    <div className='fixed top-0 mt-20 right-0 p-4 h-[calc(100vh-80px)] w-[350px] overflow-y-auto bg-black text-white z-40 shadow-2xl'>
            
            <h2 className="text-2xl font-bold border-b border-red-500 pb-2 mb-2 text-red-500">
                Trending: {selectedCategory} 
            </h2>

            {/* ⭐️ 2. แสดงผลข้อมูลที่ถูกกรองแล้ว */}
            <div className="space-y-4">
                {filteredTrending.map((section) => (
                    <div key={section.category} className="bg-black p-3 rounded-lg shadow-md">
                        
                        <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white">
                            {section.category}
                        </h3>

                        <ul className="space-y-2">
                            {section.movies.map((movie, index) => (
                                <li key={movie.id} className="flex justify-between items-center text-sm border-b bg-black pb-2 last:border-b-0">
                                    <div className='flex items-center'>
                                        <span className="font-semibold text-red-500 mr-2">{index + 1}.</span>
                                        <span className="text-gray-300 hover:text-red-500 cursor-pointer transition">{movie.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{movie.views}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
        </div>
  );
}

export default SidebarTrending;
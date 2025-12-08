// import React, { useEffect, useMemo, useState } from 'react';
// import useUserStore from '../stores/Store';
// import axios from 'axios';


// function SidebarTrending({ selectedCategory , onClose, onOpen}) {
//     const categories = useUserStore(state => state.categories);
//     const movies = useUserStore(state => state.movies);
//     const getMovies = useUserStore(state => state.getMovies);
//     const getCategories = useUserStore(state => state.getCategories);
    
//     console.log('selectedCategory from SidebarTrend', selectedCategory)

// //   const [trendingData] = useState([
// //         // ... (ข้อมูลเดิมทั้งหมด) ...
// //         { 
// //             category: 'HORROR', 
// //             movies: [
// //                 { id: 101, title: 'The Silent House', views: '2.5M views' },
// //                 { id: 102, title: 'Nightmare Alley', views: '1.8M views' },
// //             ] 
// //         },
// //         { 
// //             category: 'COMEDY', 
// //             movies: [
// //                 { id: 201, title: 'Crazy Rich Asians', views: '3.1M views' },
// //                 { id: 202, title: 'The Office Movie', views: '2.9M views' },
// //             ] 
// //         },
// //         { 
// //             category: 'SCI-FI', 
// //             movies: [
// //                 { id: 301, title: 'Dune: Part Two', views: '4.5M views' },
// //                 { id: 302, title: 'Cyberpunk Rising', views: '3.8M views' },
// //             ] 
// //         },
// //         { 
// //             category: 'CARTOON', 
// //             movies: [
// //                 { id: 401, title: 'Spider-Verse 3', views: '5.2M views' },
// //                 { id: 402, title: 'Elemental Journey', views: '4.1M views' },
// //             ] 
// //         },
// //         { 
// //             category: 'braaaaa 1', 
// //             movies: [
// //                 { id: 501, title: 'Mystery Film X', views: '1.2M views' },
// //             ] 
// //         },
// //     ])

//       const [posts, setPosts] = useState([]);
//   const token = useUserStore((state) => state.token);
//   const [loading, setLoading] = useState(false); 

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);

//       let url = "http://localhost:5500/api/post";
//       if (selectedCategory) {
//         url += `?categoryId=${selectedCategory}`;
//       }

//       const res = await axios.get(url);
//       setPosts(res.data.posts);
//     } catch (err) {
//       console.error("Error fetching posts:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, [selectedCategory]);

//   console.log('posts from sidebar', posts)
  
// //   console.log('posts[0].category.name from sidebar', posts?[0].category.name)
// //   console.log('posts[0].category from sidebar', posts[0].categoryId)
    

//     // const filteredTrending = useMemo(() => {
//     //     const data = trendingData.find(item => item.category === selectedCategory);
        
//     //     return data ? [data] : trendingData; 
//     // }, [selectedCategory, trendingData]);
    

//   return (
//     <div className='fixed top-0 mt-20 right-0 p-4 h-[calc(100vh-80px)] w-[350px] overflow-y-auto bg-black text-white z-40 shadow-2xl'>
//             <button onClick={onClose}>X</button>
//             <h2 className="text-2xl font-bold border-b border-red-500 pb-2 mb-2 text-red-500">
//                 Trending: 
//             </h2>

            
//              <div className="space-y-4">
                
//                 {/* {posts.map((post) => (
//                     <div key={post.id} className="bg-black p-3 rounded-lg shadow-md">
//                         <div>
                            
//                         {post.category.name}
//                         </div>
//                         <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white">
//                             {post.content}
//                         </h3>

//                         <ul className="space-y-2">
//                             {posts.map((post, index) => (
//                                 <li key={post.id} className="flex justify-between items-center text-sm border-b bg-black pb-2 last:border-b-0">
//                                     <div className='flex items-center'>
//                                         <span className="font-semibold text-red-500 mr-2">{index + 1}.</span>
//                                         <span className="text-gray-300 hover:text-red-500 cursor-pointer transition">{post.title}</span>
//                                     </div>
//                                     <span className="text-xs text-gray-500">{post.views}</span>
//                                 </li>
//                             ))}
//                         </ul>
                    
//                     </div>
//                 ))} */}
                     
                    
//                  <ul className="space-y-2">
//                             {posts.map((post, index) => (
//                                 <>
                                
//                                 <li key={post.id} className="flex justify-between items-center text-sm border-b bg-black pb-2 last:border-b-0">
//                                     <div className='flex items-center'>
                                        
                                        
//                                         <span className="font-semibold text-red-500 mr-2">{index + 1}.</span>
//                                         <span className="text-gray-300 hover:text-red-500 cursor-pointer transition">{post.title}</span>
//                                     </div>
//                                     <span className="text-xs text-gray-500">{post.views}</span>
//                                 </li>
//                                 </>
//                             ))}
//                         </ul>
//             </div>
//         </div>
//   );
// }

// export default SidebarTrending;


import React, { useEffect, useState } from 'react';
import useUserStore from '../stores/Store';
import axios from 'axios';


// ⭐️ ฟังก์ชัน Utility สำหรับจัดกลุ่ม (ย้าย Logic ออกมา)
const groupPostsByCategory = (posts) => {
    if (posts.length === 0) return {};

    const groups = {};

    posts.forEach(post => {
        // ใช้ชื่อ Category จาก Object ที่ถูก Populate มาโดยตรง
        // Log แสดงว่ามี category object อยู่จริง
        const categoryName = post.category?.name || 'Uncategorized'; 
        const categoryId = post.category?.id || post.categoryId || null;

        if (!groups[categoryName]) {
            groups[categoryName] = {
                id: categoryId,
                name: categoryName,
                posts: []
            };
        }
        groups[categoryName].posts.push(post);
    });

    return groups;
};


function SidebarTrending({ selectedCategory , onClose}) {
    // ลบการใช้ categories และ getCategories ออก เพราะไม่จำเป็นสำหรับการจัดกลุ่มแล้ว
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [groupedPosts, setGroupedPosts] = useState({});
    // ใช้ selectedCategory ID เป็นชื่อ Header ชั่วคราวไปก่อน หรือใช้ชื่อเต็มถ้ามี
    const [displayCategoryName, setDisplayCategoryName] = useState('ALL POSTS (ทั้งหมด)'); 
    
    // (ลบ useEffect ที่เรียก getCategories ออก)

    // 1. Fetch Posts (เมื่อ Category เปลี่ยน)
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            let url = "http://localhost:5500/api/post";
            if (selectedCategory) {
                url += `?categoryId=${selectedCategory}`;
            }

            try {
                const res = await axios.get(url);
                setPosts(res.data.posts);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [selectedCategory]);


    // ⭐️ 2. useEffect สำหรับจัดกลุ่มและอัปเดตชื่อ Header (ใช้ posts เป็น Dependency)
    useEffect(() => {
        // ⭐️ จัดกลุ่ม Posts 
        const groups = groupPostsByCategory(posts);
        setGroupedPosts(groups);

        // กำหนดชื่อสำหรับ Header
        let name;
        if (!selectedCategory) {
            name = 'ALL POSTS (ทั้งหมด)';
        } else {
            // เมื่อมีการเลือก Category เฉพาะเจาะจง และมี Post กลับมา
            // เราสามารถดึงชื่อ Category ที่ถูกเลือกจาก Post ตัวแรกได้
            // หรือใช้ selectedCategory (ที่เป็น ID) ไปก่อน
            const firstPost = posts[0];
            name = firstPost?.category?.name || selectedCategory;
        }
        setDisplayCategoryName(name);

    }, [posts, selectedCategory]); 


  return (
    <div className='fixed top-0 mt-20 right-0 p-4 h-[calc(100vh-80px)] w-[350px] overflow-y-auto bg-black text-white z-40 shadow-2xl'>
            <button 
                onClick={onClose}
                className='absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xl'
            >
                X
            </button>
            <h2 className="text-2xl font-bold border-b border-red-500 pb-2 mb-2 text-red-500">
                Trending: {displayCategoryName} 
            </h2>

             {loading ? (
                <p className="text-center text-gray-400">Loading posts...</p>
             ) : (
                <div className="space-y-6 mt-4">
                    
                    {Object.values(groupedPosts).length > 0 ? (
                        // Loop ผ่านกลุ่มที่จัดไว้
                        Object.values(groupedPosts).map((section) => (
                            <div key={section.name} className="bg-gray-900 p-3 rounded-lg shadow-lg">
                                
                                {/* Header ของ Group */}
                                <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white border-b border-gray-700 pb-2">
                                    {section.name} ({section.posts.length})
                                </h3>

                                {/* List Posts ใน Group */}
                                <ul className="space-y-2 pt-2">
                                    {section.posts.map((post, index) => (
                                        <li key={post.id} className="flex justify-between items-start text-sm bg-gray-900 pb-2 last:border-b-0">
                                            <div className='flex items-start gap-2'>
                                                <span className="font-semibold text-red-500">{index + 1}.</span>
                                                <span className="text-gray-300 hover:text-red-500 cursor-pointer transition line-clamp-2">
                                                    {post.title}
                                                </span>
                                            </div>
                                            {/* แสดง views ถ้ามี */}
                                            {post.views && <span className="text-xs text-gray-500">{post.views}</span>}
                                        </li>
                                    ))}
                                </ul>
                            
                            </div>
                        ))
                    ) : (
                         <p className="text-gray-500 text-center">No posts found for trending in this category.</p>
                    )}
                </div>
             )}
        </div>
  );
}

export default SidebarTrending;
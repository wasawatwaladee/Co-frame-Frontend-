import React, { useEffect, useMemo, useState } from 'react';
import useUserStore from '../stores/Store';
import axios from 'axios';


function SidebarTrending({ selectedCategory , onClose, onOpen}) {
    const categories = useUserStore(state => state.categories);
    const movies = useUserStore(state => state.movies);
    const getMovies = useUserStore(state => state.getMovies);
    const getCategories = useUserStore(state => state.getCategories);
    
    console.log('selectedCategory from SidebarTrend', selectedCategory)

//   const [trendingData] = useState([
//         // ... (ข้อมูลเดิมทั้งหมด) ...
//         { 
//             category: 'HORROR', 
//             movies: [
//                 { id: 101, title: 'The Silent House', views: '2.5M views' },
//                 { id: 102, title: 'Nightmare Alley', views: '1.8M views' },
//             ] 
//         },
//         { 
//             category: 'COMEDY', 
//             movies: [
//                 { id: 201, title: 'Crazy Rich Asians', views: '3.1M views' },
//                 { id: 202, title: 'The Office Movie', views: '2.9M views' },
//             ] 
//         },
//         { 
//             category: 'SCI-FI', 
//             movies: [
//                 { id: 301, title: 'Dune: Part Two', views: '4.5M views' },
//                 { id: 302, title: 'Cyberpunk Rising', views: '3.8M views' },
//             ] 
//         },
//         { 
//             category: 'CARTOON', 
//             movies: [
//                 { id: 401, title: 'Spider-Verse 3', views: '5.2M views' },
//                 { id: 402, title: 'Elemental Journey', views: '4.1M views' },
//             ] 
//         },
//         { 
//             category: 'braaaaa 1', 
//             movies: [
//                 { id: 501, title: 'Mystery Film X', views: '1.2M views' },
//             ] 
//         },
//     ])

      const [posts, setPosts] = useState([]);
  const token = useUserStore((state) => state.token);
  const [loading, setLoading] = useState(false); 

  const fetchPosts = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5500/api/post";
      if (selectedCategory) {
        url += `?categoryId=${selectedCategory}`;
      }

      const res = await axios.get(url);
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  console.log('posts from sidebar', posts)
//   console.log('posts[0].category from sidebar', posts[0].categoryId)
    

    // const filteredTrending = useMemo(() => {
    //     const data = trendingData.find(item => item.category === selectedCategory);
        
    //     return data ? [data] : trendingData; 
    // }, [selectedCategory, trendingData]);
    

  return (
    <div className='fixed top-0 mt-20 right-0 p-4 h-[calc(100vh-80px)] w-[350px] overflow-y-auto bg-black text-white z-40 shadow-2xl'>
            <button onClick={onClose?onClose:onOpen}>X</button>
            <h2 className="text-2xl font-bold border-b border-red-500 pb-2 mb-2 text-red-500">
                Trending: 
            </h2>

            
             <div className="space-y-4">
                
                {/* {posts.map((post) => (
                    <div key={post.id} className="bg-black p-3 rounded-lg shadow-md">
                        <div>
                            
                        {post.category.name}
                        </div>
                        <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white">
                            {post.content}
                        </h3>

                        <ul className="space-y-2">
                            {posts.map((post, index) => (
                                <li key={post.id} className="flex justify-between items-center text-sm border-b bg-black pb-2 last:border-b-0">
                                    <div className='flex items-center'>
                                        <span className="font-semibold text-red-500 mr-2">{index + 1}.</span>
                                        <span className="text-gray-300 hover:text-red-500 cursor-pointer transition">{post.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{post.views}</span>
                                </li>
                            ))}
                        </ul>
                    
                    </div>
                ))} */}
                     
                    
               
                 <ul className="space-y-2">
                            {posts.map((post, index) => (
                                <li key={post.id} className="flex justify-between items-center text-sm border-b bg-black pb-2 last:border-b-0">
                                    <div className='flex items-center'>
                                        
                                        <span className="font-semibold text-red-500 mr-2">{index + 1}.</span>
                                        <span className="text-gray-300 hover:text-red-500 cursor-pointer transition">{post.title}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{post.views}</span>
                                </li>
                            ))}
                        </ul>
            </div>
        </div>
  );
}

export default SidebarTrending;
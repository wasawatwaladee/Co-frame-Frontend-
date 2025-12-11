import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";

// ⭐️ คอมโพเนนต์ที่ถูกจัด CSS ใหม่
const PostDisplay = ({ post, onDelete, index }) => {
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  
  return (
  <div
    key={post.id}
    // ⭐️ ปรับพื้นหลังและเงาให้ดูคล้ายการ์ดโพสต์สมัยใหม่
    className={`pt-6 transition-colors duration-300 animate-fade-up`}
    style={{ animationDelay: ${index * 0.25}s }}
  >
    <div
      className={`flex flex-col gap-4 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? "bg-gray-900/50 hover:bg-gray-900/70" : "hover:bg-white"
      }`}
    >
      {/* 1. Header และ User Info */}
      <div className="flex items-start gap-4">
        {/* Profile Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <svg
            className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {/* ชื่อผู้ใช้ */}
              <p className={`font-semibold hover:text-blue-400 cursor-pointer transition-colors ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>
                {post.user?.username || "Unknown User"}
              </p>
              {/* เวลาโพสต์ */}
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                · {new Date(post.createdAt || post.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            {/* ปุ่มลบ */}
            <button
              onClick={() => onDelete(post.id)}
              className={`flex-shrink-0 p-1 rounded transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-500 hover:text-red-500' 
                  : 'hover:bg-gray-200 text-gray-400 hover:text-red-500'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 2. เนื้อหา (Title และ Content) */}
      <div>
          <h4 className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {post.title}
          </h4>
          {/* whitespace-pre-wrap สำคัญเพื่อให้รองรับการขึ้นบรรทัดใหม่ในข้อความ */}
          <p className={`whitespace-pre-wrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {post.content}
          </p>
      </div>

      {/* 3. รูปภาพ/Thumbnail */}
      { post.thumbnail && (
       <div>
         {/* ⭐️ ปรับขนาดรูป: Max-width เต็ม PostContainer, Max-height จำกัดไว้, object-cover เพื่อให้รูปไม่ยืด */}
         <img 
              src={post.thumbnail} 
              alt="thumbnail" 
              className={`w-full h-64 object-cover rounded-xl border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              }`}
              loading="lazy"
          />
       </div>
      )}
    </div>
  </div>
  );
};

function PostContainer({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const token = useUserStore((state) => state.token);
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  const [loading, setLoading] = useState(false); 

  console.log('categoryId from PostContainer', categoryId)
  const fetchPosts = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5500/api/post";
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
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
  }, [categoryId]);

  console.log('posts from PostContainer', posts)

  const handleDeletePost = async (postId) => {
    if (!confirm("ต้องการลบโพสต์นี้ใช่ไหม?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/post/${postId}`, {
        headers: { Authorization: Bearer ${token} },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen gap-4 rounded-lg bg-transparent">
      {/* <h3 className="text-xl font-bold text-white mt-4 mb-4 border-b border-gray-700 pb-2">
        รายการโพสต์ {categoryId ? "(กรองตามหมวดหมู่)" : "(ทั้งหมด)"}
      </h3> */}

      <div className="space-y-0">
        {loading ? (
          <p className={`text-center ${isDarkMode ? 'text-white' : 'text-black'}`}>กำลังโหลด...</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <PostDisplay
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              index={index}
            />
          ))
        ) : (
          <p className={`text-center py-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            ยังไม่มีโพสต์ในหมวดหมู่นี้
          </p>
        )}
      </div>

    </div>
  );
}

export default PostContainer;
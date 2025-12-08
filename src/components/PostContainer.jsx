import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import PostForm from "./PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";

// Modal Component (ไม่มีการเปลี่ยนแปลง CSS ที่สำคัญ)
const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-100">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

// ⭐️ คอมโพเนนต์ที่ถูกจัด CSS ใหม่
const PostDisplay = ({ post, onDelete }) => (
  <div
    key={post.id}
    // ⭐️ ปรับพื้นหลังและเงาให้ดูคล้ายการ์ดโพสต์สมัยใหม่
    className="bg-gray-900 shadow-lg rounded-xl p-4 border border-gray-700 relative text-white"
  >
    {/* 1. Header และ User Info */}
    <div className="flex items-start justify-between mb-3">
        
      <div className="flex items-center">
        {/* (Optional) ใส่รูปโปรไฟล์ถ้ามี */}
        {/* <img src={post.user?.picture} className="w-10 h-10 rounded-full mr-2"/> */}
        
        <div>
            {/* ชื่อผู้ใช้ */}
            <p className="font-semibold text-white hover:text-blue-400 cursor-pointer">
              {post.user?.username || "Unknown User"}
            </p>

            {/* เวลาโพสต์ */}
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt || post.timestamp).toLocaleString()}
            </p>
        </div>
      </div>
     
    

      {/* ปุ่มลบ (อยู่ขวาบน) */}
      <button
        onClick={() => onDelete(post.id)}
        className="text-gray-500 hover:text-red-500 text-xl font-bold p-1 transition duration-150"
      >
        X
      </button>
    </div>
    
    {/* 2. เนื้อหา (Title และ Content) */}
    <div className="mb-3">
        <h4 className="font-bold text-lg mb-1">{post.title}</h4>
        {/* whitespace-pre-wrap สำคัญเพื่อให้รองรับการขึ้นบรรทัดใหม่ในข้อความ */}
        <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
    </div>


    {/* 3. รูปภาพ/Thumbnail */}
    { post.thumbnail && (
     <div className="mt-3">
       {/* ⭐️ ปรับขนาดรูป: Max-width เต็ม PostContainer, Max-height จำกัดไว้, object-cover เพื่อให้รูปไม่ยืด */}
       <img 
            src={post.thumbnail} 
            alt="thumbnail" 
            className="w-full h-96 object-cover rounded-lg border border-gray-700" 
            loading="lazy"
        />
     </div>
    )}
  </div>
);

function PostContainer({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const token = useUserStore((state) => state.token);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handlePostCreated = () => {
    fetchPosts();
    closeModal();
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("ต้องการลบโพสต์นี้ใช่ไหม?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="w-[680px] mx-auto min-h-screen gap-4 rounded-lg bg-transparent">
      <CreatePost onOpenForm={openModal} />

      <h3 className="text-xl font-bold text-white mt-4 mb-4 border-b border-gray-700 pb-2">
        รายการโพสต์ {categoryId ? "(กรองตามหมวดหมู่)" : "(ทั้งหมด)"}
      </h3>

      <div className="space-y-4">
        {loading ? (
          <p className="text-white text-center">กำลังโหลด...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostDisplay
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">
            ยังไม่มีโพสต์ในหมวดหมู่นี้
          </p>
        )}
      </div>

     
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <PostForm  onPostCreated={handlePostCreated} />
        </Modal>
      )}

    </div>
  );
}

export default PostContainer;
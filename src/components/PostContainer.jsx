import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import PostForm from "./PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";

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

const PostDisplay = ({ post, onDelete }) => (
  <div
    key={post.id}
    className="bg-gray-300 shadow-md rounded-xl p-4 border border-gray-200 relative"
  >
    <div className="flex items-center mb-3">
      {/* (Optional) ใส่รูปโปรไฟล์ถ้ามี */}
      {/* <img src={post.user?.picture} className="w-10 h-10 rounded-full mr-2"/> */}

      <div>
        {/* ✅ แก้จุดที่ 1: ต้องเข้าถึง username ข้างใน post.user */}
        {/* ใช้ ?. (Optional Chaining) กัน error กรณีข้อมูล user ไม่มา */}
        <p className="font-semibold text-gray-800">
          {post.user?.username || "Unknown User"}
        </p>

        {/* ✅ แก้จุดที่ 2: ใช้ post.createdAt หรือ timestamp จาก DB */}
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt || post.timestamp).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => onDelete(post.id)}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl font-bold p-1 transition duration-150"
      >
        X
      </button>
    </div>
    {/* ✅ แก้จุดที่ 3: ใช้ post.content ให้ตรงกับ Schema Database */}
    <h4 className="font-bold text-lg mb-1">{post.title}</h4>{" "}
    {/* เพิ่ม Title ถ้ามี */}
    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
  </div>
);

function PostContainer({ categoryId }) {
  const [posts, setPosts] = useState([]);
  const token = useUserStore((state) => state.token);
  const [loading, setLoading] = useState(false); // เพิ่ม loading state ให้ดูดีขึ้น

  // ✅ 2. ปรับ URL ให้รองรับการกรองหมวดหมู่
  const fetchPosts = async () => {
    try {
      setLoading(true);

      // ถ้ามี categoryId ให้ต่อท้าย URL
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

  // ✅ 3. ใส่ categoryId ใน Dependency Array
  // (แปลว่า: ถ้า categoryId เปลี่ยน ให้รัน fetchPosts ใหม่ทันที)
  useEffect(() => {
    fetchPosts();
  }, [categoryId]);

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
    <div className=" w-[680px] mx-auto min-h-screen flex flex-col gap-4 rounded-lg bg-transparent ">
      <CreatePost onOpenForm={openModal} />

      <h3 className=" text-xl font-bold text-white mt-4">
        {/* แสดงชื่อหมวดหมู่ด้วยก็ได้ (ถ้าอยากทำเพิ่ม) */}
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
          <PostForm onPostCreated={handlePostCreated} />
        </Modal>
      )}
    </div>
  );
}

export default PostContainer;

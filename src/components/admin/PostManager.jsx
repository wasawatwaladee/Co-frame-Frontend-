import { useState, useEffect } from "react";
import { Trash2, Loader, Eye, MessageCircle } from "lucide-react";
import axios from "axios";
import useUserStore from "../../stores/Store";
import { toast } from "react-toastify";

const PostItem = ({ post, onDelete }) => {
  // แปลงวันที่
  const formattedDate = new Date(post.createdAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // เช็คจำนวน comments และ likes
  const commentCount = post.comments ? post.comments.length : 0;
  const likeCount = post.likes ? post.likes.length : 0;

  return (
    <div className="bg-gray-800 p-4 mb-3 rounded-lg flex justify-between items-start hover:bg-gray-700 transition duration-150 ease-in-out border border-gray-700">
      <div className="flex flex-col flex-1 pr-4">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Title */}
          <span className="text-white font-medium text-lg line-clamp-1">
            {post.title || "ไม่มีหัวข้อ"}
          </span>

          {/* Status Badge */}
          {post.status === "DRAFT" && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-600 text-gray-300">
              แบบร่าง
            </span>
          )}

          {/* Action Button */}
          <button className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150">
            ดูโพสต์
          </button>
        </div>

        {/* Description/Content */}
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
          {post.content || post.description || "-"}
        </p>

        {/* Metadata */}
        <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mt-2">
          <span className="text-gray-300">
            โดย <strong>{post.user?.username || "Unknown"}</strong>
          </span>
          <span>&bull;</span>
          <span>{formattedDate}</span>

          <span className="flex items-center gap-1">
            &bull; <Eye size={14} /> {likeCount} Likes
          </span>
          <span className="flex items-center gap-1">
            &bull; <MessageCircle size={14} /> {commentCount} Comments
          </span>
        </div>
      </div>

      {/* Delete Icon */}
      <button
        onClick={() => onDelete(post.id)}
        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition duration-150 flex-shrink-0"
        title="ลบโพสต์"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

// ------------------------------------------
// 2. Main Component (PostManager)
// ------------------------------------------
const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = useUserStore((state) => state.token);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5500/api/post", {});

      let data = [];
      if (Array.isArray(res.data)) data = res.data;
      else if (res.data?.posts) data = res.data.posts;

      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete Post
  const handleDelete = async (id) => {
    // if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Delete successfully")
    } catch (err) {
      toast.error("Failed delete: " + (err.response?.data?.message || err.message));
    }
  };

  // Search Logic
  const filteredPosts = posts.filter((post) => {
    const title = post.title?.toLowerCase() || "";
    const content = post.content?.toLowerCase() || "";
    const author = post.user?.username?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      title.includes(search) ||
      content.includes(search) ||
      author.includes(search)
    );
  });

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header and Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">จัดการโพสต์</h2>
            <span className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              ทั้งหมด:{" "}
              <strong className="text-white ml-1">{posts.length}</strong>
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อโพสต์, เนื้อหา..."
              className="p-2 pl-4 pr-10 w-64 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all focus:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- Navbar เอาออกแล้ว --- */}

        {/* Post List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-white">
            <Loader className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={handleDelete} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">ไม่พบข้อมูลโพสต์</p>
                {searchTerm && (
                  <p className="text-gray-600 text-sm mt-2">
                    ลองค้นหาด้วยคำอื่น
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManager;

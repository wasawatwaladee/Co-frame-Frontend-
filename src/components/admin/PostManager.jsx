import { useState, useEffect } from "react";
import { Trash2, Loader, Eye, MessageCircle } from "lucide-react";
import axios from "axios";
import useUserStore from "../../stores/Store";
import { toast } from "react-toastify";

const PostItem = ({ post, onDelete }) => {
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Check comment and like counts
  const commentCount = post.comments ? post.comments.length : 0;
  const likeCount = post.likes ? post.likes.length : 0;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] p-5 mb-3 rounded-xl flex justify-between items-start hover:shadow-md dark:hover:bg-[#252525] transition-all duration-200 border border-gray-200 dark:border-white/5">
      <div className="flex flex-col flex-1 pr-4">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Title */}
          <span className="text-gray-900 dark:text-white font-semibold text-lg line-clamp-1">
            {post.title || "Untitled"}
          </span>

          {/* Status Badge */}
          {post.status === "DRAFT" && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/30">
              Draft
            </span>
          )}

          {/* View Button */}
          <button className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-700 transition-all duration-200 cursor-pointer">
            View Post
          </button>
        </div>

        {/* Description/Content */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
          {post.content || post.description || "-"}
        </p>

        {/* Metadata */}
        <div className="flex items-center flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
          <span className="text-gray-700 dark:text-gray-300">
            by <strong className="font-semibold">{post.user?.username || "Unknown"}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{formattedDate}</span>

          <span className="flex items-center gap-1.5">
            <Eye size={14} /> {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} /> {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(post.id)}
        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 cursor-pointer"
        title="Delete Post"
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
    <div>
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Post Management</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Manage and moderate all user posts</p>
            </div>

            <span className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold">
              Total: <strong className="text-gray-900 dark:text-white ml-2">{posts.length}</strong>
            </span>
          </div>

          <div className="relative w-full md:w-96 mb-6">
            <input
              type="text"
              placeholder="Search posts, content, author..."
              className="w-full p-3 pl-10 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-3.5 text-gray-400 dark:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

      {/* Posts List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-600 dark:text-gray-400">
            <Loader className="animate-spin mr-2" size={20} /> Loading posts...
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostItem key={post.id} post={post} onDelete={handleDelete} />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No posts found</p>
                {searchTerm && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Try searching with different keywords
                  </p>
                )}
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default PostManager;

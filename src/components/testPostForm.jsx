import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/Store";
import { toast } from "react-toastify";
import { siteConfig } from "../constant/config";

function PostForm({ onPostCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const token = useUserStore((state) => state.token);
  const isDarkMode = useUserStore((state) => state.isDarkMode);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${siteConfig.SERVER_URL}/api/categories`);
        setCategories(res.data.categories);
        if (res.data.categories.length > 0) {
          setCategoryId(res.data.categories[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 3. ฟังก์ชัน Submit Form
  const hdlCreatePost = async (e) => {
    e.preventDefault();

    // Validation เบื้องต้น
    if (!title.trim() || !content.trim() || !categoryId) {
      return toast.warn("กรุณากรอกหัวข้อ เนื้อหา และเลือกหมวดหมู่");
    }

    try {
      setLoading(true);

      // ยิง API สร้าง Post
      const response = await axios.post(
        `${siteConfig.SERVER_URL}/api/post`,
        {
          title: title,
          content: content,
          categoryId: Number(categoryId),
          thumbnail: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setContent("");
      setImageUrl("");

      if (onPostCreated) {
        onPostCreated(response.data.result);
      }

      toast.success("สร้างโพสต์สำเร็จ!");
    } catch (error) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างโพสต์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl shadow-2xl overflow-hidden border transition-all duration-300 max-w-2xl w-full mx-auto ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-200'
    }`}>
      {/* Header with Cinema Effect */}
      <div className={`relative px-6 py-6 border-b ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 blur-[60px] rounded-full ${
          isDarkMode ? 'bg-red-500/30' : 'bg-red-400/30'
        }`}></div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-2xl font-black tracking-tight bg-gradient-to-r ${
              isDarkMode 
                ? 'from-red-400 via-red-500 to-red-600' 
                : 'from-red-600 via-red-500 to-red-700'
            } bg-clip-text text-transparent uppercase drop-shadow-sm`}>
              Create Your Post
            </h3>
            <p className={`text-xs font-medium tracking-wide mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Share your thoughts
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={hdlCreatePost} className="p-6 space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold tracking-wide uppercase ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Post Title
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 focus:ring-2 focus:ring-offset-0 outline-none ${
              isDarkMode 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20'
            }`}
            placeholder="Enter your post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category & Image URL Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Category Select */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold tracking-wide uppercase ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 focus:ring-2 focus:ring-offset-0 outline-none cursor-pointer ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white focus:border-red-500 focus:ring-red-500/20' 
                  : 'bg-white border-gray-200 text-black focus:border-red-500 focus:ring-red-500/20'
              }`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL Input */}
          <div className="space-y-2">
            <label className={`block text-xs font-bold tracking-wide uppercase ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Image URL
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 focus:ring-2 focus:ring-offset-0 outline-none ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20'
              }`}
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Content Textarea */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold tracking-wide uppercase ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Content
          </label>
          <textarea
            rows="4"
            className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 focus:ring-2 focus:ring-offset-0 outline-none resize-none ${
              isDarkMode 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'bg-white border-gray-200 text-black placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20'
            }`}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm tracking-wide uppercase transition-all duration-300 cursor-pointer transform hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/40 disabled:shadow-none'
                : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/40 disabled:shadow-none'
            }`}
            disabled={loading || !title.trim() || !content.trim() || !categoryId}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 text-xs">
                <span className="animate-spin">⏳</span>
                Posting...
              </span>
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
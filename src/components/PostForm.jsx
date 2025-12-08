import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/Store";
import { toast } from "react-toastify";

function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const token = useUserStore((state) => state.token);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5500/api/categories");
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
        "http://localhost:5500/api/post",
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Post</h3>

      <form onSubmit={hdlCreatePost} className="flex flex-col gap-4">
        {/* Input: Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            หัวข้อ
          </label>
          <input
            type="text"
            className="text-black border border-gray-300 p-3 rounded-lg w-full focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="หัวข้อเรื่อง..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Input: Category & Image URL (วางคู่กัน) */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมวดหมู่
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-red-500 focus:border-red-500 outline-none"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="" disabled>
                เลือกหมวดหมู่
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รูปภาพ (URL)
            </label>
            <input
              type="text"
              className="text-black border border-gray-300 p-3 rounded-lg w-full focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Input: Content (Textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            เนื้อหา
          </label>
          <textarea
            rows="4"
            className="text-black border border-gray-300 p-3 rounded-lg w-full focus:ring-red-500 focus:border-red-500 outline-none resize-none"
            placeholder="คุณกำลังคิดอะไรอยู่?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 mt-2 shadow-lg shadow-red-500/30"
          disabled={loading || !title.trim() || !content.trim() || !categoryId}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default PostForm;

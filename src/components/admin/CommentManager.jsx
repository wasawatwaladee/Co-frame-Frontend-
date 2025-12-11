import { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import axios from "axios";
import useUserStore from "../../stores/Store";

const CommentItem = ({ comment, onDelete }) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "th-TH",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedTime = new Date(comment.createdAt).toLocaleTimeString(
    "th-TH",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const displayUsername =
    comment.user?.username && comment.user.username !== ""
      ? comment.user.username
      : `ไม่ระบุชื่อ (User ID: ${comment.userId})`;

  return (
    <div className="bg-gray-800 p-4 mb-3 rounded-lg flex justify-between items-start hover:bg-gray-700 transition duration-150 ease-in-out border border-gray-700">
      <div className="flex flex-col w-full pr-4">
        {/* Username */}
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-white font-semibold text-lg">
            {displayUsername}
          </span>
        </div>

        {/* Post Title */}
        <p className="text-gray-400 text-sm mb-2">
          โพสต์:{" "}
          <span className="text-blue-400 font-medium cursor-pointer hover:underline">
            {comment.post?.title || "ไม่ระบุหัวข้อ"}
          </span>
        </p>

        {/* Comment Content */}
        <p className="text-gray-200 mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Date/Time */}
        <div className="text-xs text-gray-500 flex gap-2">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{formattedTime} น.</span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(comment.id)}
        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition duration-150 flex-shrink-0"
        title="ลบความคิดเห็น"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useUserStore((state) => state.token);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5500/api/comment", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data)) {
        setComments(res.data.allComment);
      } else if (res.data?.allComment && Array.isArray(res.data.allComment)) {
        setComments(res.data.allComment);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันที่จะลบความคิดเห็นนี้?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ลบออกจาก state โดย filter id ที่ตรงกันออก
      setComments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("ลบไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-bold text-white">จัดการคอมเมนต์</h2>
            <div className="flex space-x-3 text-sm">
              <span className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full">
                ทั้งหมด:{" "}
                <strong className="font-bold text-white ml-1">
                  {comments?.length || 0}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* --- Content --- */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-white">
            <Loader className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="space-y-2">
            {comments && comments.length > 0 ? (
              comments.map((item) => (
                <CommentItem
                  key={item.id}
                  comment={item}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">
                ไม่พบความคิดเห็น
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentManager;

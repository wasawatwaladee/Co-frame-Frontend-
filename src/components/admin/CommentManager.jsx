import { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import axios from "axios";
import useUserStore from "../../stores/Store";
import { toast } from "react-toastify";

const CommentItem = ({ comment, onDelete }) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const formattedTime = new Date(comment.createdAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const displayUsername =
    comment.user?.username && comment.user.username !== ""
      ? comment.user.username
      : `Anonymous (User ID: ${comment.userId})`;

  return (
    <div className="bg-white dark:bg-[#1a1a1a] p-5 mb-3 rounded-xl flex justify-between items-start hover:shadow-md dark:hover:bg-[#252525] transition-all duration-200 border border-gray-200 dark:border-white/5">
      <div className="flex flex-col w-full pr-4">
        {/* Username */}
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-gray-900 dark:text-white font-semibold text-base">
            {displayUsername}
          </span>
        </div>

        {/* Post Title */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          On post:{" "}\n          <span className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
            {comment.post?.title || "Untitled"}
          </span>
        </p>

        {/* Comment Content */}
        <p className="text-gray-700 dark:text-gray-200 mb-3 whitespace-pre-wrap text-sm leading-relaxed">
          {comment.content}
        </p>

        {/* Date/Time */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex gap-2">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(comment.id)}
        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 cursor-pointer"
        title="Delete Comment"
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
    // if (!window.confirm("ยืนยันที่จะลบความคิดเห็นนี้?")) return;

    try {
      await axios.delete(`http://localhost:5500/api/comment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ลบออกจาก state โดย filter id ที่ตรงกันออก
      setComments((prev) => prev.filter((item) => item.id !== id));
      toast.success("Delete successfully")
    } catch (err) {
      toast.error("Failed delete: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Comment Management</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Review and moderate user comments</p>
            </div>

            <span className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold">
              Total: <strong className="text-gray-900 dark:text-white ml-2">{comments?.length || 0}</strong>
            </span>
      </div>

      {/* Comments List */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-600 dark:text-gray-400">
            <Loader className="animate-spin mr-2" size={20} /> Loading comments...
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
              <div className="text-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  No comments found
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default CommentManager;

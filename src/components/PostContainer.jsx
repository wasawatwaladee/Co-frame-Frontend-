import { useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import PostForm from "./PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";
import { toast } from "react-toastify"; // อย่าลืมติดตั้ง react-toastify และ ToastContainer ใน App.jsx
import {siteConfig} from "../constant/config"

const Modal = ({ children, onClose }) => {
  return (
    // ⭐️ [CSS Enhancement] Modal Backdrop and Box
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[100] backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const CommentItem = ({ comment, currentUser, token }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const likes = comment.likes || [];
    setLikeCount(likes.length);

    const userLiked = likes.find((l) => l.userId === currentUser?.id);
    setIsLiked(!!userLiked);
  }, [comment, currentUser]);

  const handleLikeComment = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      await axios.post(
        `${siteConfig.SERVER_URL}/api/comment/${comment.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Like comment error:", error);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 overflow-hidden">
        {comment.user?.picture ? (
          <img
            src={comment.user.picture}
            className="w-full h-full object-cover"
            alt="avatar"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300 font-bold">
            {comment.user?.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        {/* ⭐️ [CSS Enhancement] Comment Bubble */}
        <div className="bg-[#2A2A2A] rounded-xl p-3 text-sm relative group shadow-inner shadow-black/20"> 
          <p className="font-bold text-gray-200 mb-1">
            {comment.user?.username || "Unknown"}
          </p>
          <p className="text-gray-400 mb-2">{comment.content}</p>

          <div className="flex items-center justify-end border-t border-gray-700/50 pt-2 mt-1">
            <button
              onClick={handleLikeComment}
              className={`flex items-center gap-1 text-xs font-semibold transition ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              <span>{likeCount > 0 ? likeCount : ""}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PostDisplay component (ปรับ CSS)
const PostDisplay = ({ post, onDelete, currentUser, token }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (post.likes) {
      setLikeCount(post.likes.length);
      const userLiked = post.likes.find(
        (like) => like.userId === currentUser?.id
      );
      setIsLiked(!!userLiked);
    }
    if (post.comments) {
      setComments(post.comments);
    }
  }, [post, currentUser]);

  const handleLikePost = async () => {
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      await axios.post(
        `${siteConfig.SERVER_URL}/api/post/${post.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Like Post error:", error);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (!isLiked ? prev + 1 : prev - 1));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      const res = await axios.post(
        `${siteConfig.SERVER_URL}/api/comment/`,
        {
          content: commentText,
          postId: post.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = res.data.result;
      const commentWithUser = {
        ...newComment,
        user: {
          id: currentUser.id,
          username: currentUser.username || "Me",
          picture: currentUser.picture,
        },
        likes: [],
      };

      setComments([...comments, commentWithUser]);
      setCommentText("");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error("คอมเมนต์ไม่สำเร็จ");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    // ⭐️ [CSS Enhancement] Post Card
    <div className="bg-[#121212] shadow-xl rounded-xl p-5 border border-gray-800 relative text-white mb-6 transition-all duration-300 hover:shadow-red-900/10 hover:border-red-600/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-700 overflow-hidden shrink-0 border-2 border-red-500">
            {post.user?.picture ? (
              <img
                src={post.user.picture}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {post.user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-white hover:text-red-400 cursor-pointer transition-colors">
              {post.user?.username || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt || post.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {currentUser?.id === post.userId && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-500 hover:text-red-500 text-lg p-1 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="mt-3 mb-4">
          <img
            src={post.thumbnail}
            alt="thumbnail"
            className="w-full max-h-96 object-cover rounded-lg border border-gray-700 shadow-md"
            loading="lazy"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center gap-8 border-t border-gray-800 pt-3 mt-2">
        <button
          onClick={handleLikePost}
          className={`flex items-center gap-2 transition hover:text-red-500 ${
            isLiked ? "text-red-500" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span className="font-semibold">{likeCount} Likes</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <span className="font-semibold">{comments.length} Comments</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-800 animate-fade-in-down">
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <CommentItem
                  key={comment.id || index}
                  comment={comment}
                  currentUser={currentUser}
                  token={token}
                />
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-2">
                Be the first to comment!
              </p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentLoading}
            />
            <button
              type="submit"
              disabled={!commentText.trim() || commentLoading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// 4. Main PostContainer
// ----------------------------------------------------
// ⭐️ [UPDATE] รับ selectedHashtag เป็น Prop
function PostContainer({ categoryId, selectedHashtag }) { 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = useUserStore(state=>state.categories)
  const getCategories = useUserStore(state=>state.getCategories)

  // ⭐️ [UPDATE] fetchPosts เพื่อรวม Hashtag ใน Query
  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `${siteConfig.SERVER_URL}/api/post`;
      const params = {};

      if (categoryId) {
        params.categoryId = categoryId;
      }
      
      // ⭐️⭐️ [ADD] เพิ่ม Hashtag ใน Query Parameter ถ้ามี
      if (selectedHashtag) {
        // ส่ง Hashtag ไปยัง Backend โดยลบ '#' ออก (Backend ควรรับเฉพาะคำ)
        params.hashtag = selectedHashtag.substring(1); 
      }
      
      const res = await axios.get(url, { params: params });
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ [UPDATE] Dependency Array ต้องรวม selectedHashtag
  useEffect(() => {
    fetchPosts();
  }, [categoryId, selectedHashtag]); 

  useEffect(() => {
    if (Array.isArray(categories) && categories.length === 0) {
      getCategories();
    }
  }, [categories, getCategories]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePostCreated = () => {
    fetchPosts();
    closeModal();
    // ⭐️ ควรเพิ่ม signalPostUpdate() ที่เราคุยกันก่อนหน้า เพื่ออัปเดต Trending
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("ต้องการลบโพสต์นี้ใช่ไหม?")) return;

    try {
      await axios.delete(`${siteConfig.SERVER_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Delete post successfully")
      // ⭐️ ควรเพิ่ม signalPostUpdate() เพื่ออัปเดต Trending
    } catch (err) {
      toast.error(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  // ⭐️ [UPDATE] Logic การหาชื่อ Category และ Header
  const categoryName = categoryId
    ? categories.find(c => c.id === categoryId)?.name || "Loading..."
    : "All Posts";
    
  const displayHeader = selectedHashtag 
    ? `Posts containing: ${selectedHashtag}` // แสดง Hashtag ถ้าถูกเลือก
    : (
        categoryId 
          ? (loading ? `Posts : ${categoryName} (Loading...)` : `Posts : ${categoryName}`)
          : `Posts : All`
      );

  return (
    // ⭐️ [CSS Enhancement] Layout Width
    <div className="w-full max-w-[800px] mx-auto min-h-screen gap-4 rounded-lg bg-transparent"> 
      <CreatePost onOpenForm={openModal} />

      {/* ⭐️ [CSS Enhancement] Header Bar */}
      <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2 uppercase tracking-wide">
        {displayHeader}
      </h3>

      <div className="space-y-4 pb-20">
        {loading ? (
          <p className="text-white text-center">กำลังโหลด...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostDisplay
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              currentUser={user}
              token={token}
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
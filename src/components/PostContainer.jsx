import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import useUserStore from "../stores/Store";
import axios from "axios";
import { toast } from "react-toastify";
import { siteConfig } from "../constant/config";
import { useNavigate } from "react-router";

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

// ⭐️ คอมโพเนนต์ที่ถูกจัด CSS ใหม่
const PostDisplay = ({ post, onDelete, index, currentUser, token}) => {
  const isDarkMode = useUserStore((state) => state.isDarkMode);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

    const navigate = useNavigate()

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
    const previousLiked = isLiked;
    const previousCount = likeCount;

    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.post(
        `${siteConfig.SERVER_URL}/api/post/${post.id}/like`,
        {},
        config
      );
    } catch (error) {
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
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
   
  

    <div
      key={post.id}
      // ⭐️ ปรับพื้นหลังและเงาให้ดูคล้ายการ์ดโพสต์สมัยใหม่
      className={`pt-6 transition-colors duration-300 animate-fade-up`}
      style={{ animationDelay: `${index * 0.25}s` }}
    >
      <div
        className={`flex flex-col gap-5 p-7 rounded-3xl shadow-lg transition-all duration-300 group hover:shadow-2xl ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-900/90 to-gray-950 hover:from-gray-800 hover:via-gray-900 border border-gray-800 hover:border-gray-700' 
            : 'bg-gradient-to-br from-white via-gray-50 to-white hover:from-white hover:via-white border border-gray-200 hover:border-gray-300'
        }`}
      >
        {/* ⭐️ Cinema Glow Effect - Elegant blurred gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-32 blur-3xl pointer-events-none opacity-60">
          <div className={`w-full h-full rounded-full ${
            isDarkMode ? 'bg-red-500/20' : 'bg-red-400/20'
          }`} />
        </div>

        {/* 1. Header and User Info - Elegant spacing */}
        <div className="flex items-start gap-4 relative z-10">
          {/* Profile Avatar - Elegant styling */}
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 shadow-md transition-all duration-300 group-hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-700 to-red-800 border-red-600 shadow-red-900/30' 
                  : 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 shadow-red-400/30'
              }`}
            >
              {post.user?.picture ? (
                <img
                  src={post.user.picture}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className={`w-6 h-6 ${isDarkMode ? 'text-red-100' : 'text-red-50'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {/* ⭐️ Avatar Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-md -z-10 ${
              isDarkMode ? 'bg-red-900/30' : 'bg-red-400/20'
            }`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-3 min-w-0">
                {/* Username - Elegant typography */}
                <p 
                onClick={() => navigate(`/profile/${post.user.username}`)}
                className={`font-bold text-base group-hover:text-red-500 cursor-pointer transition-colors truncate 
                ${isDarkMode ? 'text-white' : 'text-black'}`
                 
                
                }>
                  {post.user?.username || "Unknown User"}
                </p>
                {/* Post timestamp */}
                <span className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                  {new Date(post.createdAt || post.timestamp).toLocaleDateString()}
                </span>
              </div>

              {/* Delete button - Elegant hover */}
              {post.userId === currentUser?.id && (
                <button
                  onClick={() => onDelete(post.id)}
                  className={`shrink-0 p-2 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-red-900/30 text-gray-600 hover:text-red-500' 
                      : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                  }`}
                  title="Delete post"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Content - Elegant text styling */}
        <div className="relative z-10 px-1">
          <p className={`whitespace-pre-wrap text-sm leading-relaxed font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {post.content}
          </p>
        </div>

        {/* 3. Thumbnail - Elegant image styling */}
        {post.thumbnail && (
          <div className="relative z-10 -mx-7 px-7">
            <div className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl border transition-colors duration-300 ${
              isDarkMode ? 'border-gray-900 hover:border-gray-950' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <img 
                src={post.thumbnail} 
                alt="post thumbnail" 
                className={`w-full h-64 object-cover transition-transform duration-500`}
                loading="lazy"
              />
            </div>
          </div>
        )}
        {/* 4. Action Bar - Elegant button styling */}
        <div className={`flex items-center gap-6 pt-2 relative z-10 ${
          isDarkMode ? 'border-t border-gray-800/50' : 'border-t border-gray-300/50'
        }`}>
          <button
            onClick={handleLikePost}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 cursor-pointer group/btn ${
              isLiked 
                ? isDarkMode 
                  ? 'text-red-500 bg-red-900/20' 
                  : 'text-red-600 bg-red-100'
                : isDarkMode 
                  ? 'text-gray-500 hover:text-red-500 hover:bg-red-900/20' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
            }`}
            title="Like this post"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transition-transform group-hover/btn:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 cursor-pointer group/btn ${
              isDarkMode
                ? 'text-gray-500 hover:text-red-500 hover:bg-red-900/20'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
            }`}
            title="View comments"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 transition-transform group-hover/btn:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>

        {/* 5. Comment Section - Elegant expandable area */}
        {showComments && (
          <div className={`pt-4 relative z-10 ${
            isDarkMode ? 'border-t border-gray-800/50' : 'border-t border-gray-300/50'
          } animate-fade-in-down`}>
            <div className={`space-y-3 mb-4 max-h-64 overflow-y-auto pr-3 ${
              isDarkMode ? 'scrollbar-thin scrollbar-thumb-gray-700' : 'scrollbar-thin scrollbar-thumb-gray-400'
            }`}>
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <CommentItem
                    key={comment.id || idx}
                    comment={comment}
                    currentUser={currentUser}
                    token={token}
                  />
                ))
              ) : (
                <p className={`text-sm text-center py-3 italic ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Be the first to comment!
                </p>
              )}
            </div>

            {/* ⭐️ Comment input form - Elegant styling */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                className={`flex-1 border-2 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-0 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:bg-gray-800'
                    : 'bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-red-500 focus:bg-white'
                }`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || commentLoading}
                className={`bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 cursor-pointer font-semibold shadow-md hover:shadow-lg`}
                title="Send comment"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  
  );
};

function PostContainer({ categoryId, selectedHashtag, refreshKey, onTrendingRefresh }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = useUserStore((state) => state.categories);
  const getCategories = useUserStore((state) => state.getCategories);
  const isDarkMode = useUserStore((state) => state.isDarkMode);



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
    } finally {
      setLoading(false);
    }
  };

  // ⭐️ [UPDATE] Dependency Array ต้องรวม selectedHashtag
  useEffect(() => {
    fetchPosts();
  }, [categoryId, selectedHashtag,refreshKey]);

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
    try {
      await axios.delete(`${siteConfig.SERVER_URL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      if (onTrendingRefresh) {
          onTrendingRefresh();
      }
      toast.success("Delete post successfully");
      // ⭐️ ควรเพิ่ม signalPostUpdate() เพื่ออัปเดต Trending
    } catch (err) {
      toast.error(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  // ⭐️ [UPDATE] Logic การหาชื่อ Category และ Header
  const categoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name || "Loading..."
    : "All Posts";

  const displayHeader = selectedHashtag
    ? `Posts containing: ${selectedHashtag}` // แสดง Hashtag ถ้าถูกเลือก
    : categoryId
    ? loading
      ? `Posts : ${categoryName} (Loading...)`
      : `Posts : ${categoryName}`
    : `Posts : All`;

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen gap-4 rounded-lg bg-transparent">
      {/* <h3 className="text-xl font-bold text-white mt-4 mb-4 border-b border-gray-700 pb-2">
        รายการโพสต์ {categoryId ? "(กรองตามหมวดหมู่)" : "(ทั้งหมด)"}
      </h3> */}

      <div className="space-y-0">
        {loading ? (
          <p
            className={`text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            กำลังโหลด...
          </p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <PostDisplay
              key={post.id}
              post={post}
              
              onDelete={handleDeletePost}
              index={index}
              currentUser={user}
              token={token}
            />
          ))
        ) : (
          <p
            className={`text-center py-10 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            ยังไม่มีโพสต์ในหมวดหมู่นี้
          </p>
        )}
      </div>
    </div>
  );
}

export default PostContainer;

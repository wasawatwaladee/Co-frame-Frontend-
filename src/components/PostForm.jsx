import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from "../stores/Store";
import { toast } from "react-toastify";
import { siteConfig } from "../constant/config";
import { Send, Image as ImageIcon, Tag, X, FileText } from 'lucide-react'; // 💡 เพิ่ม FileText icon

function PostForm({ onPostCreated, onClose ,onPostRefresh, onTrendingRefresh}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  // 💡 MARK: NEW STATE สำหรับ File Upload
  const [selectedFile, setSelectedFile] = useState(null); 
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // เก็บ URL หลังอัปโหลด (ใช้ส่ง Post)

  const token = useUserStore((state) => state.token);
  const isDarkMode = useUserStore((state) => state.isDarkMode);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);


  //   try {
  //     setLoading(true);
  //     let url = `${siteConfig.SERVER_URL}/api/post`;
  //     const params = {};

  //     if (categoryId) {
  //       params.categoryId = categoryId;
  //     }

  //     // ⭐️⭐️ [ADD] เพิ่ม Hashtag ใน Query Parameter ถ้ามี
  //     if (selectedHashtag) {
  //       // ส่ง Hashtag ไปยัง Backend โดยลบ '#' ออก (Backend ควรรับเฉพาะคำ)
  //       params.hashtag = selectedHashtag.substring(1);
  //     }

  //     const res = await axios.get(url, { params: params });
  //     setPosts(res.data.posts);
  //   } catch (err) {
  //     console.error("Error fetching posts:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${siteConfig.SERVER_URL}/api/categories`);
        setCategories(res.data.categories);
        // Set default category to the first one found
        if (res.data.categories.length > 0) {
          setCategoryId(String(res.data.categories[0].id));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // 💡 MARK: NEW FUNCTION: อัปโหลดไฟล์ไปที่ Server
  const uploadFileToStorage = async (file) => {
    const formData = new FormData();
    formData.append("file", file); // 'file' คือชื่อ field ที่ Backend คาดหวัง
    
    try {
      // 💡 เรียก Backend API สำหรับอัปโหลด: /api/upload/image
      const uploadRes = await axios.post(
        `${siteConfig.SERVER_URL}/api/upload/image`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` 
          },
        }
      );
      // Backend ควรตอบกลับมาเป็น { url: '...' }
      return uploadRes.data.url; 
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("Cannot upload image.");
    }
  };

  // 💡 MARK: NEW HANDLER: จัดการเมื่อเลือกไฟล์
  const hdlFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file (e.g., JPEG, PNG).");
        setSelectedFile(null);
        e.target.value = null; // Clear input
        return;
      }
      setSelectedFile(file);
    }
  };

  // 2. ฟังก์ชัน Submit Form (แก้ไข Logic)
  const hdlCreatePost = async (e) => {
    e.preventDefault();

    if ( !content.trim() || !categoryId) {
      return toast.warn("กรุณากรอกเนื้อหา และเลือกหมวดหมู่ให้ครบถ้วน");
    }

    try {
      setLoading(true);
      let finalImageUrl = "";

      // 💡 MARK: Step A: อัปโหลดไฟล์ก่อนถ้ามี
      if (selectedFile) {
        toast.info("Uploading image...");
        finalImageUrl = await uploadFileToStorage(selectedFile);
        setUploadedImageUrl(finalImageUrl);
      }

      // 💡 MARK: Step B: ยิง API สร้าง Post โดยใช้ URL ที่ได้
      const response = await axios.post(
        `${siteConfig.SERVER_URL}/api/post`,
        {
          title: title.trim(),
          content: content.trim(),
          categoryId: Number(categoryId),
          thumbnail: finalImageUrl, // ใช้ URL ที่ได้จากการอัปโหลด
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear form
      setTitle("");
      setContent("");
      setSelectedFile(null); // Clear selected file
      setUploadedImageUrl(""); // Clear URL
      
      if (categories.length > 0) {
        setCategoryId(String(categories[0].id));
      }

      if (onPostCreated) {
        onPostCreated(response.data.result);
      }
      
      if (onClose) {
        onClose();
      }
     // 🔥 MARK 9: CALL REFRESH TRIGGERS
      if (onPostRefresh) {
         onPostRefresh(); 
      }
      if (onTrendingRefresh) { // ถ้ามี Trending Hashtag ใน Post อาจจะต้องอัปเดต Sidebar ด้วย
         onTrendingRefresh(); 
      }
      toast.success("สร้างโพสต์สำเร็จ! 🎉");
    } catch (error) {
      // ตรวจสอบว่าเป็น Error จากการอัปโหลดไฟล์หรือไม่
      const errorMessage = error.message.includes("Cannot upload image") 
                         ? error.message
                         : (error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างโพสต์");
                         
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const isFormValid = content.trim() && categoryId;
  const isImageSelected = selectedFile !== null;

  return (
    <div className={`rounded-xl shadow-2xl overflow-hidden transition-all duration-300 max-w-lg w-full mx-auto 
      ${isDarkMode 
        ? 'bg-gray-800 border border-gray-700 text-white' 
        : 'bg-white border border-gray-200 text-gray-900'
      }`}>
      
      {/* Header (Modal Style) */}
      <div className={`flex items-center justify-between p-4 border-b 
        ${isDarkMode 
          ? 'border-gray-700 bg-gray-900/50' 
          : 'border-gray-200 bg-gray-50'
        }`}>
        <h3 className={`text-lg font-bold ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          Create Post
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
            }`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={hdlCreatePost} className="p-4 space-y-4">

        {/* Content Textarea (Main body) */}
        <div className="relative">
          <label htmlFor="content" className="sr-only">Content</label>
          <textarea
            id="content"
            rows="5"
            className={`w-full p-3 rounded-lg text-sm transition-all duration-300 border-2 focus:ring-2 focus:ring-offset-0 outline-none resize-none 
              ${isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:border-red-600 focus:ring-red-600/20'
              }`}
            placeholder="What's happening? (required)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        {/* 💡 MARK: File Display: แสดงชื่อไฟล์ที่เลือก */}
        {selectedFile && (
          <div className={`flex items-center text-sm p-2 rounded-lg 
            ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <FileText className="w-4 h-4 mr-2 text-red-500" />
            Selected Image: <strong>{selectedFile.name}</strong> 
            <button 
                type="button" 
                onClick={() => setSelectedFile(null)}
                className={`ml-auto p-1 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                aria-label="Remove image"
            >
                <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Media/Category Row (Action bar style) */}
        <div className={`flex justify-between items-center py-2 border-t 
          ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>

          {/* Left Side: Actions (Image, Category) */}
          <div className="flex items-center space-x-3">
            
            {/* 💡 MARK: File Input: ปุ่มไอคอนรูปภาพที่เชื่อมโยงกับ Input Type File */}
            <label htmlFor="file-upload" className={`p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer 
              ${isDarkMode 
                ? 'text-green-400 hover:bg-gray-700' 
                : 'text-green-600 hover:bg-gray-100'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={hdlFileChange}
                className="hidden" // ซ่อน input เดิม
              />
            </label>
            
            {/* Category Select (Styled to look more like a tag/action) */}
            <div className="relative">
              <Tag className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none 
                ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <select
                className={`pl-10 pr-4 py-2 rounded-full font-medium text-xs appearance-none transition-colors border-2 cursor-pointer 
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-red-500 hover:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-red-600 hover:bg-gray-100'
                  }`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Right Side: Submit Button */}
          <button
            type="submit"
            className={`py-2 px-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 
              flex items-center gap-1.5 justify-center 
              ${isFormValid && !loading
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30 transform hover:scale-[1.03] active:scale-[0.98]'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed disabled:shadow-none'
              }`}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <span className="animate-spin">
                  <Send className="w-4 h-4" />
                </span>
                <span className="text-xs">{isImageSelected ? 'Uploading & Posting...' : 'Posting...'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="text-sm">Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
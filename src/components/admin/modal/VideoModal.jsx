
// VideoModal.jsx
import React, { useState, useEffect } from "react"; 
import { toast } from "react-toastify";
import { X } from "lucide-react";


export default function VideoModal({ isOpen, onClose, videoData, onSubmit ,categories=[]}) {
  console.log('categories from Modal', categories )

  
  if (!isOpen) return null;

  const isEditMode = !!videoData;

 
  
  // ⭐️⭐️ State สำหรับ Form Data: ควบคุม Input ⭐️⭐️
  const [formData, setFormData] = useState({
      title: videoData?.title || "",
      description: videoData?.description || "",
      videoUrl: videoData?.videoUrl || "",
      thumbnail: videoData?.thumbnail ||  videoData?.poster || "",
      // ใช้ categoryId?.toString() เพื่อให้ตรงกับ value ของ select
      categoryId: videoData?.categoryId?.toString() || "", 
      // duration มาเป็น Number ใน DB ต้องแปลงเป็น String ใน Form
      duration: videoData?.duration?.toString() || "", 
      poster: videoData?.poster || "",
  });

  // ⭐️⭐️ Sync ข้อมูลเมื่อ Modal เปิด/เปลี่ยนโหมด ⭐️⭐️
  useEffect(() => {


    // รีเซ็ตฟอร์มเมื่อ Modal เปิด/เปลี่ยน videoData
    if (isOpen) {
        setFormData({
            title: videoData?.title || "",
            description: videoData?.description || "",
            videoUrl: videoData?.videoUrl || "",
            thumbnail: videoData?.thumbnail || "",
            categoryId: videoData?.categoryId?.toString() || "1",
            duration: videoData?.duration?.toString() || "",
            poster: videoData?.poster  || "",
        });
    }
  }, [videoData, isOpen]);
  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      toast.success("Upload successfully")
      // ส่ง ID (ถ้ามี) และ Form Data กลับไปที่ VideoManager เพื่อยิง API
      onSubmit(isEditMode ? videoData.id : null, formData, isEditMode); 
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1a1a] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-gray-100 dark:to-gray-800/50 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Video" : "Add New Video"}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Video Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g., The Matrix"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              rows="3" name="description" value={formData.description} onChange={handleChange}
              placeholder="Enter video description..."
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-all"
            ></textarea>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Video URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
              placeholder="https://example.com/movie.mp4"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Poster URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Poster URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="poster" value={formData.poster} onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId" value={formData.categoryId} onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="1">Action</option>
                <option value="2">Comedy</option>
                <option value="3">Drama</option>
                <option value="4">Horror</option>
                <option value="5">Sci-Fi</option>
                <option value="6">Romance</option>
                <option value="7">Thriller</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="duration" value={formData.duration} onChange={handleChange}
                placeholder="120"
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-white/10 flex items-center gap-3 bg-gray-50 dark:bg-gray-900/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg shadow-red-900/30 cursor-pointer"
          >
            {isEditMode ? "Save Changes" : "Add Video"}
          </button>
        </div>
      </form>
    </div>
  );
}


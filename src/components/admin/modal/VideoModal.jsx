
// VideoModal.jsx
import React, { useState, useEffect } from "react"; 
import { toast } from "react-toastify";


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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอใหม่"}
          </h3>
          <button type="button" onClick={onClose} className="text-textMuted hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* ชื่อวิดีโอ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">ชื่อวิดีโอ</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* คำอธิบาย */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">คำอธิบาย</label>
            <textarea
              rows="3" name="description" value={formData.description} onChange={handleChange}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            ></textarea>
          </div>

          {/* URL วิดีโอ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">URL วิดีโอ</label>
            <input
              type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
              placeholder="https://example.com/movie.mp4"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* URL รูปภาพปก */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">URL รูปภาพปก</label>
            <input
              type="text" name="poster" value={formData.poster} onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* หมวดหมู่ */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">หมวดหมู่</label>
              <div className="relative z-10">
                <select
                  name="categoryId" value={formData.categoryId} onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {/* <option value="" key="default-cat-select">เลือกหมวดหมู่</option>
                  {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                      </option>
                  ))} */}
                       <option value="1">Action</option>
                      <option value="2">Comedy</option>
                      <option value="3">Drama</option>
                      <option value="4">Horror</option>
                      <option value="5">Sci-Fi</option>
                      <option value="6">Romance</option>
                      <option value="7">Thriller</option>
                 
                
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-textMuted absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
              </div>
            </div>

            {/* ระยะเวลา */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">ระยะเวลา (นาที)</label>
              <input
                type="text" name="duration" value={formData.duration} onChange={handleChange}
                placeholder="... (นาที)"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* วันที่อัพโหลด (ไม่จำเป็นต้องใช้ใน Form นี้) */}
          {/* ... (ส่วนวันที่อัพโหลดเดิม) ... */}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex items-center gap-3 bg-[#151515] shrink-0">
          <button type="submit" className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/20">
            {isEditMode ? "บันทึกการแก้ไข" : "เพิ่มวิดีโอ"}
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 rounded-lg transition-colors border border-white/5">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}


// export default function EditVideoModal({ isOpen, onClose, videoData }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
//       {/* Container */}
//       <div className="bg-[#1a1a1a] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
//         {/* Header: ระบุชัดเจนว่าเป็น "แก้ไข" */}
//         <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg text-primary">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-white">แก้ไขวิดีโอ</h3>
//           </div>

//           <button
//             onClick={onClose}
//             className="text-textMuted hover:text-white transition-colors"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Form Content */}
//         <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
//           {/* ชื่อวิดีโอ */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-textSecondary">
//               ชื่อวิดีโอ
//             </label>
//             <input
//               type="text"
//               defaultValue={videoData?.title} // ใส่ข้อมูลเดิม
//               className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
//             />
//           </div>

//           {/* คำอธิบาย */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-textSecondary">
//               คำอธิบาย
//             </label>
//             <textarea
//               rows="3"
//               defaultValue={videoData?.desc}
//               className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
//             ></textarea>
//           </div>

//           {/* URL วิดีโอ */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-textSecondary">
//               URL วิดีโอ
//             </label>
//             <input
//               type="text"
//               defaultValue={
//                 videoData?.videoUrl || "https://example.com/movie.mp4"
//               }
//               className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
//             />
//           </div>

//           {/* URL ปก */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-textSecondary">
//               URL รูปภาพปก
//             </label>
//             <div className="flex gap-4 items-start">
//               <input
//                 type="text"
//                 defaultValue={videoData?.thumbnail}
//                 className="flex-1 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
//               />
//               {/* Preview รูปเล็กๆ ถ้ามี */}
//               {videoData?.poster && (
//                 <img
//                   src={videoData.poster}
//                   alt="Preview"
//                   className="w-16 h-12 object-cover rounded bg-black border border-white/10"
//                 />
//               )}
//             </div>
//           </div>

//           {/* หมวดหมู่ & เวลา */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-textSecondary">
//                 หมวดหมู่
//               </label>
//               <div className="relative">
//                 <select
//                   defaultValue={videoData?.tag}
//                   className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
//                 >
//                   <option value="">เลือกหมวดหมู่</option>
//                   <option value="แอคชั่น">Action</option>
//                   <option value="ดราม่า">Drama</option>
//                   <option value="ไซไฟ">Sci-Fi</option>
//                   <option value="โรแมนติก">Romance</option>
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="text-sm font-medium text-textSecondary">
//                 ระยะเวลา
//               </label>
//               <input
//                 type="text"
//                 defaultValue={videoData?.duration}
//                 className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
//               />
//             </div>
//           </div>

//           {/* วันที่ */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-textSecondary">
//               วันที่อัพโหลด
//             </label>
//             <input
//               type="date"
//               defaultValue={videoData?.date}
//               className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors [&::-webkit-calendar-picker-indicator]:invert"
//             />
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="p-6 border-t border-white/10 flex items-center gap-3 bg-[#151515] shrink-0">
//           <button className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/20">
//             บันทึกการแก้ไข
//           </button>
//           <button
//             onClick={onClose}
//             className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 rounded-lg transition-colors border border-white/5"
//           >
//             ยกเลิก
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// EditVideoModal.jsx (โค้ดที่ต้องนำไปวางแทนไฟล์เดิม)

import React, { useState, useEffect } from "react"; 

// ⭐️⭐️ รับ onSubmit และ categories เข้ามา ⭐️⭐️
export default function EditVideoModal({ isOpen, onClose, videoData, onSubmit, categories=[] }) {
  if (!isOpen) return null;

  // ⭐️⭐️ State สำหรับ Form Data (Controlled Component) ⭐️⭐️
  const [formData, setFormData] = useState({
      title: videoData?.title || "",
      description: videoData?.description || "",
      videoUrl: videoData?.videoUrl || "",
      thumbnail: videoData?.thumbnail || videoData?.poster || "", // ใช้ thumbnail เป็นหลัก
      categoryId: videoData?.categoryId?.toString() || "", 
      duration: videoData?.duration?.toString() || "", 
      poster: videoData?.poster || "", // ฟิลด์สำหรับ poster
  });

  // ⭐️⭐️ Sync ข้อมูลเมื่อ Modal เปิด/เปลี่ยน videoData ⭐️⭐️
  useEffect(() => {
    // โหมด Edit ต้องมี videoData
    if (isOpen && videoData) {
        setFormData({
            title: videoData.title || "",
            description: videoData.description || "", // ⭐️ Note: โค้ดเดิมใช้ videoData?.desc ซึ่งอาจผิด
            videoUrl: videoData.videoUrl || "",
            thumbnail: videoData.thumbnail || "",
            categoryId: videoData.categoryId?.toString() || "",
            duration: videoData.duration?.toString() || "",
            poster: videoData.poster || videoData.thumbnail || "",
        });
    }
  }, [videoData, isOpen]);
  
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      
      // ⭐️⭐️ Logic Submit: ส่ง videoData.id, formData, และ isEditMode=true ⭐️⭐️
      // ใช้ onSubmit จาก VideoManager
      if (videoData?.id) {
          onSubmit(videoData.id, formData, true); 
          onClose();
      }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      {/* ⭐️⭐️ ห่อด้วย <form onSubmit={handleSubmit}> ⭐️⭐️ */}
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] w-full max-w-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">{/* SVG เดิม */}</div>
            <h3 className="text-xl font-bold text-white">แก้ไขวิดีโอ: {videoData?.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-textMuted hover:text-white transition-colors">{/* SVG เดิม */}</button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          {/* ชื่อวิดีโอ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">ชื่อวิดีโอ</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"/>
          </div>

          {/* คำอธิบาย */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">คำอธิบาย</label>
            <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"></textarea>
          </div>

          {/* URL วิดีโอ */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">URL วิดีโอ</label>
            <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://example.com/movie.mp4" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"/>
          </div>

          {/* URL ปก (Poster / Thumbnail) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">URL รูปภาพปก (Thumbnail)</label>
            <div className="flex gap-4 items-start">
              <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://example.com/image.jpg" className="flex-1 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"/>
              {videoData?.thumbnail && (<img src={videoData.thumbnail} alt="Preview" className="w-16 h-12 object-cover rounded bg-black border border-white/10"/>)}
            </div>
            <input type="hidden" name="poster" value={formData.poster} /> {/* Poster field (hidden) */}
          </div>

          {/* หมวดหมู่ & เวลา */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">หมวดหมู่</label>
              <div className="relative">
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer">
                  {/* <option value="">เลือกหมวดหมู่</option>
                  {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                  ))} */}
                    <option value="1">Action</option>
                      <option value="2">Comedy</option>
                      <option value="3">Drama</option>
                      <option value="4">Horror</option>
                      <option value="5">Sci-Fi</option>
                      <option value="6">Romance</option>
                      <option value="7">Thriller</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-textSecondary">ระยะเวลา (วินาที)</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"/>
            </div>
          </div>
          {/* ... (วันที่ เดิม) ... */}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 flex items-center gap-3 bg-[#151515] shrink-0">
          <button type="submit" className="flex-1 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-red-900/20">
            บันทึกการแก้ไข
          </button>
          <button type="button" onClick={onClose} className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-3 rounded-lg transition-colors border border-white/5">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}


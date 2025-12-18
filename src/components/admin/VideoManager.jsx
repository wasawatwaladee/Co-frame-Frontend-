import React, { useEffect, useState } from "react";
// Import Modals ทั้ง 3 ตัว (ตรวจสอบ path ให้ตรงกับโฟลเดอร์ของคุณนะครับ)
import VideoModal from "../admin/modal/VideoModal";
import EditVideoModal from "../admin/modal/EditVideoModal";
import DeleteVideoModal from "../admin/modal/DeleteVideoModal";
import useUserStore from "../../stores/Store";
import  authApi  from "../../api/api";




export default function VideoManager() {
  // --- State Management ---
  // ใช้ modalType เพื่อระบุว่าจะเปิด Modal ไหน ('add', 'edit', 'delete' หรือ null เพื่อปิด)
  const [modalType, setModalType] = useState(null);
  // ใช้ selectedVideo เพื่อส่งข้อมูลหนังที่เลือกไปยัง Modal (Edit/Delete)
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');


  const movies = useUserStore((state) => state.movies);
  const categories = useUserStore((state) => state.categories);
const getMovies = useUserStore((state) => state.getMovies);
const getCategories = useUserStore((state) => state.getCategories);


useEffect(()=>{
 
  
  getMovies();
  
  getCategories()
},[])

console.log('movies from Manager', movies )
console.log('categories from Manager', categories )
// console.log('MovieList', moviesList )
  // --- Handlers ---
  const handleOpenAdd = () => {
    setSelectedVideo(null);
    setModalType("add");
  };

  const handleOpenEdit = (video) => {
    setSelectedVideo(video);
    setModalType("edit");
  };

  const handleOpenDelete = (video) => {
    setSelectedVideo(video);
    setModalType("delete");
  };

  const handleClose = () => {
    setModalType(null);
    setSelectedVideo(null);
  };

  const handleSubmitVideo = async (id, data, isEditMode) => {
    try {
        if (isEditMode) {
            // 1. โหมดแก้ไข (Update)
            await authApi.put(`/movies/${id}`, data); 
            console.log("Video Updated:", id);
        } else {
          console.log('data', data)
            // 2. โหมดเพิ่ม (Add)
            await authApi.post('/movies', data);
            console.log("Video Added:", data.title);
        }
        
        // หลังจากเสร็จสิ้น: ปิด Modal และโหลดรายการหนังใหม่
        getMovies();
        handleClose();
        
    } catch (error) {
        console.error("Submit Error:", error.response?.data || error.message);
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Video Management</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage and organize all videos in your platform</p>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          {/* Add Video Button */}
          <button
            onClick={handleOpenAdd}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shrink-0 shadow-md hover:shadow-lg cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Video
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="space-y-3">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No videos found</p>
          </div>
        ) : (
          filteredMovies.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center group hover:shadow-md dark:hover:bg-[#252525] transition-all border border-gray-200 dark:border-transparent dark:hover:border-white/5"
            >
              {/* Thumbnail */}
              <div className="w-full md:w-48 h-28 shrink-0 relative rounded-lg overflow-hidden bg-gray-200 dark:bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Info */}
              <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {video.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">{video.description}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-gray-500 dark:text-gray-400">
                 {video.category && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-md border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium">
                        {video.category.name} 
                      </span>
                  )}
                  <span>•</span> 
                 <span>{video.duration} </span> 
                  <span>•</span>
                  <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(video)}
                  className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleOpenDelete(video)}
                  className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- RENDER MODALS --- */}

      {/* 1. Modal เพิ่มวิดีโอ (VideoModal) */}
      <VideoModal isOpen={modalType === "add"} onClose={handleClose} videoData={selectedVideo} categories={categories} onSubmit={handleSubmitVideo}/>

      {/* 2. Modal แก้ไขวิดีโอ (EditVideoModal) */}
      <EditVideoModal
        isOpen={modalType === "edit"}
        onClose={handleClose}
        videoData={selectedVideo} // ส่งข้อมูลหนังไปให้ Form
        onSubmit={handleSubmitVideo}
      />

      {/* 3. Modal ลบวิดีโอ (DeleteVideoModal) */}
      <DeleteVideoModal
        isOpen={modalType === "delete"}
        onClose={handleClose}
        videoData={selectedVideo} // ส่งข้อมูลหนังไปเพื่อแสดงชื่อหนังที่จะลบ
        getMovies={getMovies}
      />
    </div>
  );
}

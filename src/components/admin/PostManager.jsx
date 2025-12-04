import React from 'react';
import { Trash2 } from 'lucide-react'; // Assuming you use lucide-react or a similar icon library for the trash icon

const PostManager = ({ title, description, author, views, comments, isDraft = false }) => {
  return (
    <div className="bg-gray-800 p-4 mb-3 rounded-lg flex justify-between items-start hover:bg-gray-700 transition duration-150 ease-in-out">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          {/* Title and Action Button Container */}
          <span className="text-white font-medium text-lg">{title}</span>
          
          {/* Status Badge - Draft (if applicable) - Status badges are kept but without color */}
          {isDraft && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-500 text-white">
              แบบร่าง
            </span>
          )}

          {/* Action Button - Always present */}
          <button className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150">
            Action
          </button>
        </div>
        
        {/* Description/Subtitle */}
        <p className="text-gray-400 text-sm mt-1">{description}</p>
        
        {/* Metadata (Author, Date, Views, Comments) */}
        <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
          <span>โดย **{author}**</span>
          <span>&bull;</span>
          <span>2025-12-03</span>
          <span>&bull;</span>
          <span>{views}</span>
          <span>&bull;</span>
          <span>{comments}</span>
        </div>
      </div>

      {/* Delete Icon */}
      <button className="text-gray-400 hover:text-red-500 p-2 rounded-full transition duration-150">
        <Trash2 size={20} />
      </button>
    </div>
  );
};

const DownloadList = () => {
  const downloads = [
    {
      id: 1,
      title: 'ไม่กล้าทำร้าย คนคว้าดี',
      description: 'ป้องกัน โดนตีผีหลอก',
      author: 'NIE888',
      views: '1250',
      comments: '45',
      isDraft: false,
    },
    {
      id: 2,
      title: 'test2',
      description: 'test2',
      author: 'NIE888',
      views: '980',
      comments: '32',
      isDraft: false,
    },
    {
      id: 3,
      title: 'test1',
      description: 'test1',
      author: 'NIE888',
      views: '750',
      comments: '28',
      isDraft: true,
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-5">
      {/* Header and Search Bar (Simplified) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">จัดการโหลด</h2>
        <input 
          type="text" 
          placeholder="ค้นหาโหลด..." 
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Navigation Tabs (Simplified) */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-6">
          {['จัดการวิดีโอ', 'จัดการผู้ใช้', 'จัดการโหลด', 'จัดการคอมเมนต์', 'จัดการหมวดหมู่'].map((item, index) => (
            <button
              key={item}
              className={`pb-3 text-sm font-medium ${
                item === 'จัดการโหลด'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Download List */}
      <div>
        {downloads.map((item) => (
          <DownloadItem
            key={item.id}
            title={item.title}
            description={item.description}
            author={item.author}
            views={item.views}
            comments={item.comments}
            isDraft={item.isDraft}
          />
        ))}
      </div>
    </div>
  );
};

export default PostManager;
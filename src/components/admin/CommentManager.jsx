import React from 'react';
import { Trash2 } from 'lucide-react'; // Assuming lucide-react or similar icon library

// Component for an individual comment item
const CommentItem = ({ username, status, postTitle, content, date, time }) => {
  // Styles the status badge without colorful backgrounds (only text/border)
  const statusClasses = status === 'Approved'
    ? 'text-green-400 border border-green-400' // Green text, light green border
    : 'text-yellow-400 border border-yellow-400'; // Yellow text, light yellow border

  return (
    <div className="bg-gray-800 p-4 mb-3 rounded-lg flex justify-between items-start hover:bg-gray-700 transition duration-150 ease-in-out">
      <div className="flex flex-col w-full">
        <div className="flex items-center space-x-3 mb-2">
          {/* Username */}
          <span className="text-white font-semibold text-lg">{username}</span>
          
          {/* Status Badge (No background color) */}
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusClasses}`}>
            {status === 'Approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
          </span>
        </div>
        
        {/* Post Title */}
        <p className="text-gray-400 text-sm mb-2">
          โพสต์: <span className="text-white font-medium">{postTitle}</span>
        </p>

        {/* Comment Content */}
        <p className="text-white mb-3">{content}</p>
        
        {/* Date/Time */}
        <div className="text-xs text-gray-500">
          {date} {time}
        </div>
      </div>

      {/* Delete Icon */}
      <button className="text-gray-400 hover:text-red-500 p-2 rounded-full transition duration-150 flex-shrink-0">
        <Trash2 size={20} />
      </button>
    </div>
  );
};

// Main component for the comment management page
const CommentManager = () => {
  const comments = [
    {
      id: 1,
      username: 'User123',
      status: 'Approved',
      postTitle: 'ไม่กล้าทำร้าย คนคว้าดี',
      content: 'ขอบคุณสำหรับคำแนะนำดีๆครับ มีประโยชน์มากเลย',
      date: '2025-12-04',
      time: '10:30',
    },
    {
      id: 2,
      username: 'StreamerPro',
      status: 'Approved',
      postTitle: 'test2',
      content: 'เนื้อหาดีมาก แนะนำเลยครับ',
      date: '2025-12-04',
      time: '09:15',
    },
    {
      id: 3,
      username: 'NewStreamer',
      status: 'Pending',
      postTitle: 'test1',
      content: 'โพสต์นี้เยี่ยมมาก! มีประโยชน์กับมือใหม่อย่างผมมาก',
      date: '2025-12-04',
      time: '08:45',
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* --- Header, Stats, and Search --- */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-6">
            <h2 className="text-2xl font-bold text-white">จัดการคอมเมนต์</h2>
            
            {/* Stats Badges */}
            <div className="flex space-x-3 text-sm">
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full">
                รออนุมัติ: <strong className="font-bold text-yellow-400">1</strong>
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full">
                ถูกรายงาน: <strong className="font-bold text-red-400">1</strong>
              </span>
            </div>
          </div>
        </div>

        {/* --- Comment List --- */}
        <div>
          {comments.map((item) => (
            <CommentItem
              key={item.id}
              username={item.username}
              status={item.status}
              postTitle={item.postTitle}
              content={item.content}
              date={item.date}
              time={item.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentManager;
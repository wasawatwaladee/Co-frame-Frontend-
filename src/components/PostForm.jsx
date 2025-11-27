import React, { useState } from 'react'

function PostForm({ onPostCreated }) {

  const [message, setMessage] = useState(''); 

  const hdlCreatePost = () => {
        if (message.trim()) {
            
            onPostCreated(message.trim()); 
      
            setMessage(''); 
        } else {
            alert('กรุณากรอกข้อความก่อนโพสต์');
        }
    };

  return (
    <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Post</h3>
            <input 
                type="text" 
                className='text-black border p-3 rounded-lg w-full focus:ring-red-500 focus:border-red-500' 
                placeholder="คุณกำลังคิดอะไรอยู่?"
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
            />
            <button 
                onClick={hdlCreatePost} 
                className='bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition duration-200'
                disabled={!message.trim()} // ปิดใช้งานถ้าไม่มีข้อความ
            >
                Create Post
            </button>
        </div>
  )
}

export default PostForm
import React, { useState } from 'react'
import CreatePost from './CreatePost'
import PostForm from './PostForm';

const Modal = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-100">
            
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-2xl font-bold"
                >X</button>
                {children}
            </div>
        </div>
    );
};

const PostDisplay = ({ post, onDelete }) => (
    <div key={post.id} className="bg-gray-300 shadow-md rounded-xl p-4 border border-gray-200 relative">
        <div className="flex items-center mb-3">
            <div>
                <p className="font-semibold text-gray-800">{post.user}</p>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>

            <button
                onClick={() => onDelete(post.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-xl font-bold p-1 transition duration-150"
            >
                X
            </button>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{post.text}</p>
    </div>
);


function PostContainer() {
  const [posts, setPosts] = useState([
        { id: 1, user: 'Admin', text: 'ยินดีต้อนรับสู่หน้าโพสต์ของเรา!', timestamp: new Date().toLocaleString() }
    ]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = (message) => {
        const newPost = {
            id: Date.now(),
            user: 'Current User',
            text: message, 
            timestamp: new Date().toLocaleString()
        };

        setPosts([newPost, ...posts]); 
        closeModal(); 
    };

    const handleDeletePost = (postId) => {
        // กรองเอาโพสต์ที่มี ID ไม่ตรงกับ postId ออกไป
        setPosts(posts.filter(post => post.id !== postId));
    };

  return (
    <div className=' w-[680px] mx-auto min-h-screen flex flex-col gap-4 rounded-lg bg-transparent '>
        <CreatePost onOpenForm={openModal} />
        
        <h3 className=" text-xl font-bold text-white mt-4">รายการโพสต์</h3>
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostDisplay 
                    key={post.id} 
                    post={post}
                    onDelete={handleDeletePost} 
                    />
                ))}
            </div>
        
        <div className="text-white sticky"></div>
        
        {isModalOpen && (
                <Modal onClose={closeModal}>
                    <PostForm onPostCreated={handleCreatePost} />
                </Modal>
            )}
    </div>
  )
}

export default PostContainer
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

function PostContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className=' w-[680px] mx-auto mt-4 min-h-screen flex flex-col gap-4 rounded-lg bg-transparent '>
        <CreatePost onOpenForm={openModal} />
        <div className="text-white sticky"></div>
        {isModalOpen && (
                <Modal onClose={closeModal}>
                    <PostForm onPostCreated={closeModal} /> 
                </Modal>
            )}
    </div>
  )
}

export default PostContainer
import React from 'react'

function PostForm() {

  const hdlCreatePost = () => {
        onPostCreated(); 
    };

  return (
    <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Post</h3>
             <input type="text" />
            <button onClick={hdlCreatePost} className='text-black' >
                Create Post
            </button>
        </div>
  )
}

export default PostForm
import React, { useState } from 'react'
import PostForm from './PostForm'

function CreatePost({ onOpenForm }) {
  return (
    <button 
            className="
                fixed bottom-6 right-90 
                bg-red-600 text-white 
                w-14 h-14 rounded-full 
                flex items-center justify-center 
                shadow-xl hover:bg-red-700 
                transition duration-300 
                z-50 
            "
            onClick={onOpenForm} 
            aria-label="Create new post"
        >+</button>
  )
}

export default CreatePost
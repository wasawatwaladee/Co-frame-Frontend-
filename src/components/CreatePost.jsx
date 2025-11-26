import React, { useState } from 'react'
import PostForm from './PostForm'

function CreatePost({ onOpenForm }) {
  return (
    <div 
            className="w-full cursor-pointer p-4 bg-white shadow-lg rounded-xl hover:bg-gray-100 transition duration-150"
            onClick={onOpenForm} 
        >
            <span className="font-semibold text-gray-700">
                คลิกเพื่อสร้างโพสต์ใหม่...
            </span>
        </div>
  )
}

export default CreatePost
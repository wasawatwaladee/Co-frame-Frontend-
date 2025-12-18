// DeleteUserModal.jsx
import React from "react";

export default function DeleteUserModal({ isOpen, onClose, user, onDeleteUser }) {
  if (!isOpen || !user) return null;

  const handleSubmitDelete = () => {
    onDeleteUser(user.id); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl p-8 text-center">
        
        {/* Warning Icon (SVG) */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600 dark:text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          Delete User?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete <br />
          <span className="text-gray-900 dark:text-white font-semibold">
            "{user.firstName || user.email}"
          </span>
          <br />
          This action cannot be undone.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium py-2.5 rounded-lg transition-all border border-gray-300 dark:border-gray-700 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmitDelete} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
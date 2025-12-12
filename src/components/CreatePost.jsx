
// function CreatePost({ onOpenForm }) {
//   return (
//     <button 
//             className="
//                 fixed bottom-6 right-90 
//                 bg-red-600 text-white 
//                 w-14 h-14 rounded-full 
//                 flex items-center justify-center 
//                 shadow-xl hover:bg-red-700 
//                 transition duration-300 
//                 z-50 
//             "
//             onClick={onOpenForm} 
//             aria-label="Create new post"
//         >+</button>
//   )
// }

// export default CreatePost

// CreatePost Component - Full clickable create post container
// Props:
//   - onOpenForm: callback function to open the post form modal
//   - isDarkMode: boolean to determine dark/light theme styling
function CreatePost({ onOpenForm, isDarkMode }) {
  return (
    // Main container button - covers entire create post area
    // onClick triggers onOpenForm callback to show PostForm modal
    <button 
      onClick={onOpenForm}
      className="w-full p-6 border-b transition-colors duration-300 text-left cursor-pointer"
      style={{
        borderColor: isDarkMode ? '#1f2937' : '#e5e7eb'
      }}
    >
      {/* Inner card wrapper - provides rounded background and shadow effects */}
      <div
        className={`flex items-start gap-4 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
          isDarkMode ? "bg-gray-900/70 hover:bg-gray-900/90" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {/* Profile Avatar Icon Container */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          {/* User profile SVG icon */}
          <svg
            className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Main content area - input and action buttons */}
        <div className="flex-1">
          {/* Input field - placeholder text for creating post */}
          {/* readOnly and pointer-events-none prevent direct input */}
          {/* All interactions trigger parent button onClick */}
          <input
            type="text"
            placeholder="What movie is on your mind?"
            className={`w-full bg-transparent border-0 outline-none text-base cursor-pointer pointer-events-none ${
              isDarkMode
                ? "text-white placeholder-gray-500"
                : "text-black placeholder-gray-400"
            }`}
            readOnly
          />
          {/* Action buttons row - contains media options and post button */}
          
        </div>
      </div>
    </button>
  )
}

export default CreatePost
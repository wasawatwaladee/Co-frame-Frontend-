
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
          <div className="flex items-center justify-between mt-3">
            {/* Media buttons container - Image, Video, Poll, Emoji */}
            <div className="flex items-center gap-3">
              {/* Add Image button - disabled (pointer-events-none) */}
              <button
                className={`p-2 rounded-lg transition-colors pointer-events-none ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
                title="Add Image"
              >
                {/* Image icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Add Video button - disabled (pointer-events-none) */}
              <button
                className={`p-2 rounded-lg transition-colors pointer-events-none ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
                title="Add Video"
              >
                {/* Video icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </button>
              {/* Add Poll button - disabled (pointer-events-none) */}
              <button
                className={`p-2 rounded-lg transition-colors pointer-events-none ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
                title="Add Poll"
              >
                {/* Poll/Chart icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </button>
              {/* Add Emoji button - disabled (pointer-events-none) */}
              <button
                className={`p-2 rounded-lg transition-colors pointer-events-none ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
                title="Add Emoji"
              >
                {/* Emoji/Smiley icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* Post button - disabled (pointer-events-none, all clicks go to parent button) */}
            <button className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors pointer-events-none">
              Post
            </button>
          </div>
        </div>
      </div>
    </button>
  )
}

export default CreatePost
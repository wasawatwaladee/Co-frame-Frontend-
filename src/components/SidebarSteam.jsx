// import React from 'react'

// function SidebarSteam({ onCategorySelect, activeCategory }) {

//   const categories = ['ALL','HORROR', 'COMEDY', 'SCI-FI', 'CARTOON'];


//   return (
//     <div className='fixed top-0 mt-20 left-0 h-[calc(100vh-80px)] w-64 p-4 overflow-y-auto bg-black text-white z-40'>
      
//       <div className="flex flex-col space-y-1 mt-4">
//         {categories.map((category) => (
//           <a
//             key={category}
//             href="#"

//             onClick={(e) => {
//               e.preventDefault();
//               onCategorySelect(category);
//             }}
//             className={`
//                             flex items-center p-2 rounded-lg transition duration-150 
//                             ${category === activeCategory
//                 ? 'bg-white text-black font-bold shadow-lg'
//                 : 'hover:bg-gray-800 text-gray-300'
//               }
//                         `}
//           >

//             <span className="ml-3">{category}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }


// export default SidebarSteam
import React from 'react';

function SidebarSteam({ onCategorySelect, activeCategory }) {
  const categories = ['ALL', 'HORROR', 'COMEDY', 'SCI-FI', 'CARTOON'];

  return (
    <div className="fixed top-0 mt-20 left-0 h-[calc(100vh-80px)] w-64 p-4 overflow-y-auto bg-black text-white z-40 shadow-xl border-r border-gray-800">

      <div className="flex flex-col space-y-2 mt-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`
              relative flex items-center p-3 rounded-lg text-left transition-all duration-200 group
              ${category === activeCategory
                ? 'bg-red-600 text-white font-semibold shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            {/* Left Accent Bar */}
            <span
              className={`
                absolute left-0 top-0 h-full w-1 rounded-r-md transition-all
                ${category === activeCategory ? 'bg-red-400' : 'bg-transparent group-hover:bg-gray-500'}
              `}
            />

            {/* Category Name */}
            <span className="ml-3 tracking-wide">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SidebarSteam;

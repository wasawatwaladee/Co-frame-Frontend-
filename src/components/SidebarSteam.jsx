import React from 'react'

function SidebarSteam({ onCategorySelect, activeCategory }) {

  const categories = ['ALL','HORROR', 'COMEDY', 'SCI-FI', 'CARTOON', 'braaaaa 1'];


  return (
    <div className='fixed top-0 mt-20 left-0 h-[calc(100vh-80px)] w-64 p-4 overflow-y-auto bg-black text-white z-40'>
      
      <div className="flex flex-col space-y-1 mt-4">
        {categories.map((category) => (
          <a
            key={category}
            href="#"

            onClick={(e) => {
              e.preventDefault();
              onCategorySelect(category);
            }}
            className={`
                            flex items-center p-2 rounded-lg transition duration-150 
                            ${category === activeCategory
                ? 'bg-white text-black font-bold shadow-lg'
                : 'hover:bg-gray-800 text-gray-300'
              }
                        `}
          >

            <span className="ml-3">{category}</span>
          </a>
        ))}
      </div>
    </div>
  );
}


export default SidebarSteam
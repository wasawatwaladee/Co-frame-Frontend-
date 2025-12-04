import React from 'react';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react'; // Icon library

// Component สำหรับการ์ดหมวดหมู่แต่ละใบ
const CategoryCard = ({ title, slug, description, downloadCount, accentColor }) => {
  // accentColor ใช้สำหรับจุดสีเล็ก ๆ และไอคอน (แทนการใช้สีสถานะ)
  // ตัวอย่างค่า accentColor: 'text-red-500', 'text-purple-500', 'text-gray-500', 'text-yellow-500'
  
  return (
    <div className="bg-gray-800 p-5 rounded-lg flex flex-col justify-between hover:bg-gray-700 transition duration-150 ease-in-out">
      
      {/* Header and Actions */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          {/* จุดสี/Accent Color */}
          <div className={`w-3 h-3 rounded-full ${accentColor.replace('text-', 'bg-')}`}></div>
          
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400 text-sm">{slug}</p>
          </div>
        </div>
        
        {/* Edit and Delete Icons */}
        <div className="flex space-x-3 text-gray-500">
          <button className="hover:text-blue-400 transition duration-150">
            <Edit2 size={16} />
          </button>
          <button className="hover:text-red-500 transition duration-150">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-gray-300 mb-6 flex-grow">{description}</p>
      
      {/* Footer / Stats */}
      <div className="border-t border-gray-700 pt-3">
        <span className="text-gray-400 text-sm">
          จำนวนโพสต์: <strong className="text-white">{downloadCount}</strong>
        </span>
      </div>
    </div>
  );
};

// Main component สำหรับหน้าจัดการหมวดหมู่
const CategoryManager = () => {
  const categories = [
    { title: 'Action', slug: '/action', description: 'หมวดหมู่สำหรับเนื้อหาแอ็กชัน ผจญภัย', downloadCount: 45, accentColor: 'text-red-500' },
    { title: 'Drama', slug: '/drama', description: 'หมวดหมู่สำหรับเนื้อหาดราม่า น่าติดตาม', downloadCount: 32, accentColor: 'text-purple-500' },
    { title: 'Horror', slug: '/horror', description: 'หมวดหมู่สำหรับเนื้อหาสยองขวัญ', downloadCount: 28, accentColor: 'text-gray-500' },
    { title: 'Comedy', slug: '/comedy', description: 'หมวดหมู่สำหรับเนื้อหาตลก สนุกสนาน', downloadCount: 56, accentColor: 'text-yellow-500' },
  ];

  return (
    <div className="bg-gray-900 min-h-screen p-6">

        {/* --- Header and Add Button --- */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">จัดการหมวดหมู่</h2>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-150">
            <Plus size={20} />
            <span>เพิ่มหมวดหมู่</span>
          </button>
        </div>

        {/* --- Category Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              slug={category.slug}
              description={category.description}
              downloadCount={category.downloadCount}
              accentColor={category.accentColor}
            />
          ))}
        </div>
      </div>
  );
};

export default CategoryManager;
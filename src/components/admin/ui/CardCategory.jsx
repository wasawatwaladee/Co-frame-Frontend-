import { Edit2, Trash2, Tag } from "lucide-react";

const CategoryCard = ({ category, onEdit, onDelete, colorIndex }) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const accentColor = colors[colorIndex % colors.length];

  const postCount = category.posts
    ? category.posts.length
    : category._count?.posts || 0;

  const displayName = category.name || category.title || "Unnamed";

  return (
    <div className="group bg-gray-800 p-5 rounded-xl flex flex-col justify-between hover:bg-gray-750 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-black/20">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          {/* Dot Color */}
          <div className="relative shrink-0">
            <div
              className={`w-3 h-3 rounded-full ${accentColor} relative z-10`}
            ></div>
            <div
              className={`absolute inset-0 w-3 h-3 rounded-full ${accentColor} blur-sm opacity-50`}
            ></div>
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors truncate">
              {displayName}
            </h3>
            {/* แสดง Slug */}
            <span className="text-gray-500 text-xs font-mono bg-gray-900/50 px-1.5 py-0.5 rounded w-fit truncate">
              /{category.slug || "-"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 grow">
        <p className="text-gray-400 text-sm line-clamp-2 min-h-10">
          {category.description || "ไม่มีรายละเอียด"}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700/50 pt-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gray-700/50 px-2 py-1 rounded text-xs text-gray-400 flex items-center gap-1">
            <Tag size={10} /> Post
          </div>
          <span className="text-white font-bold text-sm">{postCount}</span>
        </div>
        <span className="text-xs text-gray-600">ID: {category.id}</span>
      </div>
    </div>
  );
};

export default CategoryCard;

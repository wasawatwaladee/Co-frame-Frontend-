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
    <div className="group bg-white border border-gray-200 p-5 rounded-lg flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 ease-in-out">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          {/* Dot Color */}
          <div className="relative shrink-0">
            <div
              className={`w-3 h-3 rounded-full ${accentColor}`}
            ></div>
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {displayName}
            </h3>
            {/* Slug */}
            <span className="text-gray-500 text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-1 w-fit truncate">
              /{category.slug || "-"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 grow">
        <p className="text-gray-600 text-sm line-clamp-2 min-h-10">
          {category.description || "No description"}
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 flex items-center gap-1">
            <Tag size={12} /> Posts
          </div>
          <span className="text-gray-900 font-bold text-sm">{postCount}</span>
        </div>
        <span className="text-xs text-gray-500">ID: {category.id}</span>
      </div>
    </div>
  );
};

export default CategoryCard;

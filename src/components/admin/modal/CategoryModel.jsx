import { useState, useEffect } from "react";
import { X, Loader, Save, Link as LinkIcon } from "lucide-react";

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // รวม State ไว้ใน object เดียวเพื่อให้จัดการง่าย
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSlugEdited, setIsSlugEdited] = useState(false); // เช็คว่า user แก้ slug เองไหม

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.title || "", // support ทั้ง name/title เผื่อข้อมูลเก่า
        slug: initialData.slug || "",
        description: initialData.description || "",
      });
      setIsSlugEdited(true); // ถ้าแก้ไข ไม่ต้อง auto-gen slug
    } else {
      setFormData({ name: "", slug: "", description: "" });
      setIsSlugEdited(false);
    }
  }, [initialData, isOpen]);

  // ฟังก์ชันแปลงข้อความให้เป็น Slug (ภาษาอังกฤษพิมพ์เล็ก-ขีดกลาง)
  const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-") // แทนที่ช่องว่างหรือ underscore ด้วย -
      .replace(/[^\w-]+/g, "") // ลบตัวอักษรพิเศษที่ไม่ใช่ word char หรือ -
      .replace(/--+/g, "-"); // ลบ - ที่ซ้ำกัน
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-generate Slug ถ้ากำลังพิมพ์ Name และยังไม่ได้แก้ Slug เอง
      if (name === "name" && !isSlugEdited) {
        newData.slug = generateSlug(value);
      }
      return newData;
    });
  };

  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
    setIsSlugEdited(true); // จำไว้ว่า User แก้เองแล้ว ไม่ต้อง auto-gen ทับ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Please enter a category name");
    if (!formData.slug.trim()) return alert("Please enter a slug");

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-gray-100 dark:to-gray-800/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Category" : "Create New Category"}
          </h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Action Movies"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Slug Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <LinkIcon size={14} />
              </div>
              <input
                type="text"
                name="slug"
                className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg p-3 pl-9 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none font-mono text-sm transition-all"
                placeholder="action-movies"
                value={formData.slug}
                onChange={handleSlugChange}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Used for URL (e.g., /category/action-movies)
            </p>
          </div>

          {/* Description Input (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description{" "}
              <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none transition-all"
              placeholder="Short description for this category..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
            >
              {loading ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {initialData ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

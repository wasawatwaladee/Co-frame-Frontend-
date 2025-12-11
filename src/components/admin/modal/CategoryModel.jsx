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
    if (!formData.name.trim()) return alert("กรุณากรอกชื่อหมวดหมู่");
    if (!formData.slug.trim()) return alert("กรุณากรอก Slug");

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900/50">
          <h3 className="text-lg font-bold text-white">
            {initialData ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              ชื่อหมวดหมู่ (Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น Action Movies"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          {/* Slug Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <LinkIcon size={14} />
              </div>
              <input
                type="text"
                name="slug"
                className="w-full bg-gray-700 text-blue-300 rounded-lg p-2.5 pl-9 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                placeholder="action-movies"
                value={formData.slug}
                onChange={handleSlugChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ใช้สำหรับ URL (เช่น /category/action-movies)
            </p>
          </div>

          {/* Description Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              รายละเอียด (Description){" "}
              <span className="text-gray-500 text-xs">(ไม่บังคับ)</span>
            </label>
            <textarea
              name="description"
              rows="3"
              className="w-full bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="คำอธิบายหมวดหมู่สั้นๆ..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {initialData ? "บันทึก" : "สร้าง"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

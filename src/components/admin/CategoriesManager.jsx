import { useState, useEffect } from "react";
import { Plus, Loader } from "lucide-react";
import axios from "axios";
import useUserStore from "../../stores/Store";

import CategoryModal from "./modal/CategoryModel";
import CategoryCard from "./ui/CardCategory";
import { toast } from "react-toastify";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const token = useUserStore((state) => state.token);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5500/api/categories");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.categories || [];
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ฟังก์ชันนี้จะได้รับ { name, slug, description } จาก Modal
  const handleSaveCategory = async (formData) => {
    try {
      if (editingCategory) {
        // Update
        const res = await axios.put(
          `http://localhost:5500/api/categories/${editingCategory.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // ใช้ข้อมูลล่าสุดจาก Backend หรือผสมข้อมูลเก่ากับใหม่
        const updatedCat = res.data.category ||
          res.data || { ...editingCategory, ...formData };

        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? updatedCat : cat))
        );
      } else {
        // Create
        const res = await axios.post(
          "http://localhost:5500/api/categories",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const newCategory = res.data.category || res.data;
        setCategories((prev) => [newCategory, ...prev]);
      }
    } catch (err) {
      alert("บันทึกไม่สำเร็จ: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("ยืนยันการลบหมวดหมู่?")) return;
    try {
      await axios.delete(`http://localhost:5500/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Delete successfully")
      
    } catch (err) {
      toast.error("Failed delete: " + (err.response?.data?.message || err.message));
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            จัดการหมวดหมู่
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            รายการ ({categories.length})
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30"
        >
          <Plus size={20} />
          <span>เพิ่มหมวดหมู่</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-white/50">
          <Loader className="animate-spin mr-2" /> กำลังโหลด...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id || index}
              category={category}
              colorIndex={index}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  );
};

export default CategoryManager;

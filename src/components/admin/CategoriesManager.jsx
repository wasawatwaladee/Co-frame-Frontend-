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
      alert("Save failed: " + (err.response?.data?.message || err.message));
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
            Category Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Manage {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md cursor-pointer"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
          <Loader className="animate-spin mr-2" size={20} /> Loading categories...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <CategoryCard
                key={category.id || index}
                category={category}
                colorIndex={index}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No categories found
              </p>
            </div>
          )}
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

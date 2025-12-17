// RoleModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ROLES = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' },
    { value: 'suspended', label: 'Suspended' },
];

export default function RoleModal({ isOpen, onClose, user, onUpdateRole }) {
   
    if (!isOpen || !user) return null;

    // ⭐️ State สำหรับ Role ที่เลือก
    const [newRole, setNewRole] = useState(user.role);
    
    // Sync State เมื่อผู้ใช้ที่เลือกเปลี่ยน
    useEffect(() => {
        setNewRole(user.role);
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // เรียก Handler ใน UserManager เพื่อยิง API
        onUpdateRole(user.id, newRole); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1a1a] w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-gray-100 dark:to-gray-800/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Update User Role
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Current Role Display */}
                    <div>
                        <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            User: {user.firstName || user.email}
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg p-3 text-sm font-medium">
                            Current Role: <span className="font-semibold">{user.role}</span>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Select New Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
                        >
                            {ROLES.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900/20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={newRole === user.role}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                            newRole === user.role 
                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
                        }`}
                    >
                        Save Role
                    </button>
                </div>
            </form>
        </div>
    );
}
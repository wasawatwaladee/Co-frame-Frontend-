// RoleModal.jsx
import React, { useState, useEffect } from "react";

const ROLES = [
    { value: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)' },
    { value: 'USER', label: 'ผู้ใช้ทั่วไป (User)' },
    { value: 'suspended', label: 'ระงับการใช้งาน (Suspended)' },
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
            <form onSubmit={handleSubmit} className="bg-[#1a1a1a] w-full max-w-sm rounded-xl border border-white/10 shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                    เปลี่ยนสิทธิ์: {user.firstName || user.email}
                </h3>
                <p className="text-textSecondary text-sm mb-6">
                    ปัจจุบัน: <span className="font-semibold text-white">{user.role}</span>
                </p>

                {/* Dropdown Role */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-textSecondary block mb-2">เลือกสิทธิ์ใหม่</label>
                    <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                        {ROLES.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium py-2.5 rounded-lg transition-colors border border-white/5"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type="submit"
                        disabled={newRole === user.role} // ปิดการใช้งานถ้า Role ไม่ได้ถูกเปลี่ยน
                        className={`flex-1 font-bold py-2.5 rounded-lg transition-colors ${
                            newRole === user.role ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
                        }`}
                    >
                        บันทึก
                    </button>
                </div>
            </form>
        </div>
    );
}
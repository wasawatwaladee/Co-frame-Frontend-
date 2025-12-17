// import { useEffect, useState } from "react";
// import  authApi  from "../../api/api";

// export default function UserManager() {
// //  const userList = useUserStore((state) => state.userList);
//   // const fetchUsers = useUserStore((state) => state.fetchUsers);
//     const [userList, setUserList] = useState([]);

//   useEffect(()=>{

//       const fetchUsers=async ()=>{
//          try {
//       const resp = await authApi.get('/api/auth/users')
//       console.log('res.data', resp.data)
//       setUserList(resp.data.users)

//     } catch (err) {
//       console.log(err)
//     }
//     }

//   fetchUsers();
//     },[])

// console.log('userList', userList)

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//         <h2 className="text-2xl font-bold">จัดการผู้ใช้และสิทธิ์</h2>

//         {/* Search */}
//         <div className="relative w-full md:w-80">
//           <input
//             type="text"
//             placeholder="ค้นหาผู้ใช้..."
//             className="w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:border-primary transition-colors"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={1.5}
//             stroke="currentColor"
//             className="w-5 h-5 absolute left-3 top-3 text-textMuted"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//             />
//           </svg>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-[#111111] text-textSecondary text-sm border-b border-white/10">
//                 <th className="p-4 font-medium">Username</th>
//                 <th className="p-4 font-medium">Email</th>
//                 <th className="p-4 font-medium">CreatedAt</th>
//                 <th className="p-4 font-medium">Role</th>
//                 <th className="p-4 font-medium text-center">Manage</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {userList.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="hover:bg-white/5 transition-colors"
//                 >
//                   <td className="p-4 font-medium text-white">{user.firstName}</td>
//                   <td className="p-4 text-textMuted">{user.email}</td>
//                   <td className="p-4 text-textMuted">{user.createdAt}</td>
//                   <td className="p-4">{user.role}</td>

//                   {/* Action Buttons */}
//                   <td className="p-4">
//                     <div className="flex items-center justify-center gap-2">
//                       {/* Button 1: Promote to Admin */}
//                       <button
//                         className={`p-2 rounded-lg transition-colors ${
//                           user.role === "admin"
//                             ? "bg-primary text-white"
//                             : "bg-[#252525] text-textMuted hover:text-white"
//                         }`}
//                         title="ตั้งเป็นผู้ดูแล"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                           className="w-4 h-4"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.804a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.677a9.71 9.71 0 00-6.194 2.196 11.242 11.242 0 01-.192 2.877c0 4.966 3.425 9.176 8.01 10.51 4.585-1.334 8.01-5.544 8.01-10.51a11.25 11.25 0 01-.192-2.877A9.71 9.71 0 0012 4.677z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </button>

//                       {/* Button 2: Set as User */}
//                       <button
//                         className={`p-2 rounded-lg transition-colors ${
//                           user.role === "user"
//                             ? "bg-green-600 text-white"
//                             : "bg-[#252525] text-textMuted hover:text-white"
//                         }`}
//                         title="ตั้งเป็นผู้ใช้ทั่วไป"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 24 24"
//                           fill="currentColor"
//                           className="w-4 h-4"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.804a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.677a9.71 9.71 0 00-6.194 2.196 11.242 11.242 0 01-.192 2.877c0 4.966 3.425 9.176 8.01 10.51 4.585-1.334 8.01-5.544 8.01-10.51a11.25 11.25 0 01-.192-2.877A9.71 9.71 0 0012 4.677z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </button>

//                       {/* Button 3: Suspend */}
//                       <button
//                         className={`p-2 rounded-lg transition-colors ${
//                           user.role === "suspended"
//                             ? "bg-gray-600 text-white"
//                             : "bg-[#252525] text-textMuted hover:text-white"
//                         }`}
//                         title="ระงับการใช้งาน"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           strokeWidth={1.5}
//                           stroke="currentColor"
//                           className="w-4 h-4"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
//                           />
//                         </svg>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// UserManager.jsx
import { useEffect, useState, useCallback } from "react";
import authApi from "../../api/api";
import RoleModal from "../admin/modal/RoleModal";
import DeleteUserModal from "../admin/modal/DeleteUserModal";

// ⭐️ ฟังก์ชันหลัก
export default function UserManager() {
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'role', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const fetchUsers = useCallback(async () => {
    try {
      // Endpoint สำหรับดึง User ทั้งหมด
      const resp = await authApi.get("/api/auth/users");
      // สมมติว่า API คืนค่าเป็น { users: [...] }
      setUsersList(resp.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  // ⭐️⭐️ ฟังก์ชัน Fetch ข้อมูลผู้ใช้ทั้งหมด (Local Fetch) ⭐️⭐️

  // ⭐️ Effect สำหรับเรียก API เมื่อ Component Mount และจัดการ Refresh
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ------------------- Modal & Action Handlers -------------------

  const handleOpenRoleModal = (user) => {
    console.log('user from openrolemodal', user)
    setSelectedUser(user);
    setModalType("role");
  };

  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType("delete");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  // ⭐️ ฟังก์ชันหลักในการอัปเดต Role (ส่งไปยัง RoleModal)
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await authApi.put(`/api/auth/users/${userId}`, { role: newRole });
      handleCloseModal();
      await fetchUsers(); // อัปเดตตารางทันที
    } catch (error) {
      console.error("Role update failed:", error);
    }
  };

  // ฟังก์ชันหลักสำหรับลบผู้ใช้ (ส่งไปยัง DeleteUserModal)
  const handleDeleteUser = async (userId) => {
    try {
      await authApi.delete(`/api/auth/users/${userId}`);
      handleCloseModal();
      await fetchUsers(); // อัปเดตตารางทันที
    } catch (error) {
      console.error("User deletion failed:", error);
    }
  };

  // ------------------- Filter & UI Helpers -------------------

  const filteredUsers = usersList.filter((user) =>
    (user.firstName || user.email)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return (
          <span className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-xs px-3 py-1 rounded-full font-semibold border border-red-300 dark:border-red-500/30">
            Admin
          </span>
        );
      case "USER":
        return (
          <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs px-3 py-1 rounded-full font-semibold border border-green-300 dark:border-green-500/30">
            User
          </span>
        );
      case "suspended":
        return (
          <span className="bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full font-semibold border border-gray-300 dark:border-gray-500/30">
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage user roles and permissions across your platform</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-3 text-gray-400 dark:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#111111] text-gray-700 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-white/10">
                <th className="p-4 font-semibold">Username</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Join Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
         
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                 
                 <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {user.username || user.email}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>

                    {/* Action Buttons */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Role Management Button */}
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"
                          title="Edit Role"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          title="Delete User"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⭐️⭐️ RENDER MODALS ⭐️⭐️ */}

      <RoleModal
        isOpen={modalType === "role"}
        onClose={handleCloseModal}
        user={selectedUser}
        onUpdateRole={handleUpdateRole}
      />

      <DeleteUserModal
        isOpen={modalType === "delete"}
        onClose={handleCloseModal}
        user={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}

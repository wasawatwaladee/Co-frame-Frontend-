// Mock Data
const mockUsers = [
  {
    id: 1,
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    joinDate: "2024-01-15",
    role: "admin",
  },
  {
    id: 2,
    name: "สมหญิง รักสนุก",
    email: "somying@example.com",
    joinDate: "2024-02-20",
    role: "user",
  },
  {
    id: 3,
    name: "ประเสริฐ มั่งมี",
    email: "prasert@example.com",
    joinDate: "2024-03-10",
    role: "user",
  },
  {
    id: 4,
    name: "วิไล สวยงาม",
    email: "wilai@example.com",
    joinDate: "2024-01-05",
    role: "suspended",
  },
  {
    id: 5,
    name: "ดวงใจ แสงสว่าง",
    email: "duangjai@example.com",
    joinDate: "2024-04-12",
    role: "user",
  },
];

export default function UserManager() {
  // Helper สำหรับสีของ Role Badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
            ผู้ดูแล
          </span>
        );
      case "user":
        return (
          <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            ผู้ใช้ทั่วไป
          </span>
        );
      case "suspended":
        return (
          <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full font-medium">
            ระงับการใช้งาน
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">จัดการผู้ใช้และสิทธิ์</h2>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            className="w-full bg-[#1a1a1a] border border-white/10 text-white px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-3 top-3 text-textMuted"
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
      <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] text-textSecondary text-sm border-b border-white/10">
                <th className="p-4 font-medium">ชื่อผู้ใช้</th>
                <th className="p-4 font-medium">อีเมล</th>
                <th className="p-4 font-medium">วันที่เข้าร่วม</th>
                <th className="p-4 font-medium">สิทธิ์</th>
                <th className="p-4 font-medium text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4 text-textMuted">{user.email}</td>
                  <td className="p-4 text-textMuted">{user.joinDate}</td>
                  <td className="p-4">{getRoleBadge(user.role)}</td>

                  {/* Action Buttons */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Button 1: Promote to Admin */}
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          user.role === "admin"
                            ? "bg-primary text-white"
                            : "bg-[#252525] text-textMuted hover:text-white"
                        }`}
                        title="ตั้งเป็นผู้ดูแล"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.804a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.677a9.71 9.71 0 00-6.194 2.196 11.242 11.242 0 01-.192 2.877c0 4.966 3.425 9.176 8.01 10.51 4.585-1.334 8.01-5.544 8.01-10.51a11.25 11.25 0 01-.192-2.877A9.71 9.71 0 0012 4.677z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Button 2: Set as User */}
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          user.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-[#252525] text-textMuted hover:text-white"
                        }`}
                        title="ตั้งเป็นผู้ใช้ทั่วไป"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.804a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 4.677a9.71 9.71 0 00-6.194 2.196 11.242 11.242 0 01-.192 2.877c0 4.966 3.425 9.176 8.01 10.51 4.585-1.334 8.01-5.544 8.01-10.51a11.25 11.25 0 01-.192-2.877A9.71 9.71 0 0012 4.677z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Button 3: Suspend */}
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          user.role === "suspended"
                            ? "bg-gray-600 text-white"
                            : "bg-[#252525] text-textMuted hover:text-white"
                        }`}
                        title="ระงับการใช้งาน"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

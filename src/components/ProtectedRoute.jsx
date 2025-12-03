
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../stores/Store';
// <<< อิมพอร์ต Store

const useAuth = () => {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);

  // 1. ตรวจสอบว่า Login แล้วหรือไม่
  const isAuthenticated = !!token && !!user;

  // 2. กำหนดบทบาท
  // ถ้า Login แล้ว ดึง role จาก user object (สมมติว่ามี field 'role')
  // ถ้ายังไม่ได้ Login หรือไม่มีข้อมูล user, ให้เป็น 'guest'
  const role = isAuthenticated ? user.role : 'guest';

  return { isAuthenticated, role };
};


const ProtectedRoute = ({
  allowedRoles,
  redirectPath = '/', 
}) => {
  const { role, isAuthenticated } = useAuth();
  
  // ในบางกรณี: ถ้าผู้ใช้ Login แล้ว แต่กำลังพยายามเข้าหน้า Login/Register
  // เราอาจต้องการ Redirect ไปหน้าแรกแทนที่จะแสดงหน้านั้น
  if (allowedRoles.includes('guest') && isAuthenticated) {
     return <Navigate to="/" replace />;
  }

  // 1. ตรวจสอบว่าผู้ใช้มี role ที่ได้รับอนุญาตหรือไม่
  const isAllowed = allowedRoles.includes(role);

  // 2. ถ้ามีสิทธิ์ ให้อนุญาต
  if (isAllowed) {
    return <Outlet />;
  }

  // 3. ถ้าไม่มีสิทธิ์ ให้ Redirect
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RoomPage from "../pages/RoomPage";
import CommunityPage from "../pages/communityPage";
import AdminPage from "../pages/AdminPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import useUserStore from "../stores/Store";


const router = createBrowserRouter([

  { path: "/", element: <HomePage /> },
  { path: "*", element: <Navigate to="/" /> },
  { path: "community", element: <CommunityPage /> },
  { path: "room/:movieId/:roomToken?", element: <RoomPage /> }, 

  {
    element: <ProtectedRoute allowedRoles={['guest']} redirectPath="/" />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      
      
    ]
  },

  {
    element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} redirectPath="/login" />,
    children: [
      { path: "profile", element: <ProfilePage /> }, // Kay
      { path: "profile/:username", element: <ProfilePage /> },
    
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} redirectPath="/" />, 
    children: [
      { path: "admin", element: <AdminPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" /> },
]);

function AppRouter() {
  const token = useUserStore(state => state.token);
  return <RouterProvider router={router} />;
}

export default AppRouter;

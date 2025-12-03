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

  {
    element: <ProtectedRoute allowedRoles={['guest']} redirectPath="/" />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "community", element: <CommunityPage /> },
    ]
  },

  {
    element: <ProtectedRoute allowedRoles={['USER', 'admin']} redirectPath="/login" />,
    children: [
      { path: "profile", element: <ProfilePage /> }, // Kay
      { path: "room/:movieId/:roomToken?", element: <RoomPage /> }, 
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={['admin']} redirectPath="/" />, 
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

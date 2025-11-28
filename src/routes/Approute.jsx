import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RoomPage from "../pages/RoomPage";
import CommunityPage from "../pages/communityPage";
import AdminPage from "../pages/AdminPage";
import RegisterPage from "../pages/RegisterPage";

const guestRouter = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const userRouter = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "*", element: <Navigate to="/" /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },

  { path: "admin", element: <AdminPage /> },
  { path: "/room/:movieId/:roomToken?", element: <RoomPage /> },

  { path: "community", element: <CommunityPage /> },
]);

function AppRouter() {
  const user = "andy@ggg.mail";
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}

export default AppRouter;

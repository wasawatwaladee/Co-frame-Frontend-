import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import CommunityPage from "../pages/communityPage";

const guestRouter = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const userRouter = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "*", element: <Navigate to="/" /> },
  { path: "login", element: <LoginPage /> },
  { path: "community", element: <CommunityPage /> },
]);

function AppRouter() {
  const user = "andy@ggg.mail";
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}

export default AppRouter;

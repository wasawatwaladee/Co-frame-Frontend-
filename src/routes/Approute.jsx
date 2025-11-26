import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RoomPage from "../pages/RoomPage";

const guestRouter = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const userRouter = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "*", element: <Navigate to="/" /> },
  { path: "login", element: <LoginPage /> },
  
  { path: "/room/:movieId/:roomToken?", element: <RoomPage /> },

]);

function AppRouter() {
  const user = "andy@ggg.mail";
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}

export default AppRouter;

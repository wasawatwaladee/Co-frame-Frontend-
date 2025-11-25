import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router";
import LoginPage from "../pages/loginPage";
import HomePage from "../pages/HomePage";

const guestRouter = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const userRouter = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "*", element: <Navigate to="/" /> },
  { path: "home", element: <HomePage /> },
]);

function AppRouter() {
  const user = "andy@ggg.mail";
  const finalRouter = user ? userRouter : guestRouter;
  return <RouterProvider router={finalRouter} />;
}

export default AppRouter;

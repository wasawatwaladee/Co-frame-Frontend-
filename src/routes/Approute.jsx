import {createBrowserRouter, Navigate, Outlet, RouterProvider} from 'react-router'
import LoginPage from '../pages/loginPage'

const guestRouter = createBrowserRouter([
 {path : '/', element: <LoginPage />},
 {path : '*', element: <Navigate to='/' />},
])

const userRouter = createBrowserRouter([
 {path: '/', element: <LoginPage />},
 {path : '*', element: <Navigate to='/' />},
])

function AppRouter() {
  const user = 'andy@ggg.mail'
  const finalRouter = user ? userRouter : guestRouter
 return (
    <RouterProvider router={finalRouter} />

 )
}

export default AppRouter

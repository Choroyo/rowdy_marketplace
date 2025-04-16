// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Outlet } from 'react-router-dom'
import Layout from './ui/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Product from './pages/Product'
import Category from './pages/Category'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Favorite from './pages/Favorite'
import Orders from './pages/Orders'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Forum from './pages/Forum'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Registration from './ui/Registration'
import CreateProduct from './pages/CreateProduct'

const RouterLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: (
          <div className="container mx-auto px-4 py-8">
            <Registration />
          </div>
        ),
      },
      {
        path: '/product',
        element: <Product />,
      },
      {
        path: '/product/:id',
        element: <Product />,
      },
      {
        path: '/category',
        element: <Category />,
      },
      {
        path: '/category/:id',
        element: <Category />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/create-product',
        element: (
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: '/favorite',
        element: (
          <ProtectedRoute>
            <Favorite />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: '/success',
        element: (
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        ),
      },
      {
        path: '/cancel',
        element: (
          <ProtectedRoute>
            <Cancel />
          </ProtectedRoute>
        ),
      },
      {
        path: '/forum',
        element: (
          <ProtectedRoute requireVerification={false}>
            <Forum />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

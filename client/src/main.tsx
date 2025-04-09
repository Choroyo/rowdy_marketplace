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
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'  // Add this import

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
        element: <Profile />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/favorite',
        element: <Favorite />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/success',
        element: <Success />,
      },
      {
        path: '/cancel',
        element: <Cancel />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
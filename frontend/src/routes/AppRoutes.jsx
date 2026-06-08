import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { LoginPage, RegisterPage } from '../pages/AuthPages'
import { ProductsPage, ProductDetailsPage } from '../pages/CatalogPages'
import { CartPage, WishlistPage, CheckoutPage, OrdersPage } from '../pages/CommercePages'
import { AdminPage } from '../pages/AdminPage'
import { RequireAdmin, RequireAuth } from './RouteGuards'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
      <Route path="/wishlist" element={<RequireAuth><WishlistPage /></RequireAuth>} />
      <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
      <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
      <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

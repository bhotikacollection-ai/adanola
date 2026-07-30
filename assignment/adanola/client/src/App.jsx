import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import AdminGuard from './components/AdminGuard';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import NotFound from './pages/NotFound';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import SiteContent from './pages/admin/SiteContent';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public store routes ── */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:slug" element={<Product />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Admin routes ── */}
            <Route
              path="admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="site" element={<SiteContent />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import BrandFilter from './components/BrandFilter'
import CategorySidebar from './components/CategorySidebar'
import CartBanner from './components/CartBanner'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'
import Footer from './components/Footer'
import { CartContext } from './context/CartContext'
import { useContext } from 'react'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'

const ShopView = () => {
  const { toggleCart } = useContext(CartContext);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="app-container">
      <Header onProfileClick={() => setIsProfileOpen(true)} onLoginClick={() => setIsAuthOpen(true)} />
      <BrandFilter />
      <div className="main-layout">
        <CategorySidebar />
        <Home />
      </div>
      <Footer />
      <CartBanner onClick={() => toggleCart(true)} />

      <CartDrawer />
      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
      {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopView />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import WhatsAppWidget from './components/WhatsAppWidget/WhatsAppWidget';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import PhoneLogin from './pages/Auth/PhoneLogin';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import GuestCheckout from './pages/Checkout/GuestCheckout';
import GuestOrderSuccess from './pages/OrderSuccess/GuestOrderSuccess';
import './styles/globals.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/guest-checkout" element={<GuestCheckout />} />
                <Route path="/guest-order-success" element={<GuestOrderSuccess />} />
                
                {/* Auth Routes - Public Only */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/phone-login" 
                  element={
                    <PublicRoute>
                      <PhoneLogin />
                    </PublicRoute>
                  } 
                />
                
                {/* Protected Routes - Authenticated Only */}
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-success" 
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <WhatsAppWidget />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
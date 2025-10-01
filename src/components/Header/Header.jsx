import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleUserAction = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              <h2>TechStore</h2>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <a href="#categories">Categories</a>
            <a href="#deals">Deals</a>
          </nav>

          {/* Search Bar */}
          <motion.form 
            className="search-bar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
          >
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search laptops, phones, accessories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.form>

          {/* Actions */}
          <div className="header-actions">
            {/* User Menu */}
            <div className="user-menu-container">
              <motion.button 
                className="icon-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={22} />
              </motion.button>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    className="user-menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="user-info">
                          <p className="user-name">{user?.fullName}</p>
                          <p className="user-email">{user?.email}</p>
                        </div>
                        <div className="menu-divider"></div>
                        <button onClick={() => handleUserAction('/profile')} className="menu-item">
                          <User size={16} />
                          Profile
                        </button>
                        <button onClick={() => handleUserAction('/orders')} className="menu-item">
                          <Package size={16} />
                          My Orders
                        </button>
                        <button onClick={() => handleUserAction('/settings')} className="menu-item">
                          <Settings size={16} />
                          Settings
                        </button>
                        <div className="menu-divider"></div>
                        <button onClick={handleLogout} className="menu-item logout">
                          <LogOut size={16} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleUserAction('/login')} className="menu-item">
                          <User size={16} />
                          Login
                        </button>
                        <button onClick={() => handleUserAction('/register')} className="menu-item">
                          <LogOut size={16} />
                          Register
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
           <motion.button 
  className="icon-btn cart-btn"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => navigate('/cart')}
>
  <ShoppingCart size={22} />
  <span className="cart-count">{getCartItemsCount()}</span>
</motion.button>

            {/* Mobile Menu Button */}
            <motion.button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav 
              className="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/phone-login" onClick={() => setIsMobileMenuOpen(false)}>
              Phone Login
              </Link>
              <a href="#categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</a>
              <a href="#deals" onClick={() => setIsMobileMenuOpen(false)}>Deals</a>
              
              <div className="mobile-auth">
                {isAuthenticated ? (
                  <>
                    <div className="mobile-user-info">
                      <p>Welcome, {user?.fullName}</p>
                    </div>
                    <Link to="/profile" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                    <Link to="/orders" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                    <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                    <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
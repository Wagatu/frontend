import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag, UserPlus } from 'lucide-react';
import './GuestOrderSuccess.css';

const GuestOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get('order');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!orderNumber || !email) {
      navigate('/');
    }
  }, [orderNumber, email, navigate]);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="guest-order-success-page">
      <div className="container">
        <motion.div 
          className="success-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="success-header">
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle size={60} />
            </motion.div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order has been received.</p>
            <div className="order-number">
              Order #: <strong>{orderNumber}</strong>
            </div>
          </div>

          <div className="success-content">
            <motion.div 
              className="detail-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-header">
                <Package size={24} />
                <h3>Order Details</h3>
              </div>
              <div className="card-body">
                <div className="detail-row">
                  <span>Order Number:</span>
                  <span>{orderNumber}</span>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Contact Email:</span>
                  <span>{email}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className="status confirmed">Confirmed</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="account-promo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="promo-header">
                <UserPlus size={32} />
                <h3>Create an Account</h3>
              </div>
              <div className="promo-content">
                <p>Get access to these benefits by creating a free account:</p>
                <ul>
                  <li>Track all your orders in one place</li>
                  <li>Save your shipping addresses</li>
                  <li>Get exclusive deals and discounts</li>
                  <li>Faster checkout experience</li>
                </ul>
                <Link to="/register" className="btn btn-primary">
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="success-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/" className="btn btn-primary">
              <Home size={18} />
              Continue Shopping
            </Link>
            <Link to="/products" className="btn btn-secondary">
              <ShoppingBag size={18} />
              Browse More Products
            </Link>
          </motion.div>

          <div className="success-footer">
            <p>A confirmation email has been sent to <strong>{email}</strong></p>
            <p>Use your order number and email to track your order.</p>
            <p>For any questions, contact our <a href="mailto:support@techstore.com">customer support</a>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GuestOrderSuccess;
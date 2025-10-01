import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, orderNumber } = location.state || {};

  useEffect(() => {
    if (!order && !orderNumber) {
      navigate('/');
    }
  }, [order, orderNumber, navigate]);

  if (!order && !orderNumber) {
    return null;
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

  return (
    <div className="order-success-page">
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
              Order #: <strong>{order?.orderNumber || orderNumber}</strong>
            </div>
          </div>

          <div className="success-content">
            <div className="order-details">
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
                    <span>{order?.orderNumber || orderNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span>Order Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total Amount:</span>
                    <span>${order?.finalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Payment Method:</span>
                    <span>{order?.paymentMethod || 'Credit Card'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>
                    <span className="status confirmed">Confirmed</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="detail-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="card-header">
                  <Truck size={24} />
                  <h3>Delivery Information</h3>
                </div>
                <div className="card-body">
                  <div className="detail-row">
                    <span>Estimated Delivery:</span>
                    <span>{estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Shipping Method:</span>
                    <span>{order?.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Shipping Address:</span>
                    <span>
                      {order?.shippingAddress?.address}, {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="order-items-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3>Items Ordered</h3>
              <div className="items-list">
                {order?.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.brand}</p>
                      <div className="item-meta">
                        <span>Qty: {item.quantity}</span>
                        <span>${item.price} each</span>
                      </div>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
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
            <p>You will receive an order confirmation email shortly.</p>
            <p>For any questions, please contact our <a href="mailto:support@techstore.com">customer support</a>.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
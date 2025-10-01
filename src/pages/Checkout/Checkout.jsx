import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI, productsAPI } from '../../services/api';
import { CreditCard, Truck, MapPin, Shield } from 'lucide-react';
import './Checkout.css';
import { useLocation } from '../../hooks/useLocation';

const Checkout = () => {
  const { items, getCartTotal, clearCart, verifyCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { calculateShipping, findNearestStore } = useLocation();
  const [shippingInfo, setShippingInfo] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);

  const [formData, setFormData] = useState({
    // Shipping Address
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    
    // Delivery Option
    deliveryOption: 'standard',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate shipping when address or delivery option changes
  useEffect(() => {
    const calculateShippingCost = async () => {
      if (formData.address && formData.city && formData.state && formData.zipCode) {
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
        
        try {
          const shippingData = await calculateShipping(
            fullAddress, 
            getCartTotal(), 
            formData.deliveryOption
          );
          setShippingInfo(shippingData);

          // Find nearest store for pickup
          if (formData.deliveryOption === 'pickup') {
            const store = await findNearestStore(fullAddress);
            setNearestStore(store);
          } else {
            setNearestStore(null);
          }
        } catch (error) {
          console.error('Shipping calculation failed:', error);
          setShippingInfo(null);
        }
      }
    };

    calculateShippingCost();
  }, [formData.address, formData.city, formData.state, formData.zipCode, formData.deliveryOption, getCartTotal, calculateShipping, findNearestStore]);

  // Update delivery options with real calculations
  const deliveryOptions = [
    {
      value: 'standard',
      title: 'Standard Delivery',
      desc: shippingInfo ? `${shippingInfo.estimatedDays} business days` : '3-5 business days',
      price: shippingInfo ? (shippingInfo.cost === 0 ? 'FREE' : `$${shippingInfo.cost.toFixed(2)}`) : '$29.99'
    },
    {
      value: 'express',
      title: 'Express Delivery',
      desc: shippingInfo ? `${Math.max(1, shippingInfo.estimatedDays - 2)} business days` : '1-2 business days',
      price: shippingInfo ? `$${(shippingInfo.cost * 1.5).toFixed(2)}` : '$49.99'
    },
    {
      value: 'pickup',
      title: 'Store Pickup',
      desc: nearestStore ? `Pick up from ${nearestStore.name}` : 'Pick up from nearest store',
      price: 'FREE'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const calculateShippingFee = () => {
    const subtotal = getCartTotal();
    
    if (formData.deliveryOption === 'pickup') {
      return 0;
    } else if (formData.deliveryOption === 'express') {
      return 49.99;
    } else {
      // Use calculated shipping if available, otherwise use default
      if (shippingInfo) {
        return shippingInfo.cost;
      }
      return subtotal > 500 ? 0 : 29.99;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard)) {
      setError('Please fill in all card details');
      setLoading(false);
      return;
    }

    try {
      // Verify all products exist before creating order
      console.log('Cart items before order:', items);
      
      const orderData = {
        items: items.map(item => ({
          productId: item.id, 
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          image: item.image,
          brand: item.brand,
          category: item.category
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        customerNotes: `Delivery: ${formData.deliveryOption}`,
        deliveryOption: formData.deliveryOption
      };

      console.log('Order data being sent:', orderData);

      // Create order via API
      const response = await ordersAPI.create(orderData);
      
      if (response.data.success) {
        // Clear cart on successful order
        clearCart();
        
        // Redirect to order success page with order details
        navigate('/order-success', { 
          state: { 
            order: response.data.data.order,
            orderNumber: response.data.data.order.orderNumber
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = calculateShippingFee();
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            {/* Left Column - Forms */}
            <div className="checkout-forms">
              {/* Shipping Address */}
              <motion.div 
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="section-header">
                  <MapPin size={20} />
                  <h3>Shipping Address</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Delivery Options */}
              <motion.div 
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="section-header">
                  <Truck size={20} />
                  <h3>Delivery Options</h3>
                </div>
                
                <div className="delivery-options">
                  {deliveryOptions.map(option => (
                    <label className="delivery-option" key={option.value}>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.value}
                        checked={formData.deliveryOption === option.value}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <div className="option-content">
                        <span className="option-title">{option.title}</span>
                        <span className="option-desc">{option.desc}</span>
                        <span className="option-price">{option.price}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                className="form-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="section-header">
                  <CreditCard size={20} />
                  <h3>Payment Method</h3>
                </div>
                
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <CreditCard size={18} />
                    <span>Credit/Debit Card</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Shield size={18} />
                    <span>PayPal</span>
                  </label>
                  
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <Truck size={18} />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Name on Card *</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div 
              className="order-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="quantity-badge">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>{item.brand}</p>
                    </div>
                    <div className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="total-row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="total-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="total-divider"></div>
                
                <div className="total-row final">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
              
              <div className="security-notice">
                <Shield size={16} />
                <span>Your payment is secure and encrypted</span>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
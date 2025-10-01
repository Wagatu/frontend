// New component: src/pages/Checkout/GuestCheckout.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../hooks/useLocation';
import './GuestCheckout.css';

const GuestCheckout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { calculateShipping } = useLocation();
  const [currentStep, setCurrentStep] = useState(1); // 1: Contact, 2: Shipping, 3: Payment
  const [formData, setFormData] = useState({
    // Contact Info
    email: '',
    phone: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Payment
    paymentMethod: 'card',
    deliveryOption: 'standard'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGuestOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        deliveryOption: formData.deliveryOption,
        guestEmail: formData.email,
        guestPhone: formData.phone
      };

      const response = await fetch('http://localhost:5000/api/guest/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        clearCart();
        // Redirect to guest order success page
        window.location.href = `/guest-order-success?order=${data.data.order.orderNumber}&email=${formData.email}`;
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Contact Info', active: currentStep === 1 },
    { number: 2, title: 'Shipping', active: currentStep === 2 },
    { number: 3, title: 'Payment', active: currentStep === 3 }
  ];

  return (
    <div className="guest-checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Guest Checkout</h1>
          <p>Complete your purchase without creating an account</p>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          {steps.map(step => (
            <div key={step.number} className={`step ${step.active ? 'active' : ''}`}>
              <div className="step-number">{step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleGuestOrder}>
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="checkout-step"
            >
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="step-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.email || !formData.phone}
                >
                  Continue to Shipping
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Shipping Address */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="checkout-step"
            >
              <h3>Shipping Address</h3>
              {/* Same shipping form as regular checkout */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {/* Step 3: Payment & Review */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="checkout-step"
            >
              <h3>Payment & Review</h3>
              {/* Same payment form as regular checkout */}
              <div className="step-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GuestCheckout;
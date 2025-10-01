import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, MessageCircle, ArrowLeft } from 'lucide-react';
import './PhoneAuth.css';

const PhoneLogin = () => {
  const [step, setStep] = useState('login'); // 'login', 'send-otp', 'verify-otp', 'register'
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    otp: '',
    fullName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/phone-auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('verify-otp');
        startCountdown();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/phone-auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp: formData.otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('register');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/phone-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/phone-auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    if (countdown === 0) {
      handleSendOTP();
    }
  };

  return (
    <div className="phone-auth-page">
      <div className="container">
        <motion.div 
          className="phone-auth-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <Link to="/login" className="back-btn">
              <ArrowLeft size={20} />
            </Link>
            <h2>
              {step === 'login' && 'Phone Login'}
              {step === 'send-otp' && 'Verify Phone'}
              {step === 'verify-otp' && 'Enter OTP'}
              {step === 'register' && 'Complete Registration'}
            </h2>
            <p>
              {step === 'login' && 'Sign in with your phone number'}
              {step === 'send-otp' && 'We\'ll send you a verification code'}
              {step === 'verify-otp' && 'Enter the code sent to your phone'}
              {step === 'register' && 'Complete your profile information'}
            </p>
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

          {/* Login Step */}
          {step === 'login' && (
            <form onSubmit={handlePhoneLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className="input-group">
                  <Phone size={20} />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <Lock size={20} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary auth-btn"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  <>
                    <Phone size={18} />
                    Sign In with Phone
                  </>
                )}
              </motion.button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="auth-link"
                    onClick={() => setStep('send-otp')}
                  >
                    Sign up with phone
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Send OTP Step */}
          {step === 'send-otp' && (
            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <div className="input-group">
                  <Phone size={20} />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary auth-btn"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Send Verification Code
                  </>
                )}
              </motion.button>
            </form>
          )}

          {/* Verify OTP Step */}
          {step === 'verify-otp' && (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">Verification Code</label>
                <div className="input-group">
                  <MessageCircle size={20} />
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="otp-actions">
                  {countdown > 0 ? (
                    <span className="countdown">Resend in {countdown}s</span>
                  ) : (
                    <button 
                      type="button" 
                      className="resend-btn"
                      onClick={resendOTP}
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary auth-btn"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  'Verify Code'
                )}
              </motion.button>
            </form>
          )}

          {/* Register Step */}
          {step === 'register' && (
            <form onSubmit={handlePhoneRegister} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <Lock size={20} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button 
                type="submit" 
                className="btn btn-primary auth-btn"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-small"></div>
                ) : (
                  'Complete Registration'
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PhoneLogin;
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import './SocialLogin.css';

const SocialLogin = ({ type = 'login', onSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // For development - simulate Google auth
      // In production, use Google Sign-In SDK
      const mockGoogleToken = 'mock-google-token-' + Date.now();
      
      const response = await fetch('http://localhost:5000/api/social-auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: mockGoogleToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      } else {
        alert(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // For development - simulate Facebook auth
      // In production, use Facebook SDK
      const mockFacebookToken = 'mock-facebook-token-' + Date.now();
      
      const response = await fetch('http://localhost:5000/api/social-auth/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: mockFacebookToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      } else {
        alert(data.message || 'Facebook login failed');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      alert('Facebook login failed');
    }
  };

  // Real Google OAuth (for production)
  const handleRealGoogleLogin = () => {
    // This would be implemented with Google Sign-In SDK
    // For now, we'll use the mock version above
    handleGoogleLogin();
  };

  // Real Facebook OAuth (for production)
  const handleRealFacebookLogin = () => {
    // This would be implemented with Facebook SDK
    // For now, we'll use the mock version above
    handleFacebookLogin();
  };

  return (
    <div className="social-login">
      <div className="social-buttons">
        <motion.button
          className="social-btn google-btn"
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FcGoogle size={20} />
          <span>{type === 'login' ? 'Sign in' : 'Sign up'} with Google</span>
        </motion.button>

        <motion.button
          className="social-btn facebook-btn"
          onClick={handleFacebookLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFacebook size={20} color="#1877F2" />
          <span>{type === 'login' ? 'Sign in' : 'Sign up'} with Facebook</span>
        </motion.button>
      </div>

      <div className="social-divider">
        <span>or continue with email</span>
      </div>
    </div>
  );
};

export default SocialLogin;
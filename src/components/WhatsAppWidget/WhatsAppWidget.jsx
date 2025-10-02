import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Clock, Phone, Mail } from 'lucide-react';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const phoneNumber = "0740463021"; 
  const businessName = "TechStore Support";
  const businessHours = "Mon-Sun: 9:00 AM - 10:00 PM";

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message || 'Hello, I need help with my order');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const quickQuestions = [
    {
      text: "Order Status",
      message: "Can you help me check my order status?"
    },
    {
      text: "Product Availability", 
      message: "I want to know about product availability"
    },
    {
      text: "Technical Support",
      message: "I need technical support for my product"
    },
    {
      text: "Return Policy",
      message: "Can you explain your return policy?"
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="whatsapp-float"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1
        }}
      >
        <MessageCircle size={24} />
        <motion.div 
          className="ping-animation"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="whatsapp-widget"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <div className="whatsapp-header">
              <div className="business-info">
                <div className="avatar">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4>{businessName}</h4>
                  <span className="online-status">
                    <div className="status-dot"></div>
                    Online
                  </span>
                </div>
              </div>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="whatsapp-body">
              <div className="welcome-message">
                <p>Hello! 👋</p>
                <p>Welcome to TechStore! We're here to help you with any questions about our products and services.</p>
                
                <div className="business-hours">
                  <Clock size={14} />
                  <span>{businessHours}</span>
                </div>

                <div className="contact-methods">
                  <div className="contact-item">
                    <Phone size={14} />
                    <span>+254 (740463021) </span>
                  </div>
                  <div className="contact-item">
                    <Mail size={14} />
                    <span>support@techstore.com</span>
                  </div>
                </div>
              </div>
              
              <div className="quick-questions">
                <p className="section-title">Quick questions:</p>
                <div className="quick-buttons">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setMessage(question.message)}
                      className="quick-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="whatsapp-footer">
              <div className="message-input-container">
                <div className="message-input">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <motion.button 
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="send-btn"
                    disabled={!message.trim()}
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
                <p className="disclaimer">
                  You'll be redirected to WhatsApp to send this message
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppWidget;
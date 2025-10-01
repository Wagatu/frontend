import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Headphones } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import AnimatedSection from '../../components/Animation/AnimatedSection';
import './Home.css';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "MacBook Pro 14\"",
      price: 1999,
      originalPrice: 2199,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      category: "Laptops",
      rating: 4.8,
      description: "Supercharged by M3 Pro or M3 Max chip for exceptional performance",
      specs: ["M3 Pro chip", "16GB RAM", "1TB SSD", "Liquid Retina XDR"],
      discount: 10
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      category: "Phones",
      rating: 4.9,
      description: "The ultimate iPhone experience with titanium design",
      specs: ["A17 Pro chip", "128GB Storage", "Titanium", "Pro camera"]
    },
    {
      id: 3,
      name: "Samsung Galaxy S24 Ultra",
      price: 1199,
      originalPrice: 1299,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      category: "Phones",
      rating: 4.7,
      description: "Ultimate productivity and creativity in your hand",
      specs: ["Snapdragon 8 Gen 3", "256GB", "S Pen", "200MP Camera"],
      discount: 8
    },
    {
      id: 4,
      name: "AirPods Pro (2nd Gen)",
      price: 249,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
      category: "Accessories",
      rating: 4.6,
      description: "Active Noise Cancellation and Adaptive Transparency",
      specs: ["H2 chip", "ANC", "6hr battery", "MagSafe Charging"]
    },
    {
      id: 5,
      name: "iPad Air M1",
      price: 749,
      originalPrice: 799,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      category: "Tablets",
      rating: 4.5,
      description: "Powerful. Colorful. Wonderful.",
      specs: ["M1 chip", "64GB Storage", "10.9\" Display", "Touch ID"],
      discount: 6
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      price: 399,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      category: "Accessories",
      rating: 4.8,
      description: "Industry-leading noise cancellation with 30hr battery",
      specs: ["Industry ANC", "30hr battery", "Touch Control", "Quick Charge"]
    }
  ];

  const features = [
    {
      icon: <Shield size={40} />,
      title: "Secure Payment",
      description: "100% secure payment processing with encryption"
    },
    {
      icon: <Truck size={40} />,
      title: "Fast Delivery",
      description: "Free delivery on orders above $499"
    },
    {
      icon: <Headphones size={40} />,
      title: "24/7 Support",
      description: "Round the clock customer support via WhatsApp"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Latest Tech <span className="highlight">Gadgets</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover the best laptops, phones, and accessories at unbeatable prices. 
                Free delivery and 24/7 customer support included.
              </motion.p>
              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/products" className="btn btn-primary">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <button className="btn btn-secondary">Learn More</button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=500&fit=crop" 
                alt="Tech Products" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <AnimatedSection>
            <h2>Why Choose TechStore?</h2>
          </AnimatedSection>
          <div className="features-grid">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className="feature-card"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products" id="products">
        <div className="container">
          <AnimatedSection>
            <div className="section-header">
              <h2>Featured Products</h2>
              <p>Check out our most popular tech gadgets</p>
              <Link to="/products" className="view-all-btn">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
          
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <AnimatedSection>
            <div className="cta-content">
              <h2>Ready to Upgrade Your Tech?</h2>
              <p>Join thousands of satisfied customers who trust TechStore for their electronics needs</p>
              <div className="cta-actions">
                <Link to="/products" className="btn btn-primary">
                  Start Shopping
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Create Account
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
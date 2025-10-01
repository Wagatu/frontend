import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import './ProductCard.css';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, index }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
  e.stopPropagation();
  addToCart(product, 1);
  
  console.log('Added to cart:', product.name);
};

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view:', product.name);
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <div className="product-image">
        <img 
          src={product.image} 
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {!imageLoaded && <div className="image-skeleton"></div>}
        
        <div className="product-actions">
          <motion.button 
            className={`action-btn wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button 
            className="action-btn quickview-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleQuickView}
          >
            <Eye size={18} />
          </motion.button>
        </div>

        {product.discount && (
          <div className="discount-badge">-{product.discount}%</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating) ? '#ffc107' : 'none'} 
                color="#ffc107"
              />
            ))}
          </div>
          <span className="rating-value">({product.rating})</span>
        </div>

        <div className="product-specs">
          {product.specs.slice(0, 2).map((spec, i) => (
            <span key={i} className="spec-tag">{spec}</span>
          ))}
          {product.specs.length > 2 && (
            <span className="spec-tag">+{product.specs.length - 2} more</span>
          )}
        </div>

        <div className="product-footer">
          <div className="product-pricing">
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
            <span className="current-price">${product.price}</span>
          </div>
          <motion.button 
            className="add-to-cart-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
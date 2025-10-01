import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { 
                  ...item, 
                  quantity: item.quantity + (action.payload.quantity || 1),
                  // Ensure we have all required product data
                  ...(action.payload.price && { price: action.payload.price }),
                  ...(action.payload.name && { name: action.payload.name }),
                  ...(action.payload.image && { image: action.payload.image })
                }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { 
          ...action.payload, 
          quantity: action.payload.quantity || 1 
        }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    case 'VERIFY_CART_ITEMS':
      // This action can be used to verify cart items against the database
      return {
        ...state,
        items: state.items.filter(item => action.payload.validIds.includes(item.id))
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('techstore_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate that we have proper cart data
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted cart data
      localStorage.removeItem('techstore_cart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('techstore_cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    // Validate product data before adding to cart
    if (!product || !product.id) {
      console.error('Invalid product: missing ID');
      return;
    }

    if (!product.price || !product.name) {
      console.error('Invalid product: missing required fields');
      return;
    }

    console.log('Adding to cart:', product.id, product.name);

    dispatch({
      type: 'ADD_TO_CART',
      payload: { 
        id: product.id, // This should be the UUID from database
        name: product.name,
        price: parseFloat(product.price), // Ensure it's a number
        image: product.image,
        brand: product.brand,
        category: product.category,
        sku: product.sku,
        quantity: parseInt(quantity, 10)
      }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
  };

  const updateQuantity = (productId, quantity) => {
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity < 0) {
      console.error('Invalid quantity');
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity: numQuantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQuantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => {
      const itemQuantity = parseInt(item.quantity) || 0;
      return count + itemQuantity;
    }, 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.id === productId);
  };

  const verifyCartItems = (validProductIds) => {
    dispatch({
      type: 'VERIFY_CART_ITEMS',
      payload: { validIds: validProductIds }
    });
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getCartItem,
    verifyCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
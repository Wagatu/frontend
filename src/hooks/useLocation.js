import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's current location using browser geolocation
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  // Calculate shipping cost
  const calculateShipping = async (address, orderValue, deliveryOption = 'standard') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/location/shipping-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          orderValue,
          deliveryOption
        }),
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Find nearest store
  const findNearestStore = async (address) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/location/nearest-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (data.success) {
        return data.data.store;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get all stores
  const getStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/location/stores');
      const data = await response.json();

      if (data.success) {
        return data.data.stores;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);
        const location = await getUserLocation();
        setUserLocation(location);
      } catch (error) {
        console.log('Location detection failed:', error.message);
        // Don't set error state for auto-detection failures
      } finally {
        setLoading(false);
      }
    };

    detectLocation();
  }, []);

  return {
    userLocation,
    loading,
    error,
    calculateShipping,
    findNearestStore,
    getStores,
    getUserLocation
  };
};
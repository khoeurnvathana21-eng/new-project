// ============================================================
// BootZone Client - Cart Context
// File: client/src/context/CartContext.jsx
// Syncs cart with backend when logged in, else uses localStorage
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cartService } from '../services/shopService.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

const LOCAL_KEY = 'bz_guest_cart';

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart
  const loadCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const { data } = await cartService.getCart();
        setItems(data.items);
      } catch (err) {
        console.error('Failed to load cart', err);
      }
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      setItems(local);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Merge guest cart into server cart on login
  useEffect(() => {
    if (isAuthenticated) {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      if (local.length > 0) {
        Promise.all(local.map((it) => cartService.addToCart(it)))
          .then(() => {
            localStorage.removeItem(LOCAL_KEY);
            loadCart();
          })
          .catch(() => {});
      } else {
        loadCart();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = useCallback(async (product, quantity = 1, size = null) => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        await cartService.addToCart({ product_id: product.id, quantity, size });
        await loadCart();
        toast.success(`${product.name} added to cart`);
      } catch (err) {
        toast.error(err.message || 'Failed to add to cart');
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart stored locally
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      const idx = local.findIndex((i) => i.product_id === product.id && i.size === size);
      if (idx >= 0) {
        local[idx].quantity += quantity;
      } else {
        local.push({
          product_id: product.id,
          product_id_num: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          brand_name: product.brand_name,
          quantity,
          size,
        });
      }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
      setItems(local);
      toast.success(`${product.name} added to cart`);
    }
  }, [isAuthenticated, loadCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        await cartService.updateCartItem(itemId, quantity);
        await loadCart();
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      const idx = local.findIndex((i) => i.product_id === itemId);
      if (idx >= 0) {
        if (quantity <= 0) {
          local.splice(idx, 1);
        } else {
          local[idx].quantity = quantity;
        }
        localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
        setItems(local);
      }
    }
  }, [isAuthenticated, loadCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(itemId);
        await loadCart();
        toast.success('Item removed');
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      const filtered = local.filter((i) => i.product_id !== itemId);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
      setItems(filtered);
      toast.success('Item removed');
    }
  }, [isAuthenticated, loadCart]);

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try { await cartService.clearCart(); } catch {}
    } else {
      localStorage.removeItem(LOCAL_KEY);
    }
    setItems([]);
  }, [isAuthenticated]);

  // Compute totals
  const count = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0);

  const value = {
    items,
    count,
    subtotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

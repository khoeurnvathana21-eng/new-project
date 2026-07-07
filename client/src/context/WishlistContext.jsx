// ============================================================
// BootZone Client - Wishlist Context
// File: client/src/context/WishlistContext.jsx
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { wishlistService } from '../services/shopService.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);
export const useWishlist = () => useContext(WishlistContext);

const LOCAL_KEY = 'bz_guest_wishlist';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [ids, setIds] = useState(new Set());

  const loadWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const { data } = await wishlistService.getWishlist();
        setItems(data.items);
        setIds(new Set(data.items.map((i) => i.id)));
      } catch {}
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      setItems(local);
      setIds(new Set(local.map((i) => i.id)));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const toggle = useCallback(async (product) => {
    if (isAuthenticated) {
      try {
        const { data } = await wishlistService.toggleWishlist(product.id);
        if (data.inWishlist) {
          toast.success('Added to wishlist');
        } else {
          toast.success('Removed from wishlist');
        }
        await loadWishlist();
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      const idx = local.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        local.splice(idx, 1);
        toast.success('Removed from wishlist');
      } else {
        local.push(product);
        toast.success('Added to wishlist');
      }
      localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
      setItems(local);
      setIds(new Set(local.map((i) => i.id)));
    }
  }, [isAuthenticated, loadWishlist]);

  const isInWishlist = useCallback((productId) => ids.has(productId), [ids]);

  const value = {
    items,
    count: items.length,
    toggle,
    isInWishlist,
    refreshWishlist: loadWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

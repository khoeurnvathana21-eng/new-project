// ============================================================
// BootZone Client - useScrollToTop Hook
// File: client/src/hooks/useScrollToTop.js
// Scrolls to top on route change
// ============================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
};

export default useScrollToTop;

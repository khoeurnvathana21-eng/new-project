// ============================================================
// BootZone Client - Public Layout
// File: client/src/layouts/PublicLayout.jsx
// Wraps public pages with Navbar + Footer + announcement bar
// ============================================================

import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AnnouncementBar from '../components/AnnouncementBar.jsx';

const PublicLayout = () => {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-ink-950">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

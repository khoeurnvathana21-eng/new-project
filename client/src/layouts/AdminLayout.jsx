// ============================================================
// BootZone Client - Admin Layout
// File: client/src/layouts/AdminLayout.jsx
// Sidebar + topbar shell for admin dashboard
// ============================================================

import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiGrid, FiBox, FiShoppingBag, FiUsers, FiTag, FiStar,
  FiLogOut, FiMenu, FiX, FiExternalLink
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-ink-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-800 px-6">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-wide text-flame-500">BZ</span>
            <span className="text-sm font-semibold uppercase tracking-widest text-ink-300">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active ? 'bg-flame-600 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-ink-800 p-4">
          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
          >
            <FiExternalLink className="h-5 w-5" />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-300 hover:bg-ink-800 hover:text-white"
          >
            <FiLogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white px-4 dark:border-ink-800 dark:bg-ink-900 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <FiMenu className="h-6 w-6 text-ink-900 dark:text-white" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-ink-900 dark:text-white">
              Welcome back, {user?.first_name || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-flame-500 text-sm font-bold text-white">
              {(user?.first_name?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

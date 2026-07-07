// ============================================================
// BootZone Client - Navbar
// File: client/src/components/Navbar.jsx
// Sticky responsive navigation with mega menu + cart badge
// ============================================================

import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiChevronDown, FiSun, FiMoon
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const brands = [
  { name: 'Nike', slug: 'nike', tagline: 'Speed & innovation' },
  { name: 'Adidas', slug: 'adidas', tagline: 'Control & comfort' },
  { name: 'Puma', slug: 'puma', tagline: 'Agility & flair' },
  { name: 'Mizuno', slug: 'mizuno', tagline: 'Japanese craftsmanship' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-ink-100 shadow-sm dark:border-ink-800 dark:bg-ink-950/80'
          : 'bg-white dark:bg-ink-950'
      }`}
    >
      <nav className="container-bz flex h-16 items-center justify-between gap-4 lg:h-18">
        {/* Left: mobile menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-3xl tracking-tight text-ink-900 dark:text-white">
              Boot<span className="text-flame-500">Zone</span>
            </span>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-flame-600' : 'text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
              }`
            }
          >
            Home
          </NavLink>

          {/* Brands dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white">
              Brands
              <FiChevronDown className="h-4 w-4" />
            </button>
            {brandsOpen && (
              <div className="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-ink-100 bg-white p-3 shadow-cardHover dark:border-ink-800 dark:bg-ink-900">
                  {brands.map((b) => (
                    <Link
                      key={b.slug}
                      to={`/products?brand=${b.slug}`}
                      className="group rounded-xl p-4 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
                    >
                      <div className="text-sm font-semibold text-ink-900 group-hover:text-flame-600 dark:text-white">
                        {b.name}
                      </div>
                      <div className="text-xs text-ink-500 dark:text-ink-400">{b.tagline}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-flame-600' : 'text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
              }`
            }
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-flame-600' : 'text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-flame-600' : 'text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label="Search"
          >
            <FiSearch className="h-5 w-5" />
          </button>

          <Link
            to="/wishlist"
            className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label="Wishlist"
          >
            <FiHeart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-flame-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            aria-label="Cart"
          >
            <FiShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-flame-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="group relative">
              <button className="ml-1 flex items-center gap-2 rounded-full p-1 hover:bg-ink-100 dark:hover:bg-ink-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white dark:bg-flame-600">
                  {user?.first_name?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
              <div className="invisible absolute right-0 top-full w-56 translate-y-1 rounded-2xl border border-ink-100 bg-white p-2 opacity-0 shadow-cardHover transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-ink-800 dark:bg-ink-900">
                <div className="border-b border-ink-100 px-3 py-2 dark:border-ink-800">
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="truncate text-xs text-ink-500 dark:text-ink-400">{user?.email}</div>
                </div>
                <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">My Profile</Link>
                <Link to="/orders" className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">My Orders</Link>
                <Link to="/wishlist" className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Wishlist</Link>
                {isAdmin && (
                  <Link to="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-flame-600 hover:bg-flame-50 dark:hover:bg-ink-800">Admin Dashboard</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 hidden rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-flame-600 sm:inline-flex dark:bg-white dark:text-ink-900"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Search drawer */}
      {searchOpen && (
        <div className="border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-950">
          <form onSubmit={handleSearch} className="container-bz py-4">
            <div className="flex items-center gap-3 rounded-full border border-ink-200 px-5 py-3 focus-within:border-ink-900 dark:border-ink-700 dark:focus-within:border-white">
              <FiSearch className="h-5 w-5 text-ink-400" />
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search boots, brands, surfaces..."
                className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder-ink-400 dark:text-white"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <FiX className="h-5 w-5 text-ink-400 hover:text-ink-900 dark:hover:text-white" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white p-6 shadow-xl dark:bg-ink-950">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-2xl text-ink-900 dark:text-white">
                Boot<span className="text-flame-500">Zone</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Home</NavLink>
              <NavLink to="/products" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Shop All</NavLink>
              <div className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Brands</div>
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  to={`/products?brand=${b.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800"
                >
                  {b.name}
                </Link>
              ))}
              <div className="mt-2 border-t border-ink-100 pt-2 dark:border-ink-800">
                <NavLink to="/about" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">About</NavLink>
                <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Contact</NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Profile</NavLink>
                    <NavLink to="/orders" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Orders</NavLink>
                    {isAdmin && (
                      <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-flame-600 hover:bg-flame-50 dark:hover:bg-ink-800">Admin</NavLink>
                    )}
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-2 block rounded-full bg-ink-900 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-white dark:text-ink-900">Sign In</Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

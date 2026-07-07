// ============================================================
// BootZone Client - Cart Page
// File: client/src/pages/Cart.jsx
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiArrowLeft, FiTag
} from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatPrice, primaryImage } from '../utils/helpers.js';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, subtotal, count, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyPromo = (e) => {
    e.preventDefault();
    if (promo.toUpperCase() === 'BOOT10') {
      setDiscount(subtotal * 0.1);
      toast.success('Promo code applied: 10% off!');
    } else {
      toast.error('Invalid promo code');
      setDiscount(0);
    }
  };

  const shipping = subtotal > 150 ? 0 : (subtotal > 0 ? 12 : 0);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (count === 0) {
    return (
      <div className="container-bz py-20">
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any boots yet. Let's fix that."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen dark:bg-ink-950">
      <div className="container-bz py-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight text-ink-900 dark:text-white">Your Cart</h1>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{count} {count === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <Link to="/products" className="hidden items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white sm:flex">
            <FiArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={`${item.id || item.product_id}-${item.size}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card-bz p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  <Link
                    to={`/products/${item.slug}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800 sm:h-28 sm:w-28"
                  >
                    <img
                      src={primaryImage(item)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                          {item.brand_name}
                        </div>
                        <Link
                          to={`/products/${item.slug}`}
                          className="text-sm font-semibold text-ink-900 hover:text-flame-600 dark:text-white"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <div className="mt-1 text-xs text-ink-500 dark:text-ink-400">Size UK: {item.size}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id || item.product_id)}
                        className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 hover:text-red-500 dark:hover:bg-ink-800"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-ink-200 dark:border-ink-700">
                        <button
                          onClick={() => updateQuantity(item.id || item.product_id, (item.quantity || 1) - 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                        >
                          <FiMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id || item.product_id, (item.quantity || 1) + 1)}
                          className="flex h-9 w-9 items-center justify-center text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                        >
                          <FiPlus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ink-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-ink-500 dark:text-ink-400">{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white sm:hidden">
              <FiArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-bz p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white">
                Order Summary
              </h3>

              {/* Promo */}
              <form onSubmit={applyPromo} className="mb-5">
                <label className="label-bz">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      type="text"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="BOOT10"
                      className="w-full rounded-xl border border-ink-200 py-2.5 pl-9 pr-3 text-sm focus:border-ink-900 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:focus:border-white"
                    />
                  </div>
                  <button type="submit" className="rounded-xl bg-ink-100 px-4 text-sm font-semibold text-ink-900 hover:bg-ink-200 dark:bg-ink-800 dark:text-white dark:hover:bg-ink-700">
                    Apply
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-ink-400">Try "BOOT10" for 10% off</p>
              </form>

              {/* Totals */}
              <div className="space-y-3 border-t border-ink-100 pt-4 text-sm dark:border-ink-800">
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Subtotal</span>
                  <span className="font-medium text-ink-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-pitch-600">
                    <span>Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Shipping</span>
                  <span className="font-medium text-ink-900 dark:text-white">
                    {shipping === 0 ? <span className="text-pitch-600">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Tax (8%)</span>
                  <span className="font-medium text-ink-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
                {shipping > 0 && (
                  <div className="rounded-xl bg-flame-50 p-3 text-xs text-flame-700 dark:bg-flame-900/20 dark:text-flame-400">
                    Add {formatPrice(150 - subtotal)} more to get FREE shipping!
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
                <span className="text-base font-bold text-ink-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-ink-900 dark:text-white">{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary mt-6 w-full"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
                <FiArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 text-center text-xs text-ink-500 dark:text-ink-400">
                Secure checkout · 30-day returns · 100% authentic
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

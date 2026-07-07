// ============================================================
// BootZone Client - Checkout Page
// File: client/src/pages/Checkout.jsx
// ============================================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiArrowLeft, FiCreditCard, FiCheck, FiTruck, FiShield, FiLoader, FiSmartphone
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { orderService } from '../services/shopService.js';
import { formatPrice, primaryImage } from '../utils/helpers.js';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States',
    },
  });

  const shipping = subtotal > 150 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((it) => ({
        product_id: it.product_id,
        size: it.size,
        quantity: it.quantity,
      }));
      const { data: res } = await orderService.createOrder({
        items: orderItems,
        shipping_address: data,
        payment_method: paymentMethod,
        notes: data.notes || '',
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-bz py-20 text-center">
        <h2 className="font-display text-3xl text-ink-900 dark:text-white">Your cart is empty</h2>
        <Link to="/products" className="btn-primary mt-6">Browse Boots</Link>
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen dark:bg-ink-950">
      <div className="container-bz py-10">
        <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
          <FiArrowLeft className="h-4 w-4" /> Back to cart
        </Link>

        <h1 className="mb-8 font-display text-4xl tracking-tight text-ink-900 dark:text-white">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
          {/* Left: Form fields */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping */}
            <div className="card-bz p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white dark:bg-white dark:text-ink-900">1</div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white">Shipping Address</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-bz">First Name</label>
                  <input {...register('first_name', { required: 'Required' })} className="input-bz" />
                  {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="label-bz">Last Name</label>
                  <input {...register('last_name', { required: 'Required' })} className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">Email</label>
                  <input type="email" {...register('email', { required: 'Required' })} className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">Phone</label>
                  <input type="tel" {...register('phone')} className="input-bz" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-bz">Street Address</label>
                  <input {...register('address', { required: 'Required' })} placeholder="123 Main St, Apt 4" className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">City</label>
                  <input {...register('city', { required: 'Required' })} className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">State / Province</label>
                  <input {...register('state', { required: 'Required' })} className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">ZIP / Postal Code</label>
                  <input {...register('zip', { required: 'Required' })} className="input-bz" />
                </div>
                <div>
                  <label className="label-bz">Country</label>
                  <input {...register('country', { required: 'Required' })} className="input-bz" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card-bz p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white dark:bg-white dark:text-ink-900">2</div>
                <h3 className="text-base font-bold text-ink-900 dark:text-white">Payment Method</h3>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: FiTruck },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: FiCreditCard },
                  { id: 'qr', label: 'QR Code Payment', desc: 'Scan with your banking app (KHQR)', icon: FiSmartphone },
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                        paymentMethod === method.id ? 'border-ink-900 bg-ink-50 dark:border-white dark:bg-ink-800' : 'border-ink-200 hover:border-ink-400 dark:border-ink-700 dark:hover:border-ink-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="h-4 w-4 accent-ink-900"
                      />
                      <Icon className="h-6 w-6 text-ink-700 dark:text-ink-300" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-ink-900 dark:text-white">{method.label}</div>
                        <div className="text-xs text-ink-500 dark:text-ink-400">{method.desc}</div>
                      </div>
                      {paymentMethod === method.id && <FiCheck className="h-5 w-5 text-flame-600" />}
                    </label>
                  );
                })}
              </div>

              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 grid gap-4 rounded-xl bg-ink-50 p-4 sm:grid-cols-2 dark:bg-ink-800"
                >
                  <div className="sm:col-span-2">
                    <label className="label-bz">Card Number</label>
                    <input placeholder="4242 4242 4242 4242" className="input-bz" />
                  </div>
                  <div>
                    <label className="label-bz">Expiry</label>
                    <input placeholder="MM / YY" className="input-bz" />
                  </div>
                  <div>
                    <label className="label-bz">CVC</label>
                    <input placeholder="123" className="input-bz" />
                  </div>
                  <p className="sm:col-span-2 text-xs text-ink-500 dark:text-ink-400">
                    <FiShield className="mr-1 inline h-3 w-3" /> This is a demo — no real payment will be processed.
                  </p>
                </motion.div>
              )}

              {paymentMethod === 'qr' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 flex flex-col items-center gap-4 rounded-xl bg-ink-50 p-6 text-center dark:bg-ink-800"
                >
                  <img
                    src="/images/photo_2026-07-06_17-46-53.jpg"
                    alt="ABA PAY KHQR code"
                    className="h-auto w-56 rounded-xl border border-ink-200 shadow-card dark:border-ink-700"
                  />
                  <div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-white">
                      Scan to pay {formatPrice(total)}
                    </div>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                      Open your ABA Mobile, Wing, or any Bakong KHQR-enabled banking app and scan this code to complete payment.
                    </p>
                  </div>
                  <p className="text-xs text-ink-500 dark:text-ink-400">
                    <FiShield className="mr-1 inline h-3 w-3" /> After paying, click "Place Order" below to confirm.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-bz p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white">Order Summary</h3>

              <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id || item.product_id}-${item.size}`} className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800">
                      <img src={primaryImage(item)} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col text-xs">
                      <div className="font-semibold text-ink-900 line-clamp-1 dark:text-white">{item.name}</div>
                      <div className="text-ink-500 dark:text-ink-400">Qty: {item.quantity}{item.size ? ` · Size ${item.size}` : ''}</div>
                      <div className="mt-auto font-bold text-ink-900 dark:text-white">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-ink-100 pt-4 text-sm dark:border-ink-800">
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Subtotal</span>
                  <span className="font-medium text-ink-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Shipping</span>
                  <span className="font-medium text-ink-900 dark:text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600 dark:text-ink-400">Tax</span>
                  <span className="font-medium text-ink-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
                <span className="text-base font-bold text-ink-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-ink-900 dark:text-white">{formatPrice(total)}</span>
              </div>

              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
                {loading ? (
                  <><FiLoader className="h-4 w-4 animate-spin" /> Placing Order...</>
                ) : (
                  <>Place Order <FiCheck className="h-4 w-4" /></>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-500 dark:text-ink-400">
                <span className="flex items-center gap-1"><FiShield className="h-3 w-3" /> Secure</span>
                <span className="flex items-center gap-1"><FiTruck className="h-3 w-3" /> Fast Shipping</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

// ============================================================
// BootZone Client - Orders Page
// File: client/src/pages/Orders.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiChevronDown, FiChevronUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import { orderService } from '../services/shopService.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatPrice, formatDate, primaryImage } from '../utils/helpers.js';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-pitch-50 text-pitch-700',
  cancelled: 'bg-red-50 text-red-700',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    orderService.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <Loader size="lg" label="Loading your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="container-bz py-20">
        <EmptyState
          icon={FiPackage}
          title="No orders yet"
          description="When you place your first order, it'll show up here."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen dark:bg-ink-950">
      <div className="container-bz py-10">
        <h1 className="mb-8 font-display text-4xl tracking-tight text-ink-900 dark:text-white">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card-bz overflow-hidden"
            >
              {/* Order header */}
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-ink-50 dark:hover:bg-ink-800"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-800">
                    {order.order_status === 'delivered' ? (
                      <FiCheckCircle className="h-5 w-5 text-pitch-600" />
                    ) : (
                      <FiClock className="h-5 w-5 text-ink-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900 dark:text-white">{order.order_number}</div>
                    <div className="text-xs text-ink-500 dark:text-ink-400">{formatDate(order.created_at)} · {order.items?.length || 0} items</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge-bz ${statusColors[order.order_status] || 'bg-ink-100 text-ink-700'}`}>
                    {order.order_status}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink-900 dark:text-white">{formatPrice(order.total_amount)}</div>
                  </div>
                  {expanded === order.id ? <FiChevronUp className="h-5 w-5 text-ink-400" /> : <FiChevronDown className="h-5 w-5 text-ink-400" />}
                </div>
              </button>

              {/* Expanded items */}
              {expanded === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-ink-100 bg-ink-50/50 p-5 dark:border-ink-800 dark:bg-ink-900/50"
                >
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-3 dark:bg-ink-900">
                        <div className="h-16 w-16 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                          ) : (
                            <img src={primaryImage({})} alt={item.product_name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-ink-900 dark:text-white">{item.product_name}</div>
                          <div className="text-xs text-ink-500 dark:text-ink-400">Qty: {item.quantity}{item.size ? ` · Size ${item.size}` : ''}</div>
                        </div>
                        <div className="text-sm font-bold text-ink-900 dark:text-white">{formatPrice(item.unit_price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-white p-4 dark:bg-ink-900">
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">Shipping Address</div>
                      <div className="mt-2 text-sm text-ink-700 dark:text-ink-300">
                        {order.shipping_address?.address}<br />
                        {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}<br />
                        {order.shipping_address?.country}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 dark:bg-ink-900">
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">Payment</div>
                      <div className="mt-2 text-sm text-ink-700 dark:text-ink-300">
                        Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card'}<br />
                        Status: <span className="font-semibold capitalize">{order.payment_status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-ink-200 pt-4 dark:border-ink-700">
                    <span className="text-sm font-bold text-ink-900 dark:text-white">Total</span>
                    <span className="text-base font-bold text-ink-900 dark:text-white">{formatPrice(order.total_amount)}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;

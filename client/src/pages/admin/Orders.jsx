// ============================================================
// BootZone Admin - Orders Management
// File: client/src/pages/admin/Orders.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { orderService } from '../../services/shopService.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatPrice, formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentOptions = ['pending', 'paid', 'failed', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getAllOrders({ status: statusFilter, limit: 50 });
      setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const handleStatusChange = async (orderId, orderStatus, paymentStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { order_status: orderStatus, payment_status: paymentStatus });
      toast.success('Order updated');
      loadOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader size="lg" label="Loading orders..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-ink-900">Orders</h1>
          <p className="mt-1 text-sm text-ink-500">Manage customer orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-bz max-w-xs"
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={FiShoppingBag} title="No orders found" description="Orders will appear here once customers start buying." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-bz overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-ink-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-xs font-bold text-ink-900">
                    //{order.id}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink-900">{order.order_number}</div>
                    <div className="text-xs text-ink-500">
                      {order.first_name} {order.last_name} · {formatDate(order.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge-bz bg-ink-100 text-ink-700 capitalize">{order.order_status}</span>
                  <div className="text-sm font-bold text-ink-900">{formatPrice(order.total_amount)}</div>
                  {expanded === order.id ? <FiChevronUp className="h-5 w-5 text-ink-400" /> : <FiChevronDown className="h-5 w-5 text-ink-400" />}
                </div>
              </button>

              {expanded === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-ink-100 bg-ink-50/50 p-5"
                >
                  {/* Customer info */}
                  <div className="mb-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Customer</div>
                      <div className="mt-1 text-sm text-ink-900">{order.first_name} {order.last_name}</div>
                      <div className="text-xs text-ink-500">{order.email}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Payment</div>
                      <div className="mt-1 text-sm text-ink-900 capitalize">{order.payment_method}</div>
                      <div className="text-xs text-ink-500 capitalize">Status: {order.payment_status}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Date</div>
                      <div className="mt-1 text-sm text-ink-900">{formatDate(order.created_at)}</div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-xl bg-white p-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-ink-100">
                          {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-ink-900">{item.product_name}</div>
                          <div className="text-xs text-ink-500">Qty: {item.quantity}{item.size ? ` · Size ${item.size}` : ''}</div>
                        </div>
                        <div className="text-sm font-bold text-ink-900">{formatPrice(item.unit_price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Status controls */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label-bz">Order Status</label>
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value, order.payment_status)}
                        className="input-bz"
                      >
                        {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-bz">Payment Status</label>
                      <select
                        value={order.payment_status}
                        onChange={(e) => handleStatusChange(order.id, order.order_status, e.target.value)}
                        className="input-bz"
                      >
                        {paymentOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between border-t border-ink-200 pt-4">
                    <span className="text-sm font-bold text-ink-900">Total</span>
                    <span className="text-base font-bold text-ink-900">{formatPrice(order.total_amount)}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

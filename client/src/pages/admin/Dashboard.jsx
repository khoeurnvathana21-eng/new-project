// ============================================================
// BootZone Admin - Dashboard Page
// File: client/src/pages/admin/Dashboard.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiShoppingBag, FiUsers, FiBox, FiAlertTriangle,
  FiArrowUp, FiArrowDown, FiDollarSign
} from 'react-icons/fi';
import { dashboardService } from '../../services/shopService.js';
import Loader from '../../components/Loader.jsx';
import { formatPrice } from '../../utils/helpers.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getRevenue(),
      dashboardService.getTopProducts(),
      dashboardService.getOrderStatus(),
    ])
      .then(([statsRes, revRes, topRes, statusRes]) => {
        setStats(statsRes.data.stats);
        setRevenue(revRes.data.revenue);
        setTopProducts(topRes.data.products);
        setOrderStatus(statusRes.data.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" label="Loading dashboard..." />;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.total_revenue || 0), icon: FiDollarSign, change: '+12.5%', up: true, color: 'bg-pitch-50 text-pitch-600' },
    { label: 'Total Orders', value: stats?.total_orders || 0, icon: FiShoppingBag, change: '+8.2%', up: true, color: 'bg-blue-50 text-blue-600' },
    { label: 'Customers', value: stats?.total_users || 0, icon: FiUsers, change: '+5.1%', up: true, color: 'bg-purple-50 text-purple-600' },
    { label: 'Products', value: stats?.total_products || 0, icon: FiBox, change: '0%', up: null, color: 'bg-flame-50 text-flame-600' },
  ];

  const maxRevenue = Math.max(...revenue.map((r) => Number(r.revenue)), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="card-bz p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {stat.up !== null && (
                  <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-pitch-600' : 'text-red-600'}`}>
                    {stat.up ? <FiArrowUp className="h-3 w-3" /> : <FiArrowDown className="h-3 w-3" />}
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4 text-2xl font-bold text-ink-900">{stat.value}</div>
              <div className="text-xs text-ink-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-bz flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FiAlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-ink-900">{stats?.low_stock || 0} Low Stock Items</div>
            <div className="text-xs text-ink-500">Products with less than 10 units</div>
          </div>
        </div>
        <div className="card-bz flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-ink-900">{stats?.pending_orders || 0} Pending Orders</div>
            <div className="text-xs text-ink-500">Awaiting processing</div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-bz p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-ink-900">Revenue Overview</h3>
              <p className="text-xs text-ink-500">Monthly revenue for the last 12 months</p>
            </div>
            <FiTrendingUp className="h-5 w-5 text-pitch-600" />
          </div>
          <div className="flex h-56 items-end justify-between gap-2">
            {revenue.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm text-ink-400">No data yet</div>
            ) : (
              revenue.map((r) => (
                <div key={r.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-[10px] font-semibold text-ink-700">
                    {Number(r.revenue) > 0 ? `$${Math.round(Number(r.revenue) / 1000)}k` : ''}
                  </div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-flame-600 to-flame-400 transition-all hover:opacity-80"
                    style={{ height: `${(Number(r.revenue) / maxRevenue) * 180}px`, minHeight: '4px' }}
                    title={`${r.month}: ${formatPrice(r.revenue)}`}
                  />
                  <div className="text-[10px] text-ink-500">
                    {new Date(r.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-bz p-6">
          <h3 className="mb-6 text-base font-bold text-ink-900">Order Status</h3>
          <div className="space-y-4">
            {orderStatus.map((s) => {
              const total = orderStatus.reduce((sum, x) => sum + x.count, 0);
              const pct = total > 0 ? (s.count / total) * 100 : 0;
              const colors = {
                pending: 'bg-amber-500',
                processing: 'bg-blue-500',
                shipped: 'bg-purple-500',
                delivered: 'bg-pitch-500',
                cancelled: 'bg-red-500',
              };
              return (
                <div key={s.order_status}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium capitalize text-ink-700">{s.order_status}</span>
                    <span className="text-ink-500">{s.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full rounded-full ${colors[s.order_status] || 'bg-ink-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {orderStatus.length === 0 && <div className="text-sm text-ink-400">No orders yet</div>}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card-bz p-6">
        <h3 className="mb-6 text-base font-bold text-ink-900">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wider text-ink-500">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.id} className="border-b border-ink-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-ink-100">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
                      </div>
                      <span className="font-medium text-ink-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-ink-700">{formatPrice(p.price)}</td>
                  <td className="py-3">
                    <span className={`badge-bz ${p.stock < 10 ? 'bg-red-50 text-red-700' : 'bg-pitch-50 text-pitch-700'}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="py-3 font-bold text-ink-900">{p.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

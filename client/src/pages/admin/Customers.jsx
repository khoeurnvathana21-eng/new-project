// ============================================================
// BootZone Admin - Customers Management
// File: client/src/pages/admin/Customers.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { FiSearch, FiUsers, FiTrash2 } from 'react-icons/fi';
import { userService } from '../../services/shopService.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({ search, limit: 50 });
      setUsers(data.users);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer? This cannot be undone.')) return;
    try {
      await userService.deleteUser(id);
      toast.success('Customer deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader size="lg" label="Loading customers..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900">Customers</h1>
        <p className="mt-1 text-sm text-ink-500">Manage registered customers</p>
      </div>

      <div className="relative max-w-md">
        <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-bz pl-12"
        />
      </div>

      {users.length === 0 ? (
        <EmptyState icon={FiUsers} title="No customers found" description="Customers will appear here after they register." />
      ) : (
        <div className="card-bz overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr className="text-left text-xs uppercase tracking-wider text-ink-500">
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-ink-50 hover:bg-ink-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
                          {u.first_name?.[0]}
                        </div>
                        <span className="font-medium text-ink-900">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge-bz ${u.role === 'admin' ? 'bg-flame-50 text-flame-700' : 'bg-ink-100 text-ink-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3">
                      <span className={`badge-bz ${u.is_active ? 'bg-pitch-50 text-pitch-700' : 'bg-red-50 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

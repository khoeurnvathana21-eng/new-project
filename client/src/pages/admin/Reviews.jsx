// ============================================================
// BootZone Admin - Reviews Moderation
// File: client/src/pages/admin/Reviews.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { FiStar, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { reviewService } from '../../services/shopService.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await reviewService.getAllReviews();
      setReviews(data.reviews);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await reviewService.approveReview(id, isApproved);
      toast.success(isApproved ? 'Review approved' : 'Review hidden');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      toast.success('Review deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader size="lg" label="Loading reviews..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink-900">Reviews</h1>
        <p className="mt-1 text-sm text-ink-500">Moderate customer reviews</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={FiStar} title="No reviews yet" description="Customer reviews will appear here for moderation." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="card-bz p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-flame-500 text-flame-500' : 'text-ink-300'}`}
                        />
                      ))}
                    </div>
                    <span className={`badge-bz ${r.is_approved ? 'bg-pitch-50 text-pitch-700' : 'bg-amber-50 text-amber-700'}`}>
                      {r.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-ink-900">{r.title || r.product_name}</h4>
                  <p className="mt-1 text-sm text-ink-600">{r.comment}</p>
                  <div className="mt-2 text-xs text-ink-500">
                    {r.first_name} {r.last_name} on {r.product_name} · {formatDate(r.created_at)}
                  </div>
                </div>
                <div className="flex gap-1">
                  {r.is_approved ? (
                    <button
                      onClick={() => handleApprove(r.id, false)}
                      className="rounded-lg p-2 text-ink-500 hover:bg-amber-50 hover:text-amber-600"
                      title="Hide review"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(r.id, true)}
                      className="rounded-lg p-2 text-ink-500 hover:bg-pitch-50 hover:text-pitch-600"
                      title="Approve review"
                    >
                      <FiCheck className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete review"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

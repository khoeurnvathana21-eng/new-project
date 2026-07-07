// ============================================================
// BootZone Client - Wishlist Page
// File: client/src/pages/Wishlist.jsx
// ============================================================

import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Wishlist = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-bz py-20">
        <EmptyState
          icon={FiHeart}
          title="Your wishlist is empty"
          description="Save your favorite boots here so you can find them again later."
          actionLabel="Browse Boots"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="bg-ink-50 min-h-screen dark:bg-ink-950">
      <div className="container-bz py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl tracking-tight text-ink-900 dark:text-white">My Wishlist</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="mt-8">
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

// ============================================================
// BootZone Client - Product Card
// File: client/src/components/ProductCard.jsx
// Reusable product card with hover effects + quick actions
// ============================================================

import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { formatPrice, discountPercent, primaryImage } from '../utils/helpers.js';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import StarRating from './StarRating.jsx';

const ProductCard = ({ product, index = 0 }) => {
  const { toggle, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);
  const discount = discountPercent(product.price, product.compare_price);
  const image = primaryImage(product);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1, product.sizes?.[0] || null);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
    >
      <Link to={`/products/${product.slug}`} className="group block">
        <div className="relative card-bz overflow-hidden hover:shadow-cardHover">
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {!!product.is_new_arrival && (
              <span className="badge-bz bg-flame-500 text-white">New</span>
            )}
            {discount > 0 && (
              <span className="badge-bz bg-ink-900 text-white">-{discount}%</span>
            )}
            {!!product.is_best_seller && (
              <span className="badge-bz bg-pitch-600 text-white">Best Seller</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-colors ${
              inWishlist ? 'bg-flame-500 text-white' : 'bg-white/80 text-ink-700 hover:bg-white dark:bg-ink-900/80 dark:text-ink-300 dark:hover:bg-ink-900'
            }`}
            aria-label="Toggle wishlist"
          >
            <FiHeart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-ink-50 dark:bg-ink-800">
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Quick add overlay */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
              <button
                onClick={handleQuickAdd}
                disabled={product.stock <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-flame-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiShoppingBag className="h-4 w-4" />
                {product.stock > 0 ? 'Quick Add' : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {product.brand_name}
              </span>
              <StarRating rating={product.rating} size="xs" />
            </div>
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-flame-600 dark:text-white">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-ink-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-xs text-ink-400 line-through dark:text-ink-500">{formatPrice(product.compare_price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

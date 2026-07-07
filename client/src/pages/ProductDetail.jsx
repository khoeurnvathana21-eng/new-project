// ============================================================
// BootZone Client - Product Detail Page
// File: client/src/pages/ProductDetail.jsx
// Image gallery, zoom, size selector, add to cart, reviews
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHeart, FiShoppingBag, FiChevronRight, FiMinus, FiPlus,
  FiTruck, FiShield, FiRefreshCw, FiStar, FiCheck
} from 'react-icons/fi';
import { productService } from '../services/productService.js';
import { reviewService } from '../services/shopService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import StarRating from '../components/StarRating.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatPrice, discountPercent, primaryImage } from '../utils/helpers.js';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [tab, setTab] = useState('description');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setActiveImage(0);
    setSelectedSize(null);
    setQuantity(1);

    const load = async () => {
      try {
        const [{ data: prodData }, { data: relData }] = await Promise.all([
          productService.getProductBySlug(slug),
          productService.getRelatedProducts(slug),
        ]);
        if (!mounted) return;
        setProduct(prodData.product);
        setRelated(relData.products);

        try {
          const { data: revData } = await reviewService.getProductReviews(prodData.product.id);
          if (mounted) setReviews(revData.reviews);
        } catch {}
      } catch (err) {
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    await addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    await addToCart(product, quantity, selectedSize);
    navigate('/cart');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) return <Loader size="lg" label="Loading product..." />;

  if (!product) {
    return (
      <div className="container-bz py-20">
        <EmptyState
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          actionLabel="Back to shop"
          actionTo="/products"
        />
      </div>
    );
  }

  const discount = discountPercent(product.price, product.compare_price);
  const images = product.images?.length ? product.images : [primaryImage(product)];
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white dark:bg-ink-950">
      {/* Breadcrumb */}
      <div className="border-b border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
        <div className="container-bz py-4">
          <nav className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Link to="/" className="hover:text-ink-900 dark:hover:text-white">Home</Link>
            <FiChevronRight className="h-3 w-3" />
            <Link to="/products" className="hover:text-ink-900 dark:hover:text-white">Shop</Link>
            <FiChevronRight className="h-3 w-3" />
            <Link to={`/products?brand=${product.brand_slug}`} className="hover:text-ink-900 dark:hover:text-white">
              {product.brand_name}
            </Link>
            <FiChevronRight className="h-3 w-3" />
            <span className="truncate text-ink-900 dark:text-white">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-bz py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* ===== Image Gallery ===== */}
          <div>
            <div
              className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-ink-50 dark:bg-ink-900"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-200"
                style={zoom ? {
                  transform: `scale(2)`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                } : {}}
              />
              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {!!product.is_new_arrival && (
                  <span className="badge-bz bg-flame-500 text-white">New</span>
                )}
                {discount > 0 && (
                  <span className="badge-bz bg-ink-900 text-white">-{discount}%</span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition-colors ${
                      activeImage === i ? 'border-ink-900 dark:border-white' : 'border-transparent hover:border-ink-300 dark:hover:border-ink-600'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== Product Info ===== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-2 flex items-center gap-3">
              <Link
                to={`/products?brand=${product.brand_slug}`}
                className="text-xs font-bold uppercase tracking-widest text-flame-600 hover:underline"
              >
                {product.brand_name}
              </Link>
              <span className="text-ink-300">·</span>
              <span className="text-xs text-ink-500 dark:text-ink-400">{product.category_name}</span>
            </div>

            <h1 className="font-display text-4xl tracking-tight text-ink-900 lg:text-5xl dark:text-white">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-ink-500 dark:text-ink-400">
                {product.rating > 0 ? product.rating.toFixed(1) : 'No reviews yet'}
                {product.review_count > 0 && ` (${product.review_count} ${product.review_count === 1 ? 'review' : 'reviews'})`}
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-ink-900 dark:text-white">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-lg text-ink-400 line-through">{formatPrice(product.compare_price)}</span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-bold text-flame-700 dark:bg-flame-900/20 dark:text-flame-400">
                  Save {formatPrice(product.compare_price - product.price)}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              {product.description}
            </p>

            {/* Quick specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.surface && (
                <div className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                  <div className="text-xs text-ink-500 dark:text-ink-400">Surface</div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">{product.surface}</div>
                </div>
              )}
              {product.primary_color && (
                <div className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                  <div className="text-xs text-ink-500 dark:text-ink-400">Color</div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-white">{product.primary_color}</div>
                </div>
              )}
              <div className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                <div className="text-xs text-ink-500 dark:text-ink-400">SKU</div>
                <div className="text-sm font-semibold text-ink-900 dark:text-white">{product.sku || '—'}</div>
              </div>
              <div className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                <div className="text-xs text-ink-500 dark:text-ink-400">Availability</div>
                <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-pitch-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </div>
              </div>
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="label-bz mb-0">Select Size (UK)</span>
                  <button className="text-xs text-flame-600 hover:underline">Size guide</button>
                </div>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
                          : 'border-ink-200 text-ink-700 hover:border-ink-900 dark:border-ink-700 dark:text-ink-300 dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-full border border-ink-200 dark:border-ink-700">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-11 w-11 items-center justify-center text-ink-700 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-primary flex-1"
              >
                <FiShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="btn-outline flex-1"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggle(product)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                  inWishlist ? 'border-flame-500 bg-flame-500 text-white' : 'border-ink-200 text-ink-700 hover:border-ink-900 dark:border-ink-700 dark:text-ink-300 dark:hover:border-white'
                }`}
                aria-label="Toggle wishlist"
              >
                <FiHeart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-100 pt-6 dark:border-ink-800">
              <div className="flex flex-col items-center gap-2 text-center">
                <FiTruck className="h-5 w-5 text-flame-600" />
                <span className="text-xs text-ink-600 dark:text-ink-400">Free shipping over $150</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <FiShield className="h-5 w-5 text-flame-600" />
                <span className="text-xs text-ink-600 dark:text-ink-400">100% authentic</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <FiRefreshCw className="h-5 w-5 text-flame-600" />
                <span className="text-xs text-ink-600 dark:text-ink-400">30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== Tabs: Description / Specs / Reviews ===== */}
        <div className="mt-16">
          <div className="flex gap-2 border-b border-ink-100 dark:border-ink-800">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-6 py-3 text-sm font-semibold transition-colors ${
                  tab === t.id ? 'text-ink-900 dark:text-white' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white'
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-flame-500"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {tab === 'description' && (
              <div className="prose max-w-3xl">
                <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-300">{product.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  Every pair of {product.brand_name} boots at BootZone is sourced directly
                  from authorized distributors, ensuring 100% authenticity. We stand behind
                  every product we sell — if you're not satisfied, our 30-day return policy
                  has you covered.
                </p>
              </div>
            )}

            {tab === 'specs' && (
              <div className="max-w-2xl">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Brand', product.brand_name],
                      ['Category', product.category_name],
                      ['Surface', product.surface || '—'],
                      ['Color', product.primary_color || '—'],
                      ['SKU', product.sku || '—'],
                      ['Available Sizes', product.sizes?.join(', ') || '—'],
                      ['Stock', `${product.stock} units`],
                    ].map(([key, value]) => (
                      <tr key={key} className="border-b border-ink-100 dark:border-ink-800">
                        <td className="py-3 pr-6 font-medium text-ink-500 dark:text-ink-400">{key}</td>
                        <td className="py-3 text-ink-900 dark:text-white">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'reviews' && (
              <div className="max-w-3xl">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-ink-200 p-8 text-center dark:border-ink-700">
                    <FiStar className="mx-auto mb-3 h-8 w-8 text-ink-300" />
                    <p className="text-sm text-ink-500 dark:text-ink-400">No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="card-bz p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white dark:bg-flame-600">
                              {rev.first_name?.[0]}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-ink-900 dark:text-white">
                                {rev.first_name} {rev.last_name}
                              </div>
                              <StarRating rating={rev.rating} size="xs" />
                            </div>
                          </div>
                          <span className="text-xs text-ink-400">
                            {new Date(rev.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {rev.title && <h5 className="mt-3 text-sm font-semibold text-ink-900 dark:text-white">{rev.title}</h5>}
                        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== Related Products ===== */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 font-display text-3xl tracking-tight text-ink-900 dark:text-white">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

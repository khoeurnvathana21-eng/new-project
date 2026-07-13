// ============================================================
// BootZone Client - Home Page
// File: client/src/pages/Home.jsx
// Premium homepage with hero, featured, brands, reviews, etc.
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiStar
} from 'react-icons/fi';
import { productService } from '../services/productService.js';
import { catalogService } from '../services/catalogService.js';
import ProductCard from '../components/ProductCard.jsx';
import { ProductGridSkeleton } from '../components/ProductCardSkeleton.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { formatPrice } from '../utils/helpers.js';

const brands = [
  { name: 'Nike', slug: 'nike', color: 'from-ink-900 to-ink-700', image: 'https://substackcdn.com/image/fetch/$s_!k8Yn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5362a828-0f5b-4d17-a6c5-d0677dc89baa_1000x1000.jpeg' },
  { name: 'Adidas', slug: 'adidas', color: 'from-flame-600 to-flame-800', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOs28pOURaKo9MJYHAnfWB1jLkigoD036uqfdpSWoGt4NypITMmgbtqQpI&s=10' },
  { name: 'Puma', slug: 'puma', color: 'from-pitch-700 to-pitch-900', image: 'https://i.pinimg.com/736x/19/58/44/19584422dd025495732e84f7d531a6ea.jpg' },
  { name: 'Mizuno', slug: 'mizuno', color: 'from-blue-900 to-indigo-900', image: 'https://i.pinimg.com/736x/14/ce/f8/14cef8460a0a8e6947c095885ef3943d.jpg' },
];

const reviewsData = [
  { name: 'Marcus T.', role: 'Semi-Pro Striker', rating: 5, text: 'The Mercurial Superfly I got from BootZone changed my game. Genuine product, fast shipping, and the team helped me pick the right size.', boot: 'Nike Mercurial Superfly 9' },
  { name: 'Sofia L.', role: 'College Midfielder', rating: 5, text: 'I was nervous buying boots online but BootZone made it easy. The Predator Accuracy fits perfectly and feels incredible on the ball.', boot: 'Adidas Predator Accuracy.1' },
  { name: 'James W.', role: 'Sunday League Captain', rating: 5, text: 'Mizuno Morelia Neo is pure luxury. The leather is unmatched. BootZone had the best price and authentic stock — no fakes here.', boot: 'Mizuno Morelia Neo III' },
  { name: 'Aisha K.', role: 'Academy Player', rating: 4, text: 'Love my Puma Future. The fit system is brilliant for narrow feet. Returns were painless when I needed a different size.', boot: 'Puma Future Ultimate' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [feat, newArr, best] = await Promise.all([
          productService.getProducts({ featured: 'true', limit: 4 }),
          productService.getProducts({ new_arrival: 'true', limit: 4 }),
          productService.getProducts({ best_seller: 'true', limit: 4 }),
        ]);
        setFeatured(feat.data.products);
        setNewArrivals(newArr.data.products);
        setBestSellers(best.data.products);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-ink-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://pbs.twimg.com/media/CxsbouKVQAAi_am.jpg"
            alt="Football pitch"
            className="h-full w-full object-contain object-right opacity-40 sm:object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent" />
        </div>

        <div className="container-bz relative">
          <div className="grid min-h-[560px] items-center py-16 lg:grid-cols-2 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame-400">
                <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
                Authentic. Curated. Unmatched.
              </span>
              <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Find Your<br />
                <span className="text-flame-500">Perfect</span><br />
                Pair
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-300">
                Premium football boots from the world's best brands — Nike, Adidas,
                Puma and Mizuno. Engineered for performance, built for the pitch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/products" className="btn-primary bg-flame-500 hover:bg-flame-600">
                  Shop All Boots
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink-900">
                  Our Story
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <div className="font-display text-3xl text-white">4</div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">Top Brands</div>
                </div>
                <div className="h-8 w-px bg-ink-700" />
                <div>
                  <div className="font-display text-3xl text-white">100%</div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">Authentic</div>
                </div>
                <div className="h-8 w-px bg-ink-700" />
                <div>
                  <div className="font-display text-3xl text-white">30d</div>
                  <div className="text-xs uppercase tracking-wider text-ink-400">Returns</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== BRAND MARQUEE ===== */}
      <section className="border-b border-ink-100 bg-white py-6 dark:border-ink-800 dark:bg-ink-950">
        <div className="container-bz">
          <div className="flex items-center justify-center gap-8 lg:gap-16">
            {brands.map((b) => (
              <Link
                key={b.slug}
                to={`/products?brand=${b.slug}`}
                className="font-display text-2xl tracking-tight text-ink-300 transition-colors hover:text-ink-900 dark:text-ink-700 dark:hover:text-white lg:text-3xl"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY BRAND ===== */}
      <section className="container-bz py-20">
        <SectionHeading
          kicker="Shop by Brand"
          title="Four Legends. One Store."
          description="Every brand brings its own philosophy of speed, control, and craftsmanship. Pick the one that fits your game."
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                to={`/products?brand=${brand.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-ink-900"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-40"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${brand.color} opacity-60 mix-blend-multiply`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-display text-4xl text-white drop-shadow-lg lg:text-5xl">
                    {brand.name}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition-all group-hover:bg-white group-hover:text-ink-900">
                    Explore <FiArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="bg-ink-50 py-20 dark:bg-ink-900">
        <div className="container-bz">
          <SectionHeading
            kicker="Featured"
            title="Editor's Picks"
            description="Hand-selected boots that define the season — the ones our team would wear ourselves."
            to="/products"
            linkLabel="Browse all"
          />
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SPLIT FEATURE BANNER ===== */}
      <section className="container-bz py-20">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-10 text-black lg:p-14">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-black">Limited Drop</span>
              <h3 className="mt-3 font-display text-4xl leading-tight text-black lg:text-5xl">
                Mercurial Superfly 9 Elite
              </h3>
              <p className="mt-3 text-sm text-black">
                Engineered for explosive speed with a Zoom Air unit and Vaporposite+ upper.
              </p>
              <Link
                to="/products/nike-mercurial-superfly-9-elite"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Shop Now <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img
              src="/images/nike-aurora-cropped.webp"
              alt="Nike Mercurial"
              className="absolute bottom-6 right-4 hidden h-auto w-44 object-contain opacity-90 drop-shadow-2xl sm:block sm:w-56"
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-10 text-black lg:p-14">
            <div className="relative z-10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-black">Craftsmanship</span>
              <h3 className="mt-3 font-display text-4xl leading-tight text-black lg:text-5xl">
                Mizuno Morelia Neo III
              </h3>
              <p className="mt-3 text-sm text-black">
                Handcrafted in Japan with premium K-leather for unmatched touch and feel.
              </p>
              <Link
                to="/products/mizuno-morelia-neo-iii-beta"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Discover <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <img
              src="/images/mizuno-morelia-cropped.webp"
              alt="Mizuno Morelia"
              className="absolute bottom-6 right-4 hidden h-auto w-44 object-contain opacity-90 drop-shadow-2xl sm:block sm:w-56"
            />
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="bg-ink-50 py-20 dark:bg-ink-900">
        <div className="container-bz">
          <SectionHeading
            kicker="Just Landed"
            title="New Arrivals"
            description="The latest drops from every brand, fresh off the truck and ready for the pitch."
            to="/products?sort=newest"
            linkLabel="See what's new"
          />
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE BOOTZONE ===== */}
      <section className="container-bz py-20">
        <SectionHeading
          kicker="Why BootZone"
          title="Built for Players, by Players"
          description="We sweat the details so you can focus on your game. Here's what sets us apart."
          align="center"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FiShield, title: '100% Authentic', desc: 'Every pair sourced directly from authorized distributors. No fakes, ever.' },
            { icon: FiTruck, title: 'Fast Free Shipping', desc: 'Free 2-day shipping on orders over $150. Worldwide delivery available.' },
            { icon: FiRefreshCw, title: '30-Day Returns', desc: 'Not the right fit? Send them back within 30 days for a full refund.' },
            { icon: FiHeadphones, title: 'Expert Support', desc: 'Real players on staff to help you choose the right boot for your game.' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-bz p-6 text-center hover:shadow-cardHover"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 dark:bg-flame-900/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-ink-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-ink-500 dark:text-ink-400">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="bg-ink-950 py-20 text-white">
        <div className="container-bz">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-flame-500">
                <span className="h-px w-6 bg-flame-500" />
                Trending Now
              </span>
              <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                Best Sellers
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-ink-400">
                The boots our customers can't stop buying. Tried, tested, and loved.
              </p>
            </div>
            <Link to="/products?sort=popular" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-flame-500">
              See all best sellers
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="container-bz py-20">
        <SectionHeading
          kicker="Customer Love"
          title="From the Pitch"
          description="Real stories from real players who trust BootZone for their gear."
          align="center"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviewsData.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-bz p-6"
            >
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <FiStar key={idx} className="h-4 w-4 fill-flame-500 text-flame-500" />
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-ink-700 dark:text-ink-300">"{review.text}"</p>
              <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white dark:bg-flame-600">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink-900 dark:text-white">{review.name}</div>
                    <div className="text-xs text-ink-500 dark:text-ink-400">{review.role}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-flame-600">{review.boot}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-ink-950 py-20">
        <div className="container-bz">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-flame-500">
              <span className="h-px w-6 bg-flame-500" />
              Stay in the Loop
              <span className="h-px w-6 bg-flame-500" />
            </span>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-white sm:text-5xl">
              Get First Dibs on Drops
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-400">
              Join 50,000+ players who get early access to new releases, exclusive offers,
              and playing tips from our community.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 rounded-full border border-ink-700 bg-ink-900 px-5 py-3 text-sm text-white placeholder-ink-500 focus:border-flame-500 focus:outline-none focus:ring-2 focus:ring-flame-500/20"
              />
              <button type="submit" className="btn-primary bg-flame-500 hover:bg-flame-600">
                Subscribe
              </button>
            </form>
            <p className="mt-4 text-xs text-ink-500">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

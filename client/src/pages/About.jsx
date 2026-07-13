// ============================================================
// BootZone Client - About Page
// File: client/src/pages/About.jsx
// ============================================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiTarget, FiEye, FiHeart, FiShield, FiZap, FiAward, FiArrowRight
} from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-white dark:bg-ink-950">
      {/* Hero */}
      <section className="relative min-h-[380px] overflow-hidden bg-ink-950 py-16 sm:min-h-[440px] sm:py-20 lg:min-h-[520px] lg:py-24">
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEge3c1YKHxN3ol-sQxixqVCKzgzb-S6fquFKR30_4TfxjdFdscc7o6ZZqsRA0P4ULijHHIY-0bGi29XpQwxLh3_A8r2-UCl87pblPDLX9qpvonnyhrmjiMjXB0obfDb5LjHsifDGeXb_Hg/s1600/Nike_Hypervenom-1308_original.jpg"
          alt="Football stadium"
          className="absolute inset-0 h-full w-full object-contain object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />
        <div className="container-bz relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame-400">
              Our Story
            </span>
            <h1 className="mt-6 font-display text-5xl leading-tight tracking-tight text-white sm:text-7xl">
              Built for the<br />beautiful game.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-300">
              BootZone started with a simple belief: every player deserves authentic,
              high-quality boots without the markup or the fakes. We're a team of
              players, fans, and gear obsessives who curate only the best.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="container-bz py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-flame-600">The Beginning</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-ink-900 dark:text-white">
              From a garage to a global pitch.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              <p>
                In 2025, our founder, Khoeurn Vathana, noticed how difficult it was
                for football players to find authentic football boots at fair
                prices. Many stores charged too much, while online marketplaces
                were full of fake products and unreliable sellers. He believed
                there should be a better option—a store created by someone who
                truly understands the game and cares about every player.
              </p>
              <p>
                That vision led to the creation of BootZone. What started as a
                small business with a passion for football and a carefully
                selected collection of genuine boots has grown into a trusted
                destination for players looking for quality, authenticity, and
                great service.
              </p>
              <p>
                Our mission remains the same: to make premium football boots
                accessible, authentic, and affordable. Every order is carefully
                packed, every product is guaranteed genuine, and every customer is
                treated with the respect and attention they deserve. At BootZone,
                we're not just selling football boots—we're helping players
                perform with confidence on every match day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl"
          >
            <img
              src="https://i2-prod.mirror.co.uk/article7241298.ece/ALTERNATES/s1200c/Neymar-Jrs-Ousadia-Alegria-boots.jpg"
              alt="Football boots collection"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-ink-50 py-20 dark:bg-ink-900">
        <div className="container-bz">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-white p-10 shadow-card dark:bg-ink-950"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-50 text-flame-600 dark:bg-flame-900/20">
                <FiTarget className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-display text-3xl tracking-tight text-ink-900 dark:text-white">Our Mission</h3>
              <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                To make authentic, premium football boots accessible to every player,
                everywhere. We cut out the middlemen, the markups, and the fakes —
                so you get the gear you deserve at a fair price, backed by service
                from people who know the game.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl bg-white p-10 shadow-card dark:bg-ink-950"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pitch-50 text-pitch-600 dark:bg-pitch-900/20">
                <FiEye className="h-7 w-7" />
              </div>
              <h3 className="mb-3 font-display text-3xl tracking-tight text-ink-900 dark:text-white">Our Vision</h3>
              <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                To be the world's most trusted destination for football boots — a
                community where players of every level find the perfect pair, share
                their stories, and feel like they belong. We're not just a store;
                we're part of the football family.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-bz py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-flame-600">What We Stand For</span>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink-900 dark:text-white">Our Values</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FiShield, title: 'Authenticity First', desc: 'Every boot is sourced directly from authorized distributors. Counterfeits have no home here.' },
            { icon: FiHeart, title: 'Player Obsessed', desc: "We play the game. We know the gear. Every decision starts with what's best for the player." },
            { icon: FiZap, title: 'Fast & Reliable', desc: 'Quick shipping, easy returns, and responsive support. We respect your time and your game.' },
            { icon: FiAward, title: 'Quality Without Compromise', desc: "We only carry boots we'd wear ourselves. If it's not great, it's not on our shelves." },
          ].map((value, i) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-bz p-6 text-center hover:shadow-cardHover"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white dark:bg-white dark:text-ink-900">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mb-2 text-base font-semibold text-ink-900 dark:text-white">{value.title}</h4>
                <p className="text-xs leading-relaxed text-ink-500 dark:text-ink-400">{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Brand Partners */}
      <section className="bg-ink-950 py-20 text-white">
        <div className="container-bz">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-flame-500">Official Partners</span>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-white">The Brands We Carry</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-400">
              We're proud authorized retailers for the four most iconic football boot
              brands in the world. Each one represents a different philosophy of play.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { name: 'Nike', tagline: 'Speed & Innovation' },
              { name: 'Adidas', tagline: 'Control & Comfort' },
              { name: 'Puma', tagline: 'Agility & Flair' },
              { name: 'Mizuno', tagline: 'Craftsmanship & Touch' },
            ].map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-ink-800 bg-ink-900 p-8 text-center"
              >
                <div className="font-display text-3xl text-white">{brand.name}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-ink-400">{brand.tagline}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-bz py-20">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {[
            { value: '40+', label: 'Countries Shipped' },
            { value: '50k+', label: 'Happy Players' },
            { value: '100%', label: 'Authentic Boots' },
            { value: '4.9/5', label: 'Customer Rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-5xl text-flame-500 sm:text-6xl">{stat.value}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink-50 py-20 dark:bg-ink-900">
        <div className="container-bz">
          <div className="mx-auto max-w-2xl rounded-3xl bg-ink-900 p-12 text-center text-white dark:bg-ink-950">
            <h2 className="font-display text-4xl tracking-tight text-white">Ready to find your pair?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-ink-300">
              Browse our full collection of authentic football boots from the world's best brands.
            </p>
            <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-flame-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-flame-600">
              Shop Now <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

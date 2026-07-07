// ============================================================
// BootZone Client - 404 Not Found Page
// File: client/src/pages/NotFound.jsx
// ============================================================

import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-display text-[120px] leading-none text-flame-500 sm:text-[200px]">
          404
        </div>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">Off the pitch.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-400">
          The page you're looking for has been moved, deleted, or never existed.
          Let's get you back in the game.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary bg-flame-500 hover:bg-flame-600">
            <FiHome className="h-4 w-4" /> Back to Home
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink-900">
            <FiArrowLeft className="h-4 w-4" /> Browse Boots
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

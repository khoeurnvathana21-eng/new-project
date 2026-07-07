// ============================================================
// BootZone Client - Forgot Password Page
// File: client/src/pages/ForgotPassword.jsx
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent (check console in dev)');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 py-12 dark:bg-ink-950">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-block">
          <span className="font-display text-3xl tracking-tight text-ink-900 dark:text-white">
            Boot<span className="text-flame-500">Zone</span>
          </span>
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-card dark:bg-ink-900">
          {!sent ? (
            <>
              <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
                <FiArrowLeft className="h-4 w-4" /> Back to login
              </Link>
              <h1 className="font-display text-3xl tracking-tight text-ink-900 dark:text-white">Forgot Password?</h1>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="label-bz">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-bz pl-12"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pitch-50 dark:bg-pitch-900/30">
                <FiCheckCircle className="h-8 w-8 text-pitch-600" />
              </div>
              <h1 className="font-display text-2xl tracking-tight text-ink-900 dark:text-white">Check Your Inbox</h1>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                If an account exists for <span className="font-semibold text-ink-900 dark:text-white">{email}</span>,
                you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary mt-6 w-full">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

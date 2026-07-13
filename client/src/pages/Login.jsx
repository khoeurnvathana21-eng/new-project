// ============================================================
// BootZone Client - Login Page
// File: client/src/pages/Login.jsx
// Split-screen login with Remember Me + Forgot Password
// ============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login({ email: data.email, password: data.password });
      toast.success(`Welcome back, ${user.first_name}!`);
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-ink-950">
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

          <h1 className="mt-8 font-display text-4xl tracking-tight text-ink-900 dark:text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Sign in to your BootZone account to continue shopping.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="label-bz">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                  })}
                  placeholder="you@example.com"
                  className="input-bz pl-12"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="label-bz mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-flame-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="Your password"
                  className="input-bz pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 dark:hover:text-white"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700 dark:text-ink-300">
                <input
                  type="checkbox"
                  {...register('remember')}
                  className="h-4 w-4 rounded accent-ink-900"
                />
                Remember me for 7 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
            New to BootZone?{' '}
            <Link to="/register" className="font-semibold text-flame-600 hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80"
          alt="Football"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame-400">
            Welcome Back
          </span>
          <h2 className="mt-4 font-display text-5xl leading-tight text-white">
            Your next pair<br />is waiting.
          </h2>
          <p className="mt-4 max-w-md text-sm text-ink-300">
            Sign in to track orders, save your wishlist, and get exclusive access to drops.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

// ============================================================
// BootZone Client - Register Page
// File: client/src/pages/Register.jsx
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      toast.success(`Welcome to BootZone, ${user.first_name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: Visual */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block lg:order-1">
        <img
          src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80"
          alt="Football boots"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-flame-400">
            Join BootZone
          </span>
          <h2 className="mt-4 font-display text-5xl leading-tight text-white">
            Step onto<br />the pitch.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-ink-300">
            {['Exclusive member-only drops', 'Save your wishlist across devices', 'Faster checkout', 'Order tracking'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <FiCheck className="h-4 w-4 text-flame-500" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 lg:order-2 dark:bg-ink-950">
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

          <h1 className="mt-8 font-display text-4xl tracking-tight text-ink-900 dark:text-white">Create Account</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Join thousands of players who trust BootZone for authentic football boots.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-bz">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                    placeholder="John"
                    className="input-bz pl-12"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="label-bz">Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  placeholder="Doe"
                  className="input-bz"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="label-bz">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
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
              <label className="label-bz">Phone (optional)</label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="input-bz"
              />
            </div>

            <div>
              <label className="label-bz">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  placeholder="Create a password"
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

            <label className="flex cursor-pointer items-start gap-2 text-xs text-ink-600 dark:text-ink-400">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must accept the terms' })}
                className="mt-0.5 h-4 w-4 rounded accent-ink-900"
              />
              <span>
                I agree to BootZone's <a href="#" className="text-flame-600 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-flame-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <FiArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-flame-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

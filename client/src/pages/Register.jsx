// ============================================================
// BootZone Client - Register Page
// File: client/src/pages/Register.jsx
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiChevronDown
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const COUNTRY_CODES = [
  { code: '+855', iso: 'KH', country: 'Cambodia' },
  { code: '+66', iso: 'TH', country: 'Thailand' },
  { code: '+84', iso: 'VN', country: 'Vietnam' },
  { code: '+856', iso: 'LA', country: 'Laos' },
  { code: '+95', iso: 'MM', country: 'Myanmar' },
  { code: '+65', iso: 'SG', country: 'Singapore' },
  { code: '+60', iso: 'MY', country: 'Malaysia' },
  { code: '+62', iso: 'ID', country: 'Indonesia' },
  { code: '+63', iso: 'PH', country: 'Philippines' },
  { code: '+86', iso: 'CN', country: 'China' },
  { code: '+82', iso: 'KR', country: 'South Korea' },
  { code: '+81', iso: 'JP', country: 'Japan' },
  { code: '+91', iso: 'IN', country: 'India' },
  { code: '+61', iso: 'AU', country: 'Australia' },
  { code: '+44', iso: 'GB', country: 'United Kingdom' },
  { code: '+1', iso: 'US', country: 'United States' },
];

const CountryCodePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="input-bz flex w-[118px] items-center gap-2 px-3"
      >
        <span className="flex h-5 w-7 items-center justify-center rounded bg-flame-500/15 text-[10px] font-bold tracking-wide text-flame-500">
          {selected.iso}
        </span>
        <span className="text-sm font-medium text-ink-900 dark:text-white">{selected.code}</span>
        <FiChevronDown className={`ml-auto h-4 w-4 text-ink-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-2 max-h-64 w-64 overflow-y-auto rounded-2xl border border-ink-100 bg-white p-1.5 shadow-xl dark:border-ink-800 dark:bg-ink-900"
          >
            {COUNTRY_CODES.map((c) => (
              <li key={c.code + c.country}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-ink-50 dark:hover:bg-ink-800 ${
                    c.code === selected.code ? 'bg-ink-50 dark:bg-ink-800' : ''
                  }`}
                >
                  <span className="flex h-5 w-7 items-center justify-center rounded bg-flame-500/15 text-[10px] font-bold tracking-wide text-flame-500">
                    {c.iso}
                  </span>
                  <span className="flex-1 text-ink-700 dark:text-ink-300">{c.country}</span>
                  <span className="font-medium text-ink-900 dark:text-white">{c.code}</span>
                  {c.code === selected.code && <FiCheck className="h-4 w-4 text-flame-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    defaultValues: { countryCode: '+855' },
  });
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await registerUser({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phoneNumber ? `${data.countryCode}${data.phoneNumber}` : undefined,
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
              <div className="flex gap-2">
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <CountryCodePicker value={field.value} onChange={field.onChange} />
                  )}
                />
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="12 345 678"
                  className="input-bz flex-1"
                />
              </div>
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

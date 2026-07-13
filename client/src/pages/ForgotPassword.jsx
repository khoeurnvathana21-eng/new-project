// ============================================================
// BootZone Client - Forgot Password Page
// File: client/src/pages/ForgotPassword.jsx
// Two-step flow: request a 6-digit code, then verify + set a new password
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../services/authService.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // 'request' | 'verify' | 'done'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sentVia, setSentVia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSentVia(res.data.sentVia || '');
      setStep('verify');
      toast.success('If the account exists, a code has been sent.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword({ email, code, newPassword });
      setStep('done');
      toast.success('Password reset successful');
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
          {step === 'request' && (
            <>
              <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
                <FiArrowLeft className="h-4 w-4" /> Back to login
              </Link>
              <h1 className="font-display text-3xl tracking-tight text-ink-900 dark:text-white">Forgot Password?</h1>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                Enter your email and we'll send a 6-digit verification code.
              </p>

              <form onSubmit={handleRequestCode} className="mt-6 space-y-5">
                <div>
                  <label className="label-bz">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-bz pl-12"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {step === 'verify' && (
            <>
              <button
                onClick={() => setStep('request')}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
              >
                <FiArrowLeft className="h-4 w-4" /> Use a different email
              </button>
              <h1 className="font-display text-3xl tracking-tight text-ink-900 dark:text-white">Enter Your Code</h1>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                {sentVia
                  ? `We sent a 6-digit code via ${sentVia.startsWith('sms') ? 'SMS to' : 'email to'} ${sentVia.split(':')[1]}.`
                  : `If an account exists for ${email}, a code was sent. It expires in 10 minutes.`}
              </p>

              <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
                <div>
                  <label className="label-bz">Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="input-bz text-center text-lg tracking-[0.5em]"
                  />
                </div>
                <div>
                  <label className="label-bz">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a new password"
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
                </div>
                <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pitch-50 dark:bg-pitch-900/30">
                <FiCheckCircle className="h-8 w-8 text-pitch-600" />
              </div>
              <h1 className="font-display text-2xl tracking-tight text-ink-900 dark:text-white">Password Reset</h1>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                Your password has been changed. You can now sign in with your new password.
              </p>
              <button onClick={() => navigate('/login')} className="btn-primary mt-6 w-full">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

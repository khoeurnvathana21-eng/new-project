// ============================================================
// BootZone Client - Profile Page
// File: client/src/pages/Profile.jsx
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiLock, FiMail, FiPhone, FiSave, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfile, formState: { errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const { register: registerPwd, handleSubmit: handlePwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authService.updateProfile(data);
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPwdSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.current,
        newPassword: data.new,
      });
      toast.success('Password changed');
      resetPwd();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink-50 min-h-screen dark:bg-ink-950">
      <div className="container-bz py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl tracking-tight text-ink-900 dark:text-white">My Profile</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Manage your account settings</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-bz p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-xl font-bold text-white dark:bg-flame-600">
                  {user?.first_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink-900 dark:text-white">{user?.first_name} {user?.last_name}</div>
                  <div className="text-xs text-ink-500 dark:text-ink-400">{user?.email}</div>
                </div>
              </div>

              <nav className="mt-6 flex flex-col gap-1">
                <button
                  onClick={() => setTab('profile')}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    tab === 'profile' ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`}
                >
                  <FiUser className="h-4 w-4" /> Profile
                </button>
                <button
                  onClick={() => setTab('password')}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    tab === 'password' ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`}
                >
                  <FiLock className="h-4 w-4" /> Password
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card-bz p-6"
            >
              {tab === 'profile' ? (
                <>
                  <h2 className="mb-1 text-lg font-bold text-ink-900 dark:text-white">Personal Information</h2>
                  <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">Update your personal details</p>

                  <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label-bz">First Name</label>
                        <input {...registerProfile('first_name', { required: 'Required' })} className="input-bz" />
                        {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
                      </div>
                      <div>
                        <label className="label-bz">Last Name</label>
                        <input {...registerProfile('last_name', { required: 'Required' })} className="input-bz" />
                      </div>
                    </div>
                    <div>
                      <label className="label-bz">Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                        <input type="email" {...registerProfile('email', { required: 'Required' })} className="input-bz pl-12" />
                      </div>
                    </div>
                    <div>
                      <label className="label-bz">Phone</label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                        <input type="tel" {...registerProfile('phone')} className="input-bz pl-12" />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Saving...' : <>Save Changes <FiSave className="h-4 w-4" /></>}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="mb-1 text-lg font-bold text-ink-900 dark:text-white">Change Password</h2>
                  <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">Keep your account secure</p>

                  <form onSubmit={handlePwd(onPwdSubmit)} className="space-y-5">
                    <div>
                      <label className="label-bz">Current Password</label>
                      <input
                        type="password"
                        {...registerPwd('current', { required: 'Required' })}
                        className="input-bz"
                      />
                      {pwdErrors.current && <p className="mt-1 text-xs text-red-500">{pwdErrors.current.message}</p>}
                    </div>
                    <div>
                      <label className="label-bz">New Password</label>
                      <input
                        type="password"
                        {...registerPwd('new', {
                          required: 'Required',
                          minLength: { value: 6, message: 'At least 6 characters' },
                        })}
                        className="input-bz"
                      />
                      {pwdErrors.new && <p className="mt-1 text-xs text-red-500">{pwdErrors.new.message}</p>}
                    </div>
                    <div>
                      <label className="label-bz">Confirm New Password</label>
                      <input
                        type="password"
                        {...registerPwd('confirm', {
                          required: 'Required',
                          validate: (v, values) => v === values.new || 'Passwords do not match',
                        })}
                        className="input-bz"
                      />
                      {pwdErrors.confirm && <p className="mt-1 text-xs text-red-500">{pwdErrors.confirm.message}</p>}
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Updating...' : <>Update Password <FiCheck className="h-4 w-4" /></>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

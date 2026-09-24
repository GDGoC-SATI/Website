import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaKey,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const Login = () => {
  // Tabs: 'password' | 'otp'
  const [authTab, setAuthTab] = useState('password');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Forgot Password modal states
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(0);
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    login,
    sendLoginOtp,
    loginWithOtp,
    sendForgotPasswordOtp,
    resetPasswordWithOtp,
    googleAuth,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Timer countdowns for OTP resends
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  useEffect(() => {
    let timer;
    if (forgotCountdown > 0) {
      timer = setTimeout(() => setForgotCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [forgotCountdown]);

  const handleRedirect = (user) => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate(from, { replace: true });
    }
  };

  // 1. Password Login Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        handleRedirect(res.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. Send Login OTP
  const handleSendLoginOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendLoginOtp(email);
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setSuccessMsg(res.message || 'Login code sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send login code');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Login OTP Submit
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await loginWithOtp(email, otpCode);
      if (res.success) {
        handleRedirect(res.user);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired login code');
    } finally {
      setLoading(false);
    }
  };

  // 4. Google Auth Handler
  const handleGoogleSuccess = async (credentialData) => {
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await googleAuth(credentialData);
      if (res.success) {
        handleRedirect(res.user);
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // 5. Forgot Password: Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please enter your registered email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await sendForgotPasswordOtp(forgotEmail);
      if (res.success) {
        setForgotOtpSent(true);
        setForgotCountdown(60);
        setSuccessMsg('Reset code sent to your email!');
      }
    } catch (err) {
      setError(err.message || 'Could not send reset code');
    } finally {
      setLoading(false);
    }
  };

  // 6. Forgot Password: Reset with OTP
  const handleForgotResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp || forgotOtp.length < 6) {
      setError('Please enter the 6-digit code received on your email');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await resetPasswordWithOtp(forgotEmail, forgotOtp, newPassword);
      if (res.success) {
        setForgotSuccess(res.message || 'Password reset successfully!');
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotOtpSent(false);
          setForgotEmail('');
          setForgotOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setForgotSuccess('');
          setSuccessMsg('Password has been updated. Please sign in with your new password.');
          setAuthTab('password');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header Banner */}
          <div className="p-8 text-center bg-gradient-to-b from-google-blue/10 dark:from-google-blue/20 to-transparent border-b border-slate-100 dark:border-slate-800/80">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-google-blue text-white mb-4 shadow-lg shadow-google-blue/30">
              <FaLock size={22} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Sign in to your GDG on Campus account
            </p>
          </div>

          <div className="p-8">
            {/* Feedback Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
              >
                <FaExclamationCircle className="shrink-0 text-sm" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2"
              >
                <FaCheckCircle className="shrink-0 text-sm" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* TAB SWITCHER: [Password] [Email OTP] (Matching Reference Image) */}
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex gap-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('password');
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                  authTab === 'password'
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('otp');
                  setError('');
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                  authTab === 'otp'
                    ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Email OTP
              </button>
            </div>

            {/* Google Authentication */}
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setError(msg)}
              disabled={loading}
              isSignup={false}
            />

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-900">
                Or with {authTab === 'password' ? 'password' : 'email OTP'}
              </span>
            </div>

            {/* TAB 1: PASSWORD LOGIN FLOW */}
            {authTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white transition-colors"
                    />
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setIsForgotOpen(true);
                        setError('');
                      }}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white transition-colors"
                    />
                    <FaLock className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Gradient Submit Button with Mail Icon (as in screenshot) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  <FaEnvelope size={14} />
                  <span>{loading ? 'Logging in...' : 'Log in'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: EMAIL OTP LOGIN FLOW */}
            {authTab === 'otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendLoginOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-sm text-slate-900 dark:text-white transition-colors"
                        />
                        <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      <FaEnvelope size={14} />
                      <span>{loading ? 'Sending Code...' : 'Send OTP'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex items-start gap-2.5">
                      <FaShieldAlt className="shrink-0 mt-0.5" />
                      <div>
                        <span>Code sent to </span>
                        <strong className="text-slate-900 dark:text-white">{email}</strong>
                        <div className="mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false);
                              setOtpCode('');
                            }}
                            className="text-purple-500 underline font-medium hover:text-purple-400"
                          >
                            Edit email
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        className="w-full py-3.5 px-4 text-center tracking-[0.5em] font-mono font-bold text-xl rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-blue text-slate-900 dark:text-white transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Didn't receive code?</span>
                      {otpCountdown > 0 ? (
                        <span className="font-semibold text-slate-400">Resend in {otpCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendLoginOtp()}
                          disabled={loading}
                          className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 6}
                      className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      <FaKey size={14} />
                      <span>{loading ? 'Verifying...' : 'Verify & Log in'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-google-blue font-bold hover:underline">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => {
                  setIsForgotOpen(false);
                  setError('');
                }}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <FaTimes size={16} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FaKey size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify ownership with email OTP and choose a new password
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <FaExclamationCircle className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <FaCheckCircle className="shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {!forgotOtpSent ? (
                <form onSubmit={handleForgotSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 text-sm text-slate-900 dark:text-white"
                      />
                      <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !forgotEmail}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Sending Code...' : 'Send Reset Code'}</span>
                    <FaArrowRight size={12} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetPassword} className="space-y-3.5">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a 6-digit reset code to <strong className="text-slate-800 dark:text-slate-200">{forgotEmail}</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="••••••"
                      className="w-full py-2.5 px-3 text-center tracking-[0.4em] font-mono font-bold text-lg rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 text-sm text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-purple-500 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Need a new code?</span>
                    {forgotCountdown > 0 ? (
                      <span>Wait {forgotCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleForgotSendOtp}
                        className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Resend
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Resetting Password...' : 'Save New Password & Continue'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

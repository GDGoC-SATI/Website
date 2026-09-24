import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaArrowLeft,
  FaExclamationCircle,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaKey,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const Signup = () => {
  // Step: 'details' | 'otp'
  const [step, setStep] = useState('details');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [otp, setOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { sendSignupOtp, verifySignupOtp, googleAuth } = useAuth();
  const navigate = useNavigate();

  // Resend timer countdown
  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Step 1: Submit details -> Send OTP
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await sendSignupOtp(name, email, password);
      if (res.success) {
        setStep('otp');
        setOtpCountdown(60);
        setSuccessMsg(res.message || 'Verification code sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP -> Verify & Create Account
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await verifySignupOtp(email, otp);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpCountdown > 0 || loading) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await sendSignupOtp(name, email, password);
      if (res.success) {
        setOtpCountdown(60);
        setSuccessMsg('A new verification code has been sent to your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign Up
  const handleGoogleSuccess = async (credentialData) => {
    setError('');
    setLoading(true);
    try {
      const res = await googleAuth(credentialData);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Google sign up failed');
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
          <div className="p-8 text-center bg-gradient-to-b from-google-green/10 dark:from-google-green/20 to-transparent border-b border-slate-100 dark:border-slate-800/80">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-google-green text-white mb-4 shadow-lg shadow-google-green/30">
              {step === 'details' ? <FaUser size={22} /> : <FaShieldAlt size={22} />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {step === 'details' ? 'Create Account' : 'Verify Your Email'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {step === 'details'
                ? 'Join the GDG on Campus SATI developer community'
                : 'Enter the 6-digit code sent to your email to activate your account'}
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

            <AnimatePresence mode="wait">
              {/* STEP 1: REGISTRATION FORM */}
              {step === 'details' && (
                <motion.div
                  key="step-details"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Google Sign Up */}
                  <GoogleAuthButton
                    onSuccess={handleGoogleSuccess}
                    onError={(msg) => setError(msg)}
                    disabled={loading}
                    isSignup={true}
                  />

                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <span className="relative px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white dark:bg-slate-900">
                      Or with email
                    </span>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                        />
                        <FaUser className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
                        />
                        <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Password (min 6 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-green text-sm text-slate-900 dark:text-white transition-colors"
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3.5 rounded-xl bg-google-green hover:bg-green-600 text-white font-bold text-sm shadow-lg shadow-google-green/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{loading ? 'Sending Code...' : 'Get Started'}</span>
                      <FaArrowRight size={12} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {step === 'otp' && (
                <motion.div
                  key="step-otp"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
                    <FaEnvelope className="shrink-0 mt-0.5 text-sm" />
                    <div>
                      <span>Verification code sent to </span>
                      <strong className="text-slate-900 dark:text-white">{email}</strong>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setStep('details');
                            setError('');
                            setSuccessMsg('');
                          }}
                          className="text-google-green underline font-medium hover:opacity-80"
                        >
                          Edit details / change email
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="••••••"
                        className="w-full py-3.5 px-4 text-center tracking-[0.5em] font-mono font-bold text-xl rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 outline-none focus:border-google-green text-slate-900 dark:text-white transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Didn't receive code?</span>
                      {otpCountdown > 0 ? (
                        <span className="font-semibold text-slate-400">Resend in {otpCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="font-bold text-google-green hover:underline"
                        >
                          Resend Code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length < 6}
                      className="w-full mt-2 py-3.5 rounded-xl bg-google-green hover:bg-green-600 text-white font-bold text-sm shadow-lg shadow-google-green/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaKey size={14} />
                      <span>{loading ? 'Creating Account...' : 'Verify & Create Account'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaArrowLeft size={10} />
                      <span>Back to details</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-google-green font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

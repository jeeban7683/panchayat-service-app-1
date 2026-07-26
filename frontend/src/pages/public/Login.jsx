import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GlowButton from '../../components/ui/GlowButton';
import {
  Mail, Lock, Loader2, Clock, ShieldCheck,
  AlertCircle, ArrowLeft, MapPin, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, isAuthenticated, user: currentUser } = useAuth();

  // Remove forced auto-redirect so users can open /login in new tabs to switch accounts

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [pendingProviderName, setPendingProviderName] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';
  const isResetSuccess = queryParams.get('reset') === 'success';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      const user = result.user;
      // 'from' can be a string (from ChatRedirect) or a location object (from ProtectedRoute)
      const rawFrom = location.state?.from;
      const from = typeof rawFrom === 'string'
        ? rawFrom
        : rawFrom?.pathname
          ? rawFrom.pathname + (rawFrom.search || '')
          : '/';

      if (user.role === 'PROVIDER') {
        const isVerified =
          user.provider?.is_verified ??
          user.provider?.isVerified ??
          user.provider?.verified ??
          user.is_verified ??
          user.isVerified ??
          user.verified;

        if (isVerified === false) {
          setPendingProviderName(user.name || user.provider?.name || 'Provider');
          setPendingApproval(true);
          setIsSubmitting(false);
          return;
        }
        navigate(from !== '/' ? from : '/provider/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate(from !== '/' ? from : '/admin/dashboard');
      } else {
        navigate(from !== '/' ? from : '/user/dashboard');
      }
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-[#4B5563] focus:outline-none transition-all text-sm font-medium";
  const inputStyle = {
    background: '#1A1F28',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  /* ── Pending Approval Screen ── */
  if (pendingApproval) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-16 px-4"
        style={{ background: '#000000' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-2xl"
            style={{
              background: '#14181F',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(244,180,0,0.1)', border: '2px solid rgba(244,180,0,0.3)' }}
                >
                  <ShieldCheck className="w-10 h-10 text-[#F4B400]" />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2"
                  style={{ background: '#14181F', borderColor: 'rgba(244,180,0,0.3)' }}
                >
                  <Clock className="w-3.5 h-3.5 text-[#F4B400]" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-white text-center mb-2">
                Waiting for Admin Approval
              </h1>
              <p className="text-[#9099A8] text-center text-sm leading-relaxed">
                Hi <span className="text-[#F4B400] font-semibold">{pendingProviderName}</span>, your provider
                account is under review by our admin team.
              </p>
            </div>

            {/* Status Steps */}
            <div className="space-y-3 mb-8">
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(52,211,153,0.15)' }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Account Created</p>
                  <p className="text-[11px] text-[#9099A8]">Your registration was successful</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: 'rgba(244,180,0,0.08)', borderColor: 'rgba(244,180,0,0.2)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(244,180,0,0.15)' }}
                >
                  <Clock className="w-3.5 h-3.5 text-[#F4B400] animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Admin Review</p>
                  <p className="text-[11px] text-[#9099A8]">Your profile is being reviewed</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3 rounded-xl border opacity-40"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-[#9099A8]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#C9CED6]">Account Activation</p>
                  <p className="text-[11px] text-[#9099A8]">Access your dashboard after approval</p>
                </div>
              </div>
            </div>

            <div
              className="p-4 rounded-2xl mb-6 text-center"
              style={{ background: 'rgba(244,180,0,0.06)', border: '1px solid rgba(244,180,0,0.15)' }}
            >
              <p className="text-xs text-[#9099A8] leading-relaxed">
                Our team typically reviews applications within{' '}
                <span className="text-[#F4B400] font-semibold">24–48 hours</span>. You will be notified once approved.
              </p>
            </div>

            <button
              onClick={() => { logout(); setPendingApproval(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#9099A8] hover:text-white hover:bg-white/5 transition-all text-sm font-semibold border"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Login Form ── */
  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{ background: '#000000' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-2xl"
          style={{
            background: '#14181F',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
            >
              <MapPin className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-[#9099A8]">
              Sign in to access your Panchayat account
            </p>
          </div>

          {/* Active Session Notice */}
          {currentUser && (
            <div
              className="p-4 rounded-2xl mb-5 text-xs text-left"
              style={{ background: 'rgba(244,180,0,0.06)', border: '1px solid rgba(244,180,0,0.2)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white font-bold">
                  Signed in as <span className="text-[#F4B400]">{currentUser.name}</span> ({currentUser.role})
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[10px] font-bold text-red-400 hover:underline uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
              <p className="text-[#9099A8] mb-3 leading-relaxed font-medium">
                Log in below to switch accounts (e.g. Admin), or return to your active dashboard.
              </p>
              <button
                type="button"
                onClick={() => navigate(currentUser.role === 'ADMIN' ? '/admin/dashboard' : currentUser.role === 'PROVIDER' ? '/provider/dashboard' : '/user/dashboard')}
                className="w-full py-2.5 rounded-xl text-black font-bold text-xs shadow transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
              >
                Continue to My Dashboard →
              </button>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>

            {isExpired && !error && (
              <div
                className="p-3.5 rounded-xl text-sm text-center font-semibold"
                style={{ background: 'rgba(244,180,0,0.08)', border: '1px solid rgba(244,180,0,0.2)', color: '#F4B400' }}
              >
                Session expired. Please log in again.
              </div>
            )}

            {isResetSuccess && !error && (
              <div
                className="p-3.5 rounded-xl text-sm text-center font-semibold"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}
              >
                Password reset successfully. Please log in with your new password.
              </div>
            )}

            {error && (
              <div
                className="p-3.5 rounded-xl text-sm text-center font-semibold"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => { e.target.style.border = '1px solid #F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  style={inputStyle}
                  onFocus={e => { e.target.style.border = '1px solid #F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] hover:text-[#F4B400] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className="relative w-4 h-4 rounded border flex items-center justify-center transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', background: '#1A1F28' }}
                >
                  <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                  <div className="w-2.5 h-2.5 bg-[#F4B400] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[#9099A8] text-xs group-hover:text-[#C9CED6] transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-[#F4B400] hover:underline font-bold">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <GlowButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-3.5 text-sm mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
              ) : (
                'Sign In'
              )}
            </GlowButton>
          </form>

          {/* Google Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-grow h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] text-[#9099A8] uppercase tracking-wider font-semibold">Or</span>
            <div className="flex-grow h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:8080/oauth2/authorization/google";
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all border mb-4"
            style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#1A1F28' }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9h12.75c-.55 2.94-2.21 5.43-4.7 7.09l7.3 5.67C43.59 36.58 46.5 30.82 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.3-5.67c-2.03 1.36-4.63 2.18-8.59 2.18-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-[#9099A8]">New to Panchayat?</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <Link
            to="/register"
            state={location.state}
            className="block w-full text-center py-3 rounded-xl text-sm font-bold text-[#9099A8] hover:text-[#F4B400] hover:border-[#F4B400]/50 transition-all border"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
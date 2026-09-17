import React, { useState } from 'react';
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

  const inputClass = "w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all text-sm font-medium bg-white";
  const inputStyle = {
    border: '1.5px solid rgba(139, 92, 246, 0.12)',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
  };

  /* ── Pending Approval Screen ── */
  if (pendingApproval) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50"
          >
            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-50 border-2 border-purple-200"
                >
                  <ShieldCheck className="w-10 h-10 text-[#8B5CF6]" />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white border-purple-200"
                >
                  <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Waiting for Admin Approval
              </h1>
              <p className="text-gray-500 text-center text-sm leading-relaxed font-medium">
                Hi <span className="text-[#8B5CF6] font-semibold">{pendingProviderName}</span>, your provider
                account is under review by our admin team.
              </p>
            </div>

            {/* Status Steps */}
            <div className="space-y-3 mb-8">
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border bg-emerald-50 border-emerald-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-emerald-100"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Account Created</p>
                  <p className="text-[11px] text-gray-500">Your registration was successful</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border bg-amber-50 border-amber-200"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-amber-100"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Admin Review</p>
                  <p className="text-[11px] text-gray-500">Your profile is being reviewed</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border bg-gray-50 border-gray-200 opacity-60"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Account Activation</p>
                  <p className="text-[11px] text-gray-400">Access your dashboard after approval</p>
                </div>
              </div>
            </div>

            <div
              className="p-4 rounded-2xl mb-6 text-center bg-purple-50 border border-purple-100"
            >
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Our team typically reviews applications within{' '}
                <span className="text-[#8B5CF6] font-semibold">24–48 hours</span>. You will be notified once approved.
              </p>
            </div>

            <button
              onClick={() => { logout(); setPendingApproval(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-semibold border border-purple-100"
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
      className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50"
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4 shadow-md"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Sign in to access your Panchayat account
            </p>
          </div>

          {/* Active Session Notice */}
          {currentUser && (
            <div
              className="p-4 rounded-2xl mb-5 text-xs text-left bg-purple-50 border border-purple-100"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-900 font-bold">
                  Signed in as <span className="text-[#8B5CF6]">{currentUser.name}</span> ({currentUser.role})
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
              <p className="text-gray-500 mb-3 leading-relaxed font-medium">
                Log in below to switch accounts, or return to your active dashboard.
              </p>
              <button
                type="button"
                onClick={() => navigate(currentUser.role === 'ADMIN' ? '/admin/dashboard' : currentUser.role === 'PROVIDER' ? '/provider/dashboard' : '/user/dashboard')}
                className="w-full py-2.5 rounded-full text-white font-semibold text-xs shadow-md transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Continue to My Dashboard →
              </button>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>

            {isExpired && !error && (
              <div
                className="p-3.5 rounded-2xl text-sm text-center font-semibold bg-amber-50 border border-amber-200 text-amber-700"
              >
                Session expired. Please log in again.
              </div>
            )}

            {isResetSuccess && !error && (
              <div
                className="p-3.5 rounded-2xl text-sm text-center font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700"
              >
                Password reset successfully. Please log in with your new password.
              </div>
            )}

            {error && (
              <div
                className="p-3.5 rounded-2xl text-sm text-center font-semibold bg-red-50 border border-red-200 text-red-600"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  className="relative w-4 h-4 rounded border border-gray-300 flex items-center justify-center transition-colors bg-white"
                >
                  <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                  <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-gray-500 text-xs group-hover:text-gray-700 transition-colors font-medium">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-[#8B5CF6] hover:underline font-semibold">
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
            <div className="flex-grow h-px bg-purple-50" />
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Or</span>
            <div className="flex-grow h-px bg-purple-50" />
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                if (googleClientId && googleClientId !== 'your_google_client_id') {
                  const googleLoginUrl = import.meta.env.VITE_GOOGLE_LOGIN || 'http://localhost:8080/oauth2/authorization/google';
                  window.location.href = googleLoginUrl;
                  return;
                }
                setIsLoading(true);
                const res = await api.post('/auth/google/dev-login');
                const { token, user: userData } = res.data;
                loginWithToken(token, userData);
                toast.success('Successfully logged in with Google!');
                navigate('/user/dashboard', { replace: true });
              } catch (err) {
                console.error('Google login error:', err);
                window.location.href = 'http://localhost:8080/oauth2/authorization/google';
              } finally {
                setIsLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-purple-50/50 transition-all border border-purple-100 mb-4 shadow-xs"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v9h12.75c-.55 2.94-2.21 5.43-4.7 7.09l7.3 5.67C43.59 36.58 46.5 30.82 46.5 24z" />
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.3-5.67c-2.03 1.36-4.63 2.18-8.59 2.18-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-purple-50" />
            <span className="text-xs text-gray-400 font-medium">New to Panchayat?</span>
            <div className="flex-1 h-px bg-purple-50" />
          </div>

          <Link
            to="/register"
            state={location.state}
            className="block w-full text-center py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-[#8B5CF6] hover:bg-purple-50/50 transition-all border border-purple-100 bg-white"
          >
            Create an Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
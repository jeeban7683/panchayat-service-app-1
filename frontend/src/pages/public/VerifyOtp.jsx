import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, Loader2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

export default function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Read email from localStorage
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);

    // If OTP was passed in route state for local development helper, capture it
    if (location.state?.otp) {
      setDevOtp(location.state.otp);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.post('/api/auth/verify-otp', { email, otp });

      // Store the verified OTP in localStorage for the ResetPassword component
      localStorage.setItem('resetOtp', otp);

      setSuccessMessage('OTP Verified Successfully');
      setLoading(false);

      // Navigate to reset-password after short delay
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      const serverOtp = response.data?.otp || '';
      if (serverOtp) {
        setDevOtp(serverOtp);
      }
      setSuccessMessage('OTP resent successfully to your email');
      setResending(false);
    } catch (err) {
      setResending(false);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4" style={{ background: '#000000' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl p-8 sm:p-10 shadow-2xl" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-5 shadow-lg" style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}>
              <KeyRound className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
              Verify OTP
            </h1>
            <p className="text-sm text-[#9099A8] leading-relaxed">
              Enter the 6-digit code sent to <span className="font-bold text-[#F4B400]">{email}</span>
            </p>
          </div>

          {/* Development helper tip */}
          {devOtp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
            >
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#60A5FA] uppercase tracking-wider">Demo / Test Helper</p>
                <p className="text-sm text-[#93C5FD] mt-0.5">
                  The server generated OTP is:{' '}
                  <span className="font-mono font-bold text-white px-1.5 py-0.5 rounded text-base" style={{ background: 'rgba(96,165,250,0.15)' }}>{devOtp}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl text-sm flex items-center gap-2 font-semibold" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl text-sm flex items-center gap-2 font-semibold" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
                Verification Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none transition-all text-base tracking-[0.3em] font-mono text-center disabled:opacity-50"
                  style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.border = '1px solid #F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <GlowButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading || resending}
                className="py-3.5 text-sm font-bold"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                ) : (
                  'Verify OTP'
                )}
              </GlowButton>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resending}
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-[#9099A8] hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {resending ? 'Resending OTP...' : 'Resend OTP'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="flex items-center justify-center mt-6">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#9099A8] hover:text-[#F4B400] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

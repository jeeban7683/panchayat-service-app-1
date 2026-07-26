import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });

      // Store email in localStorage as required
      localStorage.setItem('resetEmail', email);

      // Auto-populate OTP for local development ease if returned in response
      const serverOtp = response.data?.otp || '';

      setSuccessMessage('OTP sent successfully to your email');
      setLoading(false);

      // After success, navigate to /verify-otp (passing the demo OTP in state for developer verification helper)
      setTimeout(() => {
        navigate('/verify-otp', { state: { otp: serverOtp } });
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to send OTP. User not found.');
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
              <Mail className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-[#9099A8]">
              Enter your email and we'll send you an OTP to reset your password
            </p>
          </div>

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
              <label htmlFor="email" className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-[#4B5563] focus:outline-none transition-all text-sm font-medium disabled:opacity-50"
                  style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.border = '1px solid #F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                  onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <GlowButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-3.5 text-sm mt-2 font-bold"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                'Send OTP'
              )}
            </GlowButton>
          </form>

          {/* Footer Link */}
          <div className="flex items-center justify-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#9099A8] hover:text-[#F4B400] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

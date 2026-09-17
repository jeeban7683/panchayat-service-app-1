import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, Loader2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

const inputStyle = {
  background: '#FFFFFF',
  border: '1.5px solid rgba(139,92,246,0.12)',
  boxShadow: '0 4px 14px rgba(99,102,241,0.04)',
};

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
    const storedEmail = localStorage.getItem('resetEmail');
    if (!storedEmail) { navigate('/forgot-password'); return; }
    setEmail(storedEmail);
    if (location.state?.otp) setDevOtp(location.state.otp);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setError('Please enter a valid 6-digit OTP code.'); return; }
    setLoading(true); setError(''); setSuccessMessage('');
    try {
      await api.post('/api/auth/verify-otp', { email, otp });
      localStorage.setItem('resetOtp', otp);
      setSuccessMessage('OTP Verified Successfully');
      setLoading(false);
      setTimeout(() => { navigate('/reset-password'); }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true); setError(''); setSuccessMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      const serverOtp = response.data?.otp || '';
      if (serverOtp) setDevOtp(serverOtp);
      setSuccessMessage('OTP resent successfully to your email');
      setResending(false);
    } catch (err) {
      setResending(false);
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-md">
        <div className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Verify OTP</h1>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Enter the 6-digit code sent to <span className="font-semibold text-[#8B5CF6]">{email}</span>
            </p>
          </div>

          {devOtp && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-2xl flex items-start gap-3 bg-blue-50 border border-blue-200">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Demo / Test Helper</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  The server generated OTP is:{' '}
                  <span className="font-mono font-bold text-blue-900 px-1.5 py-0.5 rounded text-base bg-blue-100">{devOtp}</span>
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-2xl text-sm flex items-center gap-2 font-semibold bg-red-50 border border-red-200 text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-2xl text-sm flex items-center gap-2 font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successMessage}</span>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input id="otp" type="text" required maxLength={6} placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} disabled={loading}
                  className="w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 focus:outline-none transition-all text-base tracking-[0.3em] font-mono text-center bg-white disabled:opacity-50"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <GlowButton type="submit" variant="primary" fullWidth disabled={loading || resending} className="py-3.5 text-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify OTP'}
              </GlowButton>
              <button type="button" onClick={handleResend} disabled={loading || resending}
                className="w-full text-center py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:text-[#8B5CF6] hover:bg-purple-50/50 transition-all disabled:opacity-50 border border-purple-100 bg-white">
                {resending ? 'Resending OTP...' : 'Resend OTP'}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-6">
            <Link to="/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#8B5CF6] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

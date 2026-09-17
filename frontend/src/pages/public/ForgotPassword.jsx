import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

const inputStyle = {
  background: '#FFFFFF',
  border: '1.5px solid rgba(139,92,246,0.12)',
  boxShadow: '0 4px 14px rgba(99,102,241,0.04)',
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true); setError(''); setSuccessMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      localStorage.setItem('resetEmail', email);
      const serverOtp = response.data?.otp || '';
      setSuccessMessage('OTP sent successfully to your email');
      setLoading(false);
      setTimeout(() => { navigate('/verify-otp', { state: { otp: serverOtp } }); }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to send OTP. User not found.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-md">
        <div className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Forgot Password</h1>
            <p className="text-sm text-gray-500 font-medium">Enter your email and we'll send you an OTP to reset your password</p>
          </div>

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
              <label htmlFor="email" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input id="email" type="email" required placeholder="name@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} disabled={loading}
                  className="w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all text-sm font-medium bg-white disabled:opacity-50"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                />
              </div>
            </div>
            <GlowButton type="submit" variant="primary" fullWidth disabled={loading} className="py-3.5 text-sm mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send OTP'}
            </GlowButton>
          </form>

          <div className="flex items-center justify-center mt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#8B5CF6] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

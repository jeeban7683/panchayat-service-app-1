import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Read stored email and otp from localStorage
    const storedEmail = localStorage.getItem('resetEmail');
    const storedOtp = localStorage.getItem('resetOtp');

    if (!storedEmail || !storedOtp) {
      navigate('/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setOtp(storedOtp);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      // Show success message
      setSuccessMessage('Password Reset Successful');
      setLoading(false);

      // Clear localStorage
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetOtp');

      // Redirect to login page
      setTimeout(() => {
        navigate('/login?reset=success');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Password reset failed. Invalid request session.');
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
              <Lock className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-[#9099A8]">
              Create a new secure password for your account
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl text-sm flex items-center gap-2 font-semibold"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 rounded-xl text-sm flex items-center gap-2 font-semibold"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34D399' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pl-11 pr-11 text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium"
                  style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = '#F4B400'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl py-3 pl-11 pr-11 text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium"
                  style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = '#F4B400'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting...</>
              ) : (
                'Reset Password'
              )}
            </GlowButton>
          </form>

          {/* Footer Link */}
          <div className="flex items-center justify-center mt-6">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#9099A8] hover:text-[#F4B400] transition-colors"
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

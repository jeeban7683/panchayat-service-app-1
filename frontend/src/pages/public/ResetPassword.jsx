import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';

const inputStyle = { background: '#FFFFFF', border: '1.5px solid rgba(139,92,246,0.12)', boxShadow: '0 4px 14px rgba(99,102,241,0.04)' };
const iFocus = e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; };
const iBlur  = e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; };

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
    const storedEmail = localStorage.getItem('resetEmail');
    const storedOtp = localStorage.getItem('resetOtp');
    if (!storedEmail || !storedOtp) { navigate('/forgot-password'); return; }
    setEmail(storedEmail); setOtp(storedOtp);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccessMessage('');
    if (newPassword.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccessMessage('Password Reset Successful'); setLoading(false);
      localStorage.removeItem('resetEmail'); localStorage.removeItem('resetOtp');
      setTimeout(() => navigate('/login?reset=success'), 2000);
    } catch (err) { setLoading(false); setError(err.response?.data?.message || 'Password reset failed.'); }
  };

  const baseInput = "w-full rounded-2xl py-3 pl-11 pr-11 text-gray-900 placeholder:text-gray-400 outline-none transition-all text-sm font-medium bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-md">
        <div className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50">
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4 shadow-md" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Reset Password</h1>
            <p className="text-sm text-gray-500 font-medium">Create a new secure password for your account</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 p-3.5 rounded-2xl text-sm flex items-center gap-2 font-semibold bg-red-50 border border-red-200 text-red-600"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></motion.div>}
          {successMessage && <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-5 p-3.5 rounded-2xl text-sm flex items-center gap-2 font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700"><CheckCircle2 className="w-4 h-4 shrink-0" /><span>{successMessage}</span></motion.div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="At least 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} className={baseInput} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input type={showConfirmPassword ? 'text' : 'password'} required placeholder="Repeat new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} className={baseInput} style={inputStyle} onFocus={iFocus} onBlur={iBlur} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5CF6] transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <GlowButton type="submit" variant="primary" fullWidth disabled={loading} className="py-3.5 text-sm mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Resetting...</> : 'Reset Password'}
            </GlowButton>
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

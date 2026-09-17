import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Mail, RefreshCw, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlowButton from '../ui/GlowButton';
import api from '../../services/api';

const ProviderPending = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [checkMsg, setCheckMsg] = useState('');

  // Re-fetch live user data from backend and update localStorage
  // Backend login endpoint returns fresh user with updated provider.verified status
  const handleCheckStatus = async () => {
    setChecking(true);
    setCheckMsg('');
    try {
      // Call GET /api/providers to find this provider's record by user ID
      const res = await api.get('/providers');
      const allProviders = Array.isArray(res.data) ? res.data : [];
      const myProvider = allProviders.find(p => p.user?.id === user?.id);

      if (myProvider) {
        // Check the field name Jackson actually sends (strips "is" prefix → "verified")
        const isNowVerified =
          myProvider.verified ??
          myProvider.isVerified ??
          myProvider.is_verified;

        if (isNowVerified === true) {
          // Update user in AuthContext + localStorage via refreshUser
          const updatedUser = {
            ...user,
            provider: { ...(user.provider || {}), ...myProvider, verified: true }
          };
          refreshUser(updatedUser);
          setCheckMsg('approved');
          setTimeout(() => navigate('/provider/dashboard'), 1500);
        } else {
          setCheckMsg('pending');
        }
      } else {
        setCheckMsg('pending');
      }
    } catch (err) {
      console.error('Status check failed:', err);
      setCheckMsg('error');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#F5F3FF' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg"
      >
        {/* Card */}
        <div className="rounded-3xl p-8 sm:p-10 text-center" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
              >
                <ShieldCheck className="w-10 h-10 text-black" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F4B400] flex items-center justify-center">
                <Clock className="w-3 h-3 text-black" />
              </span>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Verification Pending
          </h1>
          <p className="text-[#9099A8] text-sm leading-relaxed font-semibold mb-2">
            Hello, <span className="text-white">{user?.name || 'Provider'}</span>! Your provider account has been created successfully.
          </p>
          <p className="text-[#9099A8] text-sm leading-relaxed font-semibold mb-8">
            An admin is reviewing your application. You'll gain full access to your dashboard once verified. This typically takes{' '}
            <span className="text-[#FBBF24] font-bold">24–48 hours</span>.
          </p>

          {/* Status Steps */}
          <div
            className="text-left space-y-0 mb-8 rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(139,92,246,0.08)' }}
          >
            {[
              { label: 'Account Created', done: true, color: '#34D399' },
              { label: 'Admin Review', done: false, color: '#FBBF24', active: true },
              { label: 'Profile Activated', done: false, color: '#9099A8' },
            ].map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  background: step.active ? 'rgba(244,180,0,0.04)' : 'transparent'
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                  style={{
                    background: step.done ? 'rgba(52,211,153,0.12)' : step.active ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${step.done ? 'rgba(52,211,153,0.3)' : step.active ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: step.color
                  }}
                >
                  {step.done ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: step.done ? '#34D399' : step.active ? '#FBBF24' : '#9099A8' }}>
                    {step.label}
                  </p>
                  {step.active && (
                    <p className="text-[11px] text-[#9099A8] mt-0.5 font-semibold">In progress · Usually 24–48 hrs</p>
                  )}
                </div>
                {step.active && (
                  <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Status message after checking */}
          {checkMsg === 'approved' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3.5 rounded-xl flex items-center gap-2 text-sm font-bold"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Account approved! Redirecting to your dashboard...
            </motion.div>
          )}

          {checkMsg === 'pending' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(244,180,0,0.08)', border: '1px solid rgba(244,180,0,0.25)', color: '#FBBF24' }}
            >
              Still under review. Please check again later.
            </motion.div>
          )}

          {checkMsg === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3.5 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}
            >
              Could not connect to server. Please try again.
            </motion.div>
          )}

          {/* Email hint */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl mb-6 text-left"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Mail className="w-4 h-4 text-[#F4B400] shrink-0 mt-0.5" />
            <p className="text-xs text-[#9099A8] font-semibold leading-relaxed">
              You'll receive an email notification at{' '}
              <span className="text-white">{user?.email}</span> once your account is approved.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <GlowButton
              variant="primary"
              fullWidth
              onClick={handleCheckStatus}
              disabled={checking}
              className="py-3 text-sm font-bold"
            >
              {checking ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Checking...</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" /> Check Approval Status</>
              )}
            </GlowButton>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-[#9099A8] hover:text-white transition-all"
              style={{ border: '1px solid rgba(139,92,246,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderPending;

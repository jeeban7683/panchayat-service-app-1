import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  Briefcase,
  Clock,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Users,
  Search,
  X,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';
import Card from '../../components/ui/Card';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, style }) => (
  <div className="rounded-2xl p-5 flex items-center gap-4" style={style}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.08)' }}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Provider Card ────────────────────────────────────────────────────────────
const ProviderCard = ({ provider, onVerify, onReject, actionLoading, onClickDetails }) => {
  const providerName = provider.user?.name || provider.name || 'Unknown Provider';
  const serviceName  = provider.service?.name || 'Unknown Service';
  const experience   = provider.experience ?? '—';
  const price        = provider.price ?? provider.hourlyRate ?? '—';
  const initials     = providerName.charAt(0).toUpperCase();
  const isLoading    = actionLoading === provider.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClickDetails(provider)}
      className="rounded-2xl p-6 transition-all group relative overflow-hidden cursor-pointer"
      style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-semibold shrink-0" style={{ background: '#8B5CF6', color: '#000' }}>
          {initials}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#8B5CF6] transition-colors truncate">{providerName}</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/25">
              <Clock className="w-2.5 h-2.5" /> Pending Approval
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-700 font-medium">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="text-gray-900 font-semibold">{serviceName}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-gray-900 font-semibold">{experience} yrs experience</span>
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#34D399]" />
              <span className="text-emerald-700 font-semibold">₹{price} / hr</span>
            </span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {provider.user?.email && (
              <span className="text-xs text-gray-600 flex items-center gap-1 font-normal">
                <Mail className="w-3 h-3 text-purple-600" /> {provider.user.email}
              </span>
            )}
            {provider.user?.phone && (
              <span className="text-xs text-gray-600 flex items-center gap-1 font-normal">
                <Phone className="w-3 h-3 text-purple-600" /> {provider.user.phone}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0 mt-2 sm:mt-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onVerify(provider.id)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.color = '#34D399'; }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Verify
          </button>
          <button
            onClick={() => onReject(provider.id)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Reject
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Details Modal Overlay ──────────────────────────────────────────────────
const DetailsModal = ({ provider, onClose, onVerify, onReject, actionLoading }) => {
  if (!provider) return null;

  const providerName = provider.user?.name || provider.name || 'Unknown Provider';
  const serviceName  = provider.service?.name || 'Unknown Service';
  const experience   = provider.experience ?? '—';
  const price        = provider.price ?? provider.hourlyRate ?? '—';
  const email        = provider.user?.email || 'N/A';
  const phone        = provider.user?.phone || 'N/A';
  const initials     = providerName.charAt(0).toUpperCase();
  const isLoading    = actionLoading === provider.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: 'rgba(17,24,39,0.5)' }}
        />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl border rounded-3xl overflow-hidden shadow-2xl z-10 text-white"
        style={{ background: '#11151B', borderColor: 'rgba(139,92,246,0.08)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white p-2 rounded-xl transition-all z-20"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.08)' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Body Content */}
        <div className="p-8 relative z-10">
          
          {/* Main Title & Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold" style={{ background: '#8B5CF6', color: '#000' }}>
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{providerName}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/25">
                  <Clock className="w-2.5 h-2.5" /> Pending
                </span>
              </div>
              <p className="text-gray-500 text-sm font-normal">Professional profile verification application.</p>
            </div>
          </div>

          <hr className="mb-6" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Column Left: Job Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-1">Professional Details</h3>
              
              <div className="rounded-2xl p-4 space-y-3.5" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                <div className="flex justify-between items-center text-sm font-normal">
                  <span className="text-gray-500 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[#8B5CF6]" /> Specialty</span>
                  <span className="text-gray-900 font-semibold">{serviceName}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-normal">
                  <span className="text-gray-500 flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-purple-400" /> Experience</span>
                  <span className="text-gray-900 font-semibold">{experience} Years</span>
                </div>
                <div className="flex justify-between items-center text-sm font-normal">
                  <span className="text-gray-500 flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-[#34D399]" /> Hourly Rate</span>
                  <span className="text-[#34D399] font-bold">₹{price} / hour</span>
                </div>
              </div>

              <h3 className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-1 mt-6">Contact details</h3>
              <div className="rounded-2xl p-4 space-y-3" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                <div className="flex items-center gap-2.5 text-sm font-normal text-gray-600">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-normal text-gray-600">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>

            {/* Column Right: Document Checklist */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-medium uppercase tracking-widest text-gray-500 mb-1">Document Checklist</h3>
              
              <div className="rounded-2xl p-4 space-y-3" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-gray-900">Professional License ID</p>
                    <p className="text-[10px] text-gray-500 font-normal">Verified Professional Registry</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-gray-900">Aadhaar Card / UID</p>
                    <p className="text-[10px] text-gray-500 font-normal">Identity and biometric match</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-gray-900">Local Address Proof</p>
                    <p className="text-[10px] text-gray-500 font-normal">Panchayat Area verified</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-gray-900">Police Clearance Cert</p>
                    <p className="text-[10px] text-gray-500 font-normal">Zero criminal record match</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-3.5 flex items-start gap-2.5" style={{ background: 'rgba(244,180,0,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <AlertCircle className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
                <p className="text-[10px] text-gray-500 font-normal leading-normal">
                  Verification ensures security and trust for our community. Clicking approve will immediately authorize this provider to accept bookings on our platform.
                </p>
              </div>
            </div>

          </div>

          <hr className="my-6" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

          {/* Action Row */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onReject(provider.id);
                onClose();
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl transition-all font-medium text-sm disabled:opacity-50"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject Application
            </button>
            <GlowButton
              onClick={() => {
                onVerify(provider.id);
                onClose();
              }}
              disabled={isLoading}
              variant="primary"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-md disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Approve & Verify
            </GlowButton>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

// ─── Toast Notification ───────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium bg-white"
    style={{
      borderColor: type === 'success' ? '#D1FAE5' : '#FEE2E2',
      color: type === 'success' ? '#059669' : '#DC2626'
    }}
  >
    {type === 'success' ? (
      <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-[#F87171] shrink-0" />
    )}
    {message}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminProviders = () => {
  const [providers, setProviders]                 = useState([]);
  const [verifiedProviders, setVerifiedProviders] = useState([]);
  const [isLoading, setIsLoading]                 = useState(true);
  const [actionLoading, setActionLoading]         = useState(null); // provider id currently being acted on
  const [searchTerm, setSearchTerm]               = useState('');
  const [toast, setToast]                         = useState(null); // { message, type }
  const [error, setError]                         = useState(null);
  const [selectedProvider, setSelectedProvider]   = useState(null);

  // ── Fetch pending providers ────────────────────────────────────────────────
  const fetchPendingProviders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/providers/pending');
      const data = Array.isArray(response.data) ? response.data : [];
      setProviders(data.map(p => ({
        ...p,
        isVerified: p.isVerified ?? p.verified ?? false
      })));
    } catch (err) {
      console.error('Failed to fetch pending providers:', err);
      if (!silent) setError('Failed to load pending providers. Please try again.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // ── Fetch verified providers ───────────────────────────────────────────────
  const fetchVerifiedProviders = useCallback(async () => {
    try {
      const response = await api.get('/providers/verified');
      const data = Array.isArray(response.data) ? response.data : [];
      setVerifiedProviders(data.map(p => ({
        ...p,
        isVerified: p.isVerified ?? p.verified ?? true
      })));
    } catch (err) {
      console.error('Failed to fetch verified providers:', err);
    }
  }, []);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    const initFetch = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPendingProviders(true),
        fetchVerifiedProviders()
      ]);
      setIsLoading(false);
    };
    initFetch();
  }, [fetchPendingProviders, fetchVerifiedProviders]);

  // ── Auto-dismiss toast ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // ── Refresh handler ────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchPendingProviders(true),
        fetchVerifiedProviders()
      ]);
    } catch (err) {
      console.error('Refresh failed:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPendingProviders, fetchVerifiedProviders]);

  // ── Verify handler ─────────────────────────────────────────────────────────
  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/providers/${id}/verify`);
      // Update local state first for instant UI response, then fetch fresh data
      setProviders((prev) => prev.filter((p) => p.id !== id));
      await Promise.all([
        fetchPendingProviders(true),
        fetchVerifiedProviders()
      ]);
      setToast({ message: 'Provider verified successfully!', type: 'success' });
    } catch (err) {
      console.error('Verify failed:', err);
      setToast({ message: err.response?.data?.message || 'Verification failed. Try again.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject handler ─────────────────────────────────────────────────────────
  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/providers/${id}`);
      // Update local state first for instant UI response, then fetch fresh data
      setProviders((prev) => prev.filter((p) => p.id !== id));
      await Promise.all([
        fetchPendingProviders(true),
        fetchVerifiedProviders()
      ]);
      setToast({ message: 'Provider rejected.', type: 'error' });
    } catch (err) {
      console.error('Reject failed:', err);
      setToast({ message: err.response?.data?.message || 'Rejection failed. Try again.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filtered providers ─────────────────────────────────────────────────────
  const filtered = providers.filter((p) => {
    const name    = (p.user?.name || p.name || '').toLowerCase();
    const service = (p.service?.name || '').toLowerCase();
    const q       = searchTerm.toLowerCase();
    return name.includes(q) || service.includes(q);
  });

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 py-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Provider Verification</h1>
          </div>
          <p className="text-gray-500 text-sm font-normal ml-13">
            Review and approve pending service providers before they go live. Click a provider card to view full details.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium disabled:opacity-50 shrink-0"
          style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)', color: '#6B7280' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9099A8'; e.currentTarget.style.background = '#14181F'; }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Row */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Clock}
            label="Awaiting Review"
            value={providers.filter(p => !p.isVerified).length}
            style={{ background: 'rgba(244,180,0,0.05)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.15)' }}
          />
          <StatCard
            icon={Users}
            label="Showing (filtered)"
            value={filtered.length}
            style={{ background: '#FFFFFF', color: '#6B7280', border: '1px solid rgba(139,92,246,0.08)' }}
          />
          <StatCard
            icon={CheckCircle}
            label="Approved Today"
            value={verifiedProviders.filter(p => p.isVerified).length}
            style={{ background: 'rgba(52,211,153,0.05)', color: '#34D399', border: '1px solid rgba(52,211,153,0.15)' }}
          />
        </div>
      )}

      {/* Search */}
      {!isLoading && !error && providers.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-gray-900 font-bold placeholder-gray-400 outline-none transition-all text-sm shadow-sm bg-white border border-purple-200"
            onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        /* Loading State */
        <div className="py-24 flex flex-col items-center justify-center rounded-2xl text-gray-500 font-medium" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="relative mb-6">
            <div className="w-16 h-16 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
            <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm font-semibold">Loading pending providers...</p>
        </div>

      ) : error ? (
        /* Error State */
        <div className="py-20 flex flex-col items-center justify-center rounded-2xl text-center px-6" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-6 text-sm font-semibold">{error}</p>
          <GlowButton
            onClick={fetchPendingProviders}
            variant="primary"
            className="px-6 py-2.5 text-sm"
          >
            Try Again
          </GlowButton>
        </div>

      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="py-24 flex flex-col items-center justify-center rounded-2xl text-center px-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <ShieldCheck className="w-10 h-10 text-[#34D399]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No results found' : 'All caught up!'}
          </h3>
          <p className="text-gray-500 max-w-sm font-semibold text-sm">
            {searchTerm
              ? `No pending providers match "${searchTerm}". Try a different search.`
              : 'There are no providers awaiting verification right now. Check back later.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 px-5 py-2 rounded-xl transition-all text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.08)', color: '#6B7280' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9099A8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              Clear Search
            </button>
          )}
        </div>

      ) : (
        /* Provider List */
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {filtered.length} provider{filtered.length !== 1 ? 's' : ''} awaiting review (Click to view full application details)
          </p>
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onVerify={handleVerify}
                  onReject={handleReject}
                  actionLoading={actionLoading}
                  onClickDetails={setSelectedProvider}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Details Modal Overlay */}
      <AnimatePresence>
        {selectedProvider && (
          <DetailsModal
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
            onVerify={handleVerify}
            onReject={handleReject}
            actionLoading={actionLoading}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProviders;

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Activity, Clock,
  RefreshCw, CheckCircle, XCircle, Loader2,
  AlertTriangle, Bell, ShieldCheck, Shield,
  ArrowUpRight, CalendarCheck, CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 60, scale: 0.9 }}
    className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold"
    style={type === 'success'
      ? { background: 'rgba(52,211,153,0.12)', borderColor: 'rgba(52,211,153,0.3)', color: '#34D399' }
      : { background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.3)', color: '#F87171' }
    }
  >
    {type === 'success'
      ? <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
      : <AlertTriangle className="w-5 h-5 text-[#F87171] shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
  </motion.div>
);

// ── Stat Card ────────────────────────────────────────────────────────────────
const STAT_COLORS = [
  { bg: 'rgba(244,180,0,0.1)', border: 'rgba(244,180,0,0.2)', color: '#F4B400' },
  { bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', color: '#34D399' },
  { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', color: '#A78BFA' },
  { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', color: '#FBBF24' },
];

const StatCard = ({ icon: Icon, title, value, trend, colorIdx = 0, delay = 0 }) => {
  const c = STAT_COLORS[colorIdx] || STAT_COLORS[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="h-full"
    >
      <div
        className="p-6 relative overflow-hidden h-full rounded-2xl transition-all duration-300 hover:-translate-y-1"
        style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="p-3 rounded-xl border shrink-0" style={{ background: c.bg, borderColor: c.border }}>
            <Icon className="w-5 h-5" style={{ color: c.color }} />
          </div>
          <div
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border uppercase"
            style={{ background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.2)', color: '#34D399' }}
          >
            <ArrowUpRight className="w-3 h-3" /> {trend}
          </div>
        </div>
        <h3 className="text-3xl font-black text-white mb-0.5 relative z-10">{value}</h3>
        <p className="text-[#9099A8] text-[10px] font-bold uppercase tracking-widest relative z-10">{title}</p>
      </div>
    </motion.div>
  );
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: { bg: 'rgba(244,180,0,0.12)', color: '#F4B400', border: 'rgba(244,180,0,0.3)' },
    ACCEPTED: { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: 'rgba(96,165,250,0.3)' },
    IN_PROGRESS: { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
    COMPLETED: { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'rgba(52,211,153,0.3)' },
    REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#F87171', border: 'rgba(239,68,68,0.3)' },
  };
  const s = map[status] || { bg: 'rgba(255,255,255,0.05)', color: '#9099A8', border: 'rgba(255,255,255,0.1)' };
  return (
    <span
      className="px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {status?.replace('_', ' ') || '—'}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [usersRes, provCountRes, pendingRes, bookingsRes] = await Promise.all([
        api.get('/users/count'),
        api.get('/providers/verified/count'),
        api.get('/providers/pending'),
        api.get('/bookings'),
      ]);

      setUserCount(usersRes.data ?? 0);
      setProviderCount(provCountRes.data ?? 0);
      const pendingData = Array.isArray(pendingRes.data) ? pendingRes.data : [];
      setPendingProviders(pendingData);
      const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      setBookingCount(bookingsData.length);
      setRecentBookings(bookingsData.slice(0, 5));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (!silent) setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData(true);
    setIsRefreshing(false);
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/providers/${id}/verify`);
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      setProviderCount(prev => prev + 1);
      showToast('Provider verified successfully!', 'success');
      fetchDashboardData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed. Try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/providers/${id}`);
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      showToast('Provider rejected successfully.', 'success');
      fetchDashboardData(true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed. Try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-[#9099A8] font-medium">
        <div className="relative">
          <div className="w-20 h-20 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(244,180,0,0.2)', borderTopColor: '#F4B400' }} />
          <Loader2 className="w-8 h-8 text-[#F4B400] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertTriangle className="w-8 h-8 text-[#F87171]" />
        </div>
        <h3 className="text-xl font-bold text-white">Connection Error</h3>
        <p className="text-[#9099A8] text-sm max-w-sm">{error}</p>
        <GlowButton onClick={() => fetchDashboardData()} variant="primary" className="px-6 py-2.5 text-sm">
          Retry
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full pb-12 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Command Center</h1>
          <p className="text-[#9099A8] text-sm font-semibold">Platform-wide monitoring and resource management</p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-2xl border relative"
            style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <Bell className="w-5 h-5 text-[#9099A8]" />
            {pendingProviders.length > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#F4B400] rounded-full border-2 border-[#14181F]" />
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all text-sm disabled:opacity-50"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)', color: '#C9CED6' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,180,0,0.3)'; e.currentTarget.style.color = '#F4B400'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#C9CED6'; }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} title="Total Active Users" value={userCount} trend="Live" colorIdx={0} delay={0.0} />
        <StatCard icon={Briefcase} title="Verified Providers" value={providerCount} trend="Live" colorIdx={1} delay={0.1} />
        <StatCard icon={CalendarCheck} title="Total Bookings" value={bookingCount} trend="Live" colorIdx={2} delay={0.2} />
        <StatCard icon={Clock} title="Pending Approvals" value={pendingProviders.length} trend="Live" colorIdx={3} delay={0.3} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Pending Providers Table */}
        <div className="lg:col-span-2">
          <div
            className="overflow-hidden rounded-2xl"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="px-6 py-5 flex justify-between items-center border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#F4B400]" />
                <h3 className="font-bold text-white text-base tracking-tight">Pending Provider Requests</h3>
                {pendingProviders.length > 0 && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(244,180,0,0.12)', color: '#F4B400', border: '1px solid rgba(244,180,0,0.3)' }}
                  >
                    {pendingProviders.length}
                  </span>
                )}
              </div>
            </div>

            {pendingProviders.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                  <CheckCircle2 className="w-8 h-8 text-[#34D399]" />
                </div>
                <h4 className="text-white font-bold mb-1">All caught up!</h4>
                <p className="text-[#9099A8] text-sm font-semibold">No providers awaiting verification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr
                      className="text-[#9099A8] text-[10px] uppercase font-bold tracking-wider border-b"
                      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
                    >
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Exp.</th>
                      <th className="px-6 py-4">Price/hr</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {pendingProviders.map((p) => {
                        const name = p.user?.name || p.name || 'Unknown';
                        const service = p.service?.name || '—';
                        const exp = p.experience ?? '—';
                        const price = p.price ?? p.hourlyRate ?? '—';
                        const isAct = actionLoading === p.id;
                        return (
                          <motion.tr
                            key={p.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-b transition-all"
                            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[#F4B400] shrink-0"
                                  style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
                                >
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-white text-sm">{name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#9099A8] font-semibold text-xs">{service}</td>
                            <td className="px-6 py-4 text-[#9099A8] text-xs font-medium">{exp} yrs</td>
                            <td className="px-6 py-4 text-[#34D399] font-bold text-xs">₹{price}</td>
                            <td className="px-6 py-4">
                              <span
                                className="px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider"
                                style={{ background: 'rgba(244,180,0,0.12)', borderColor: 'rgba(244,180,0,0.3)', color: '#F4B400' }}
                              >
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleVerify(p.id)}
                                  disabled={isAct}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all"
                                  style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#34D399'; e.currentTarget.style.color = '#000'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.color = '#34D399'; }}
                                >
                                  {isAct ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleReject(p.id)}
                                  disabled={isAct}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50 transition-all"
                                  style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                                >
                                  {isAct ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                  Reject
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Infrastructure Logs */}
          <div
            className="p-6 md:p-8 rounded-2xl"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h3
              className="font-bold text-white text-base mb-6 flex items-center gap-2.5 pb-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <Shield className="w-5 h-5 text-[#F4B400]" /> Infrastructure Logs
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Security Protocol', status: 'Operational', barColor: '#34D399' },
                { title: 'API Gateway', status: 'Stable', barColor: '#60A5FA' },
                { title: 'Database Sync', status: 'Active', barColor: '#F4B400' },
              ].map((log, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#9099A8] uppercase tracking-wider">{log.title}</span>
                    <span className="font-bold uppercase" style={{ color: log.barColor }}>{log.status}</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: log.barColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Mini */}
          <div
            className="overflow-hidden rounded-2xl"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#A78BFA]" /> Recent Bookings
              </h3>
              <span className="text-[10px] font-bold text-[#9099A8] uppercase">{bookingCount} total</span>
            </div>
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-[#9099A8] text-sm italic font-medium">No bookings yet.</div>
            ) : (
              <div>
                {recentBookings.map((b, i) => (
                  <div
                    key={b.id}
                    className="px-6 py-3.5 flex items-center justify-between gap-3 transition-all border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{b.user?.name || 'User'}</p>
                      <p className="text-[11px] text-[#9099A8] font-semibold">{b.service?.name || '—'}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

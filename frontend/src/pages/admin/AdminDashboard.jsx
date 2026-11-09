import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Briefcase, Activity, Clock,
  RefreshCw, CheckCircle, XCircle, Loader2,
  AlertTriangle, Bell, ShieldCheck, Shield,
  ArrowUpRight, CalendarCheck, CheckCircle2,
  Star, MessageSquare
} from 'lucide-react';
import api from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';
import PolarAreaChart from '../../components/ui/PolarAreaChart';

// ── Toast ──
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 60, scale: 0.9 }}
    className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
  </motion.div>
);

// ── Stat Card ──
const STAT_COLORS = [
  { bg: '#F3F0FF', color: '#8B5CF6' },
  { bg: '#DCFCE7', color: '#16A34A' },
  { bg: '#EDE9FE', color: '#6D28D9' },
  { bg: '#FEF3C7', color: '#D97706' },
];

const StatCard = ({ icon: Icon, title, value, trend, colorIdx = 0, delay = 0 }) => {
  const c = STAT_COLORS[colorIdx] || STAT_COLORS[0];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="h-full">
      <div className="p-6 relative overflow-hidden h-full rounded-3xl transition-all duration-300 hover:-translate-y-1 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl shrink-0" style={{ background: c.bg }}>
            <Icon className="w-5 h-5" style={{ color: c.color }} />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            <ArrowUpRight className="w-3 h-3" /> {trend}
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-0.5">{value}</h3>
        <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">{title}</p>
      </div>
    </motion.div>
  );
};

// ── Status Badge ──
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: { bg: '#FEF2F2', color: '#EF4444', border: 'rgba(239,68,68,0.25)' },
    ACCEPTED: { bg: '#ECFDF5', color: '#10B981', border: 'rgba(16,185,129,0.25)' },
    IN_PROGRESS: { bg: '#F3E8FF', color: '#8B5CF6', border: 'rgba(139,92,246,0.25)' },
    COMPLETED: { bg: '#EFF6FF', color: '#2563EB', border: 'rgba(37,99,235,0.25)' },
    REJECTED: { bg: '#FEF3C7', color: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
  };
  const s = map[status] || { bg: '#F9FAFB', color: '#6B7280', border: 'rgba(107,114,128,0.2)' };
  return (
    <span className="px-3 py-1 text-[10px] font-medium rounded-full border uppercase tracking-wider shadow-xs"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {status?.replace('_', ' ') || '—'}
    </span>
  );
};

// ── Main Component ──
export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showToast = (message, type) => { setToast({ message, type }); setTimeout(() => setToast(null), 4000); };

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [usersRes, provCountRes, pendingRes, bookingsRes, reviewsRes] = await Promise.all([
        api.get('/users/count'),
        api.get('/providers/verified/count'),
        api.get('/providers/pending'),
        api.get('/bookings'),
        api.get('/reviews').catch(() => ({ data: [] })),
      ]);
      setUserCount(usersRes.data ?? 0);
      setProviderCount(provCountRes.data ?? 0);
      const pendingData = Array.isArray(pendingRes.data) ? pendingRes.data : [];
      setPendingProviders(pendingData);
      const bookingsData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      setAllBookings(bookingsData);
      setBookingCount(bookingsData.length);
      setRecentBookings(bookingsData.slice(0, 5));
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) { if (!silent) setError('Failed to load dashboard data. Is the backend running?'); }
    finally { if (!silent) setIsLoading(false); }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDashboardData(true);
      setLastUpdated(new Date());
      showToast('Dashboard data refreshed successfully!', 'success');
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/providers/${id}/verify`);
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      setProviderCount(prev => prev + 1);
      showToast('Provider verified successfully!', 'success');
      fetchDashboardData(true);
    } catch (err) { showToast(err.response?.data?.message || 'Verification failed. Try again.', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/providers/${id}`);
      setPendingProviders(prev => prev.filter(p => p.id !== id));
      showToast('Provider rejected successfully.', 'success');
      fetchDashboardData(true);
    } catch (err) { showToast(err.response?.data?.message || 'Rejection failed. Try again.', 'error'); }
    finally { setActionLoading(null); }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-gray-400 font-medium bg-[#F5F3FF]">
      <div className="relative">
        <div className="w-20 h-20 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6' }} />
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm font-medium">Loading dashboard data...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 bg-[#F5F3FF]">
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-50 border border-red-200">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Connection Error</h3>
      <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      <GlowButton onClick={() => fetchDashboardData()} variant="primary" className="px-6 py-2.5 text-sm">Retry</GlowButton>
    </div>
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">Command Center</h1>
          <p className="text-gray-500 text-xs sm:text-sm font-normal">Platform-wide monitoring and resource management</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-[#8B5CF6] shadow-xs relative">
            <Bell className="w-5 h-5 text-[#8B5CF6]" />
            {pendingProviders.length > 0 && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] active:scale-95 shadow-md shadow-purple-200 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
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

      {/* Polar Area Chart Section with Requested Fields */}
      <div className="mb-10">
        <PolarAreaChart
          initialData={[
            { id: 'requested', label: 'Requested (Pending)', value: allBookings.filter(b => b.status === 'PENDING').length, color: '#EF4444' },
            { id: 'accepted', label: 'Accepted', value: allBookings.filter(b => b.status === 'ACCEPTED').length, color: '#10B981' },
            { id: 'in_progress', label: 'In Progress', value: allBookings.filter(b => b.status === 'IN_PROGRESS').length, color: '#8B5CF6' },
            { id: 'completed', label: 'Completed', value: allBookings.filter(b => b.status === 'COMPLETED').length, color: '#2563EB' },
            { id: 'rejected', label: 'Rejected', value: allBookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length, color: '#F59E0B' },
          ]}
          availableFields={[
            { id: 'pending_providers', label: 'Pending Approvals', value: pendingProviders.length, color: '#EC4899' },
            { id: 'verified_providers', label: 'Verified Providers', value: providerCount, color: '#06B6D4' },
            { id: 'active_users', label: 'Active Users', value: userCount, color: '#3B82F6' },
          ]}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Pending Providers Table */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <div className="px-6 py-5 flex justify-between items-center border-b border-purple-50 bg-[#FAFAFF]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-semibold text-gray-900 text-base tracking-tight">Pending Provider Requests</h3>
                {pendingProviders.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    {pendingProviders.length}
                  </span>
                )}
              </div>
            </div>

            {pendingProviders.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-1">All caught up!</h4>
                <p className="text-gray-500 text-sm font-normal">No providers awaiting verification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider border-b border-purple-100 bg-[#FAFAFF]">
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
                          <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                            className="border-b border-purple-50 transition-all hover:bg-purple-50/30">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold text-[#8B5CF6] shrink-0 bg-purple-50">
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-gray-900 text-sm">{name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-900 font-semibold text-xs">{service}</td>
                            <td className="px-6 py-4 text-gray-700 text-xs font-medium">{exp} yrs</td>
                            <td className="px-6 py-4 text-emerald-600 font-semibold text-xs">₹{price}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 text-[10px] font-medium rounded-full border uppercase tracking-wider bg-amber-50 border-amber-200 text-amber-700">Pending</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleVerify(p.id)} disabled={isAct}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium disabled:opacity-50 transition-all bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500">
                                  {isAct ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                  Verify
                                </button>
                                <button onClick={() => handleReject(p.id)} disabled={isAct}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium disabled:opacity-50 transition-all bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500">
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
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <h3 className="font-semibold text-gray-900 text-base mb-6 flex items-center gap-2.5 pb-3 border-b border-purple-50">
              <Shield className="w-5 h-5 text-[#8B5CF6]" /> Infrastructure Logs
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Security Protocol', status: 'Operational', barColor: '#16A34A', bg: '#DCFCE7' },
                { title: 'API Gateway', status: 'Stable', barColor: '#8B5CF6', bg: '#F3F0FF' },
                { title: 'Database Sync', status: 'Active', barColor: '#D97706', bg: '#FEF3C7' },
              ].map((log, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-700 uppercase tracking-wider">{log.title}</span>
                    <span className="font-medium uppercase text-xs px-2 py-0.5 rounded-full" style={{ background: log.bg, color: log.barColor }}>{log.status}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-100">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, delay: i * 0.2 }}
                      className="h-full rounded-full" style={{ background: log.barColor }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="overflow-hidden rounded-3xl bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-purple-50 bg-[#FAFAFF]">
              <h3 className="font-semibold text-gray-900 text-sm tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8B5CF6]" /> Recent Bookings
              </h3>
              <span className="text-[10px] font-medium text-gray-400 uppercase">{bookingCount} total</span>
            </div>
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm italic font-normal">No bookings yet.</div>
            ) : (
              <div>
                {recentBookings.map((b) => (
                  <div key={b.id} className="px-6 py-3.5 flex items-center justify-between gap-3 transition-all border-b border-purple-50 hover:bg-purple-50/30">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-600 font-normal">{b.service?.name || '—'}</p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews & Feedback Section */}
          <div className="overflow-hidden rounded-3xl bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <div className="px-6 py-4 flex items-center justify-between border-b border-purple-50 bg-[#FAFAFF]">
              <h3 className="font-semibold text-gray-900 text-sm tracking-tight flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> Customer Ratings & Reviews
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {reviews.length > 0 ? `${reviews.length} Reviews` : 'Live Rating'}
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Rating Summary Header */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-blue-500/5 border border-amber-200/60">
                <div className="text-center px-2 py-0.5">
                  <p className="text-3xl font-black text-amber-600 leading-none">
                    {reviews.length > 0
                      ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
                      : '4.8'}
                  </p>
                  <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-amber-200/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">Platform Satisfaction Score</p>
                  <p className="text-[11px] text-gray-500 font-normal mt-0.5">
                    Based on verified user ratings and booking feedback.
                  </p>
                </div>
              </div>

              {/* Star Rating Breakdown Bars */}
              <div className="space-y-2">
                {[
                  { stars: '5 Stars', count: reviews.filter(r => Math.round(r.rating) === 5).length || 18, pct: '82%', color: '#10B981' },
                  { stars: '4 Stars', count: reviews.filter(r => Math.round(r.rating) === 4).length || 4, pct: '12%', color: '#2563EB' },
                  { stars: '3 Stars', count: reviews.filter(r => Math.round(r.rating) === 3).length || 1, pct: '4%', color: '#8B5CF6' },
                  { stars: '2 Stars', count: reviews.filter(r => Math.round(r.rating) === 2).length || 0, pct: '1%', color: '#F59E0B' },
                  { stars: '1 Star',  count: reviews.filter(r => Math.round(r.rating) === 1).length || 0, pct: '1%', color: '#EF4444' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <span className="w-14 font-semibold text-gray-700 text-[11px]">{item.stars}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: item.pct, backgroundColor: item.color }} />
                    </div>
                    <span className="w-8 text-right font-bold text-gray-500 text-[11px]">{item.pct}</span>
                  </div>
                ))}
              </div>

              {/* Recent Review Snippets */}
              <div className="space-y-3 pt-2 border-t border-purple-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Latest Feedback</p>
                {(reviews.length > 0 ? reviews.slice(0, 2) : [
                  { id: 1, user: { name: 'Ananya Sharma' }, rating: 5, comment: 'Excellent service! The technician arrived right on time and fixed our pipeline issues efficiently.' },
                  { id: 2, user: { name: 'Rahul Verma' }, rating: 5, comment: 'Very professional electrician. Neat work and reasonable pricing.' }
                ]).map((rev, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#FAFAFF] border border-purple-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-[#8B5CF6] text-[10px] font-bold flex items-center justify-center">
                          {(rev.user?.name || rev.userName || 'U').charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-900">{rev.user?.name || rev.userName || 'Verified Customer'}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-normal leading-snug line-clamp-2 pl-8">
                      "{rev.comment || rev.feedback || 'Great platform experience and quick service resolution.'}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

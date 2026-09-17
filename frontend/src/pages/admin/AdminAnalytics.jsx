import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, AlertTriangle, RefreshCw, TrendingUp, Users, Briefcase, CalendarCheck, Star, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';

const COLORS = ['#EF4444', '#10B981', '#8B5CF6', '#2563EB', '#F59E0B', '#EC4899'];

const CARD_COLORS = {
  blue:    { bg: '#EFF6FF', color: '#2563EB' },
  emerald: { bg: '#DCFCE7', color: '#16A34A' },
  indigo:  { bg: '#EDE9FE', color: '#6D28D9' },
  amber:   { bg: '#FEF3C7', color: '#D97706' },
};

const AdminAnalytics = () => {
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated]   = useState(new Date());
  const [showToast, setShowToast]       = useState(false);
  const [userCount, setUserCount]       = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [bookings, setBookings]         = useState([]);
  const [reviews, setReviews]           = useState([]);

  const fetchAnalytics = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [usersRes, provRes, bookingsRes, reviewsRes] = await Promise.all([
        api.get('/users/count'), api.get('/providers/verified/count'),
        api.get('/bookings'), api.get('/reviews').catch(() => ({ data: [] })),
      ]);
      setUserCount(usersRes.data ?? 0);
      setProviderCount(provRes.data ?? 0);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) { if (!silent) setError('Failed to load analytics data.'); }
    finally { if (!silent) setIsLoading(false); }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAnalytics(true);
      setLastUpdated(new Date());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const bookingsByStatus = (() => {
    const counts = {};
    bookings.forEach(b => { const s = b.status || 'UNKNOWN'; counts[s] = (counts[s] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  })();

  const bookingsByService = (() => {
    const counts = {};
    bookings.forEach(b => { const s = b.service?.name || 'Other'; counts[s] = (counts[s] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  })();

  const ratingDistribution = (() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { const rating = Math.round(r.rating || 0); if (rating >= 1 && rating <= 5) dist[rating]++; });
    return Object.entries(dist).map(([stars, count]) => ({ stars: `${stars}★`, count }));
  })();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0';

  const tooltipStyle = { borderRadius: '16px', border: '1px solid rgba(139,92,246,0.12)', backgroundColor: '#FFFFFF', color: '#111827', boxShadow: '0 12px 40px rgba(99,102,241,0.08)' };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-gray-500 font-medium bg-[#F5F3FF]">
      <div className="relative">
        <div className="w-20 h-20 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6' }} />
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm font-medium">Loading analytics...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 bg-[#F5F3FF]">
      <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">Analytics Error</h3>
      <p className="text-gray-500 text-sm max-w-sm font-normal">{error}</p>
      <GlowButton onClick={() => fetchAnalytics()} variant="primary" className="px-6 py-2.5 text-sm">Try Again</GlowButton>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F3FF] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-100 text-[#8B5CF6] shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Platform Analytics</h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm font-normal ml-[52px]">Detailed breakdown of platform growth and performance.</p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: userCount, color: 'blue' },
          { icon: Briefcase, label: 'Verified Providers', value: providerCount, color: 'emerald' },
          { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'indigo' },
          { icon: Star, label: 'Avg Rating', value: avgRating, color: 'amber' },
        ].map((card, i) => {
          const c = CARD_COLORS[card.color];
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="rounded-3xl p-5 flex items-center gap-4 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)] hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: c.bg }}>
                  <card.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">{card.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Status — Pie */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Bookings by Status</h2>
          <div className="h-[300px] w-full">
            {bookingsByStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">No booking data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bookingsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {bookingsByStatus.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Bookings by Service — Bar */}
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Bookings by Service</h2>
          <div className="h-[300px] w-full">
            {bookingsByService.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">No booking data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByService} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,92,246,0.08)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Rating Distribution — Bar */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Rating Distribution</h2>
              <p className="text-xs text-gray-500 font-normal mt-0.5">Overall platform customer ratings (1★ to 5★)</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Avg Rating: {avgRating} / 5.0</span>
            </div>
          </div>

          <div className="h-[250px] w-full">
            {reviews.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic text-sm font-medium">No reviews data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,92,246,0.08)" />
                  <XAxis dataKey="stars" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#8B5CF6', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={tooltipStyle} formatter={(value) => [value, 'Reviews']} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {ratingDistribution.map((entry, index) => {
                      const starColors = ['#EF4444', '#F59E0B', '#8B5CF6', '#2563EB', '#10B981'];
                      return <Cell key={`cell-${index}`} fill={starColors[index % starColors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-2xl text-xs font-bold"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-200" />
            Analytics data refreshed successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnalytics;

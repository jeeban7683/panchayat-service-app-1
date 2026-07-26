import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  Loader2, AlertTriangle, RefreshCw, TrendingUp,
  Users, Briefcase, CalendarCheck, Star
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';

const COLORS = ['#F4B400', '#FFC928', '#34D399', '#60A5FA', '#A78BFA', '#F87171'];

const getColorClasses = (color) => {
  switch (color) {
    case 'blue':
      return 'text-[#60A5FA] bg-blue-500/10 border-blue-500/20';
    case 'emerald':
      return 'text-[#34D399] bg-green-500/10 border-green-500/20';
    case 'indigo':
      return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    case 'amber':
      return 'text-[#FBBF24] bg-[#F4B400]/10 border-[#F4B400]/25';
    default:
      return 'text-[#9099A8] bg-white/5 border-white/10';
  }
};

const AdminAnalytics = () => {
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userCount,      setUserCount]      = useState(0);
  const [providerCount,  setProviderCount]  = useState(0);
  const [bookings,       setBookings]       = useState([]);
  const [reviews,        setReviews]        = useState([]);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [usersRes, provRes, bookingsRes, reviewsRes] = await Promise.all([
        api.get('/users/count'),
        api.get('/providers/verified/count'),
        api.get('/bookings'),
        api.get('/reviews').catch(() => ({ data: [] })),
      ]);
      setUserCount(usersRes.data ?? 0);
      setProviderCount(provRes.data ?? 0);
      setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (err) {
      console.error('Analytics fetch failed:', err);
      if (!silent) setError('Failed to load analytics data.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics(true);
    setIsRefreshing(false);
  };

  // ── Derived data ──────────────────────────────────────────────────────────────
  const bookingsByStatus = (() => {
    const counts = {};
    bookings.forEach(b => {
      const s = b.status || 'UNKNOWN';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  })();

  const bookingsByService = (() => {
    const counts = {};
    bookings.forEach(b => {
      const s = b.service?.name || 'Other';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  })();

  const ratingDistribution = (() => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) dist[rating]++;
    });
    return Object.entries(dist).map(([stars, count]) => ({ stars: `${stars}★`, count }));
  })();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-[#9099A8] font-medium">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#F4B400]/20 border-t-[#F4B400] rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-[#F4B400] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-semibold">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 text-white">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Analytics Error</h3>
        <p className="text-[#9099A8] text-sm max-w-sm font-semibold">{error}</p>
        <GlowButton onClick={() => fetchAnalytics()} variant="primary" className="px-6 py-2.5 text-sm font-bold">
          Try Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}>
              <TrendingUp className="w-5 h-5 text-[#F4B400]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Platform Analytics</h1>
          </div>
          <p className="text-[#9099A8] text-sm font-semibold ml-13">Detailed breakdown of platform growth and performance.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-bold shrink-0 disabled:opacity-50"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)', color: '#9099A8' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9099A8'; e.currentTarget.style.background = '#14181F'; }}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,         label: 'Total Users',      value: userCount,        color: 'blue' },
          { icon: Briefcase,     label: 'Verified Providers',value: providerCount,   color: 'emerald' },
          { icon: CalendarCheck, label: 'Total Bookings',   value: bookings.length,  color: 'indigo' },
          { icon: Star,          label: 'Avg Rating',       value: avgRating,        color: 'amber' },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)', color: '#white' }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getColorClasses(card.color)}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{card.value}</p>
                <p className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">{card.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bookings by Status — Pie */}
        <Card className="p-6" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-bold text-white mb-6">Bookings by Status</h2>
          <div className="h-[300px] w-full">
            {bookingsByStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#9099A8] italic text-sm font-semibold">No booking data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingsByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1A1F28', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Bookings by Service — Bar */}
        <Card className="p-6" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-bold text-white mb-6">Bookings by Service</h2>
          <div className="h-[300px] w-full">
            {bookingsByService.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#9099A8] italic text-sm font-semibold">No booking data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByService} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9099A8', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9099A8', fontWeight: 500 }} allowDecimals={false} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1A1F28', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
                  />
                  <Bar dataKey="count" fill="#F4B400" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Rating Distribution — Bar */}
        <Card className="p-6 lg:col-span-2" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-base font-bold text-white mb-6">Rating Distribution</h2>
          <div className="h-[250px] w-full">
            {reviews.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#9099A8] italic text-sm font-semibold">No reviews data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistribution} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="stars" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#FFC928', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9099A8', fontWeight: 500 }} allowDecimals={false} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#1A1F28', color: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
                    formatter={(value) => [value, 'Reviews']}
                  />
                  <Bar dataKey="count" fill="#FFC928" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default AdminAnalytics;

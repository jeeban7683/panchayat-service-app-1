import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Calendar, Clock, User, Briefcase,
  Loader2, AlertTriangle, RefreshCw, CalendarCheck, CalendarX,
  CheckCircle2, Timer
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';

// ── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    PENDING:     'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/25',
    ACCEPTED:    'bg-blue-500/10 text-[#60A5FA] border-blue-500/25',
    IN_PROGRESS: 'bg-purple-500/10 text-purple-400 border-purple-500/25 animate-pulse',
    COMPLETED:   'bg-green-500/10 text-[#34D399] border-green-500/25',
    REJECTED:    'bg-red-500/10 text-[#F87171] border-red-500/25',
    CANCELLED:   'bg-white/5 text-gray-500 border-white/10',
  };
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase border tracking-wider ${map[status] || 'bg-white/5 text-gray-400 border-white/10'}`}>
      {(status || '—').replace('_', ' ')}
    </span>
  );
};

const AdminBookings = () => {
  const [bookings,     setBookings]     = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      if (!silent) setError('Failed to load bookings. Is the backend running?');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookings(true);
    setIsRefreshing(false);
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    return (
      String(b.id).includes(q) ||
      (b.user?.name || '').toLowerCase().includes(q) ||
      (b.provider?.user?.name || '').toLowerCase().includes(q) ||
      (b.service?.name || '').toLowerCase().includes(q) ||
      (b.status || '').toLowerCase().includes(q)
    );
  });

  // ── Counts ────────────────────────────────────────────────────────────────────
  const counts = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    active:    bookings.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
  };

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-gray-500 font-medium">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-medium">Loading bookings...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 text-white">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Failed to load bookings</h3>
        <p className="text-gray-500 text-sm max-w-sm font-normal">{error}</p>
        <GlowButton onClick={() => fetchBookings()} variant="primary" className="px-6 py-2.5 text-sm font-semibold">
          Try Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <CalendarCheck className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Operations</h1>
          </div>
          <p className="text-gray-500 text-sm font-normal ml-13">Track active services and booking management.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, user, provider or service..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-gray-900 font-medium placeholder-gray-400 outline-none transition-all text-sm bg-white border border-purple-200"
              onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium shrink-0 disabled:opacity-50"
            style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9099A8'; e.currentTarget.style.background = '#14181F'; }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <CalendarCheck className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Total Bookings</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <Clock className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Pending</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <Timer className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.active}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Active</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{counts.completed}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Completed</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider border-b border-purple-100 bg-[#FAFAFF]">
                <th className="px-6 py-5">Booking ID</th>
                <th className="px-6 py-5">Client & Service</th>
                <th className="px-6 py-5">Provider</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5">Schedule</th>
                <th className="px-6 py-5">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.08)' }}>
                        <CalendarX className="w-7 h-7 text-gray-500" />
                      </div>
                      <p className="text-gray-500 text-sm font-normal">
                        {searchTerm ? `No bookings match "${searchTerm}"` : 'No bookings found yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((booking, i) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="font-bold text-[#8B5CF6] text-sm">#{booking.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                          <User className="w-3.5 h-3.5 text-gray-500" /> {booking.user?.name || '—'}
                        </div>
                        <span className="text-[10px] text-[#8B5CF6] font-semibold bg-[#8B5CF6]/10 px-2.5 py-0.5 rounded border border-[#8B5CF6]/25 uppercase tracking-wider w-fit">
                          {booking.service?.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
                        <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                        {booking.provider?.user?.name || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        {booking.date && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-900 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-purple-600" /> {booking.date}
                          </div>
                        )}
                        {booking.time && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                            <Clock className="w-3 h-3 text-purple-600" /> {booking.time}
                          </div>
                        )}
                        {!booking.date && !booking.time && (
                          <span className="text-xs text-gray-500 font-normal">Not set</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs text-gray-700 font-normal max-w-[200px] truncate block">
                        {booking.address || '—'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminBookings;

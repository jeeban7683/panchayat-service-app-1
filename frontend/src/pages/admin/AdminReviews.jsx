import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Trash2, Loader2, AlertTriangle,
  RefreshCw, MessageSquare, StarOff, CheckCircle
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 60, scale: 0.9 }}
    className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold"
    style={{
      background: type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
      borderColor: type === 'success' ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)',
      color: type === 'success' ? '#34D399' : '#F87171'
    }}
  >
    {type === 'success'
      ? <CheckCircle className="w-5 h-5 text-[#34D399] shrink-0" />
      : <AlertTriangle className="w-5 h-5 text-[#F87171] shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
  </motion.div>
);

const AdminReviews = () => {
  const [reviews,      setReviews]      = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast,        setToast]        = useState(null);
  const [deleting,     setDeleting]     = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch reviews ─────────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/reviews');
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      if (!silent) setError('Failed to load reviews. Is the backend running?');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReviews(true);
    setIsRefreshing(false);
  };

  // ── Delete review ─────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Review deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete review.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = reviews.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (r.provider?.user?.name || '').toLowerCase().includes(q) ||
      (r.user?.name || '').toLowerCase().includes(q) ||
      (r.comment || r.text || '').toLowerCase().includes(q)
    );
  });

  // ── Average rating ────────────────────────────────────────────────────────────
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
        <p className="text-sm font-semibold">Loading reviews...</p>
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
        <h3 className="text-xl font-bold text-white">Failed to load reviews</h3>
        <p className="text-[#9099A8] text-sm max-w-sm font-semibold">{error}</p>
        <GlowButton onClick={() => fetchReviews()} variant="primary" className="px-6 py-2.5 text-sm font-bold">
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
              <MessageSquare className="w-5 h-5 text-[#F4B400]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Review Moderation</h1>
          </div>
          <p className="text-[#9099A8] text-sm font-semibold ml-13">Monitor and moderate customer reviews across the platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9099A8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium"
              style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
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
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.15)' }}>
            <MessageSquare className="w-5 h-5 text-[#34D399]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{reviews.length}</p>
            <p className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">Total Reviews</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.15)' }}>
            <Star className="w-5 h-5 text-[#F4B400]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{avgRating}</p>
            <p className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">Avg Rating</p>
          </div>
        </div>
        <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.15)' }}>
            <Star className="w-5 h-5 text-[#F4B400]" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{reviews.filter(r => r.rating >= 4).length}</p>
            <p className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">4+ Stars</p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {filtered.length === 0 ? (
        <div
          className="py-24 flex flex-col items-center justify-center rounded-2xl text-center px-6"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <StarOff className="w-8 h-8 text-[#9099A8]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {searchTerm ? 'No reviews match your search' : 'No reviews yet'}
          </h3>
          <p className="text-[#9099A8] text-sm font-semibold">
            {searchTerm
              ? `Try a different search term.`
              : 'Reviews will appear here once customers leave feedback.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card
                  className="p-6 transition-all group relative overflow-hidden"
                  style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <p className="font-bold text-white">
                        To: <span className="text-[#F4B400]">{review.provider?.user?.name || '—'}</span>
                      </p>
                      <p className="text-xs text-[#9099A8] font-semibold mt-0.5">
                        From: {review.user?.name || '—'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting === review.id}
                      className="p-2 rounded-xl transition-all disabled:opacity-50"
                      style={{ color: '#F87171', background: 'rgba(239,68,68,0.1)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                    >
                      {deleting === review.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Stars */}
                  <div className="flex mb-3 items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= (review.rating || 0) ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-white/10 text-white/10'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#9099A8]">{review.rating}/5</span>
                  </div>

                  <p className="text-[#C9CED6] italic leading-relaxed text-sm">
                    "{review.comment || review.text || 'No comment'}"
                  </p>

                  <div className="mt-4 text-[10px] text-[#9099A8]/60 font-bold uppercase tracking-wider">
                    Review #{review.id}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviews;

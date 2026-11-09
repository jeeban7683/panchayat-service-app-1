import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Trash2, Loader2, AlertTriangle,
  RefreshCw, MessageSquare, StarOff, CheckCircle2,
  User, Shield, Sparkles
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
    className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-bold ${
      type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-red-600 text-white shadow-red-200'
    }`}
  >
    {type === 'success'
      ? <CheckCircle2 className="w-4.5 h-4.5 text-emerald-200 shrink-0" />
      : <AlertTriangle className="w-4.5 h-4.5 text-red-200 shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-base leading-none">×</button>
  </motion.div>
);

const AdminReviews = () => {
  const [reviews,      setReviews]      = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState(null);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated,  setLastUpdated]  = useState(new Date());
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
    try {
      await fetchReviews(true);
      setLastUpdated(new Date());
      showToast('Reviews refreshed successfully!', 'success');
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-gray-500 font-medium bg-[#F5F3FF]">
        <div className="relative">
          <div className="w-20 h-20 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8B5CF6' }} />
          <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-medium">Loading review moderation data...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 bg-[#F5F3FF]">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Failed to load reviews</h3>
        <p className="text-gray-500 text-sm max-w-sm font-normal">{error}</p>
        <GlowButton onClick={() => fetchReviews()} variant="primary" className="px-6 py-2.5 text-sm font-semibold">
          Try Again
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-purple-100 text-[#8B5CF6]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Review Moderation</h1>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm font-normal ml-[52px]">Monitor and moderate customer reviews across the platform.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-gray-900 placeholder-gray-400 outline-none transition-all text-xs font-semibold bg-white border border-purple-100 shadow-xs"
              onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] active:scale-95 shadow-md shadow-purple-200 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl p-5 flex items-center gap-4 bg-white border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.1)] transition-all">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs"
          >
            <MessageSquare className="w-7 h-7" />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Total Reviews</p>
          </div>
        </div>

        <div className="rounded-3xl p-5 flex items-center gap-4 bg-white border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.1)] transition-all">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-amber-50 border border-amber-100 text-amber-500 shadow-xs"
          >
            <Star className="w-7 h-7 fill-amber-400" />
          </motion.div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgRating} <span className="text-xs font-semibold text-gray-400">/ 5.0</span></p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Avg Rating</p>
          </div>
        </div>

        <div className="rounded-3xl p-5 flex items-center gap-4 bg-white border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.1)] transition-all">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 border border-purple-100 text-[#8B5CF6] shadow-xs">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex items-center justify-center"
            >
              <Sparkles className="w-7 h-7 text-[#8B5CF6]" />
            </motion.div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.rating >= 4).length}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">4+ Star Reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {filtered.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center rounded-3xl text-center px-6 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-purple-50 border border-purple-100">
            <StarOff className="w-8 h-8 text-[#8B5CF6]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {searchTerm ? 'No reviews match your search' : 'No reviews yet'}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm font-normal max-w-sm">
            {searchTerm
              ? `Try adjusting your search criteria.`
              : 'Reviews will appear here automatically as customers submit service feedback.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((review, i) => {
              const providerName = review.provider?.user?.name || review.providerName || 'Service Provider';
              const reviewerName = review.user?.name || review.userName || 'Anonymous User';
              const rating = review.rating || 5;
              const comment = review.comment || review.text || 'No detailed feedback provided.';

              return (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className="p-6 rounded-3xl bg-white border border-purple-50 shadow-[0_8px_30px_rgba(99,102,241,0.06)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.12)] transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-[#8B5CF6] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Provider: <span className="text-[#8B5CF6] font-extrabold">{providerName}</span>
                          </p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">
                            {reviewerName}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={deleting === review.id}
                        title="Delete Review"
                        className="p-2.5 rounded-2xl transition-all disabled:opacity-50 bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer shadow-xs"
                      >
                        {deleting === review.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl bg-amber-50/60 border border-amber-100/60 w-fit">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-amber-700">{rating} / 5.0</span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs sm:text-sm text-gray-700 font-normal italic leading-relaxed bg-[#FAFAFF] p-3.5 rounded-2xl border border-purple-50">
                      "{comment}"
                    </p>

                    <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2 border-t border-purple-50">
                      <span>Review #{review.id}</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Verified</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
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

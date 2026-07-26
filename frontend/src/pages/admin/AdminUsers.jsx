import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Phone, Mail, Users, Loader2,
  AlertTriangle, RefreshCw, UserX
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';

// ── Role Badge ────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const map = {
    ADMIN:    'bg-purple-500/10 text-purple-400 border-purple-500/20',
    PROVIDER: 'bg-[#F4B400]/10 text-[#FBBF24] border-[#F4B400]/25',
    USER:     'bg-white/5 text-[#9099A8] border-white/10',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${map[role] || map.USER}`}>
      {role || 'USER'}
    </span>
  );
};

const AdminUsers = () => {
  const [users,       setUsers]       = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [searchTerm,  setSearchTerm]  = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Fetch Users ───────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      if (!silent) setError('Failed to load users. Please try again.');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers(true);
    setIsRefreshing(false);
  };

  // ── Filter ────────────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name  || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    );
  });

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-[#9099A8] font-medium">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#F4B400]/20 border-t-[#F4B400] rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-[#F4B400] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-semibold">Loading users...</p>
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
        <h3 className="text-xl font-bold text-white">Failed to load users</h3>
        <p className="text-[#9099A8] text-sm max-w-sm">{error}</p>
        <GlowButton onClick={() => fetchUsers()} variant="primary" className="px-6 py-2.5 text-sm font-bold">
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
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}>
              <Users className="w-5 h-5 text-[#F4B400]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">User Monitoring</h1>
          </div>
          <p className="text-[#9099A8] text-sm font-semibold ml-13">Monitor all registered platform users.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9099A8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
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
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users',     value: users.length,                                     style: { background: 'rgba(244,180,0,0.05)', color: '#F4B400', border: '1px solid rgba(244,180,0,0.15)' } },
          { label: 'Providers',       value: users.filter(u => u.role === 'PROVIDER').length,  style: { background: 'rgba(52,211,153,0.05)', color: '#34D399', border: '1px solid rgba(52,211,153,0.15)' } },
          { label: 'Showing',         value: filtered.length,                                  style: { background: '#14181F', color: '#9099A8', border: '1px solid rgba(255,255,255,0.08)' } },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 flex flex-col" style={s.style}>
            <span className="text-2xl font-black">{s.value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-75">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[#9099A8] text-[10px] uppercase font-bold tracking-wider border-b" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <th className="px-6 py-5">User</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 text-right">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <UserX className="w-7 h-7 text-[#9099A8]" />
                      </div>
                      <p className="text-[#9099A8] text-sm font-semibold">
                        {searchTerm ? `No users match "${searchTerm}"` : 'No users registered yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black text-sm shrink-0" style={{ background: '#F4B400' }}>
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white group-hover:text-[#F4B400] transition-colors">{user.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#C9CED6] font-semibold">
                          <Mail className="w-3.5 h-3.5 text-[#9099A8]" /> {user.email || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#9099A8] font-medium">
                          <Phone className="w-3.5 h-3.5 text-[#9099A8]/60" /> {user.phone || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-[#9099A8]">#{user.id}</span>
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

export default AdminUsers;

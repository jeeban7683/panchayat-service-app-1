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
    ADMIN: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    PROVIDER: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/25',
    USER: 'bg-white/5 text-gray-500 border-white/10',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-medium rounded-lg border uppercase tracking-wider ${map[role] || map.USER}`}>
      {role || 'USER'}
    </span>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  //  Fetch Users
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

  // ── Filter
  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q)
    );
  });

  // ── Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-gray-500 font-medium">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-medium">Loading users...</p>
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
        <h3 className="text-xl font-semibold text-gray-900">Failed to load users</h3>
        <p className="text-gray-500 text-sm max-w-sm">{error}</p>
        <GlowButton onClick={() => fetchUsers()} variant="primary" className="px-6 py-2.5 text-sm font-semibold">
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
              <Users className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Monitoring</h1>
          </div>
          <p className="text-gray-500 text-sm font-normal ml-13">Monitor all registered platform users.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all bg-[#8B5CF6] text-white hover:bg-[#7C3AED] active:scale-95 shadow-md shadow-purple-200 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, style: { background: 'rgba(244,180,0,0.05)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.15)' } },
          { label: 'Providers', value: users.filter(u => u.role === 'PROVIDER').length, style: { background: 'rgba(52,211,153,0.05)', color: '#34D399', border: '1px solid rgba(52,211,153,0.15)' } },
          { label: 'Showing', value: filtered.length, style: { background: '#FFFFFF', color: '#6B7280', border: '1px solid rgba(139,92,246,0.08)' } },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4 flex flex-col" style={s.style}>
            <span className="text-2xl font-bold text-gray-900">{s.value}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5 text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-gray-600 text-xs uppercase font-semibold tracking-wider border-b border-purple-100 bg-[#FAFAFF]">
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
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.08)' }}>
                        <UserX className="w-7 h-7 text-gray-500" />
                      </div>
                      <p className="text-gray-500 text-sm font-normal">
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
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-black text-sm shrink-0" style={{ background: '#8B5CF6' }}>
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#8B5CF6] transition-colors">{user.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <Mail className="w-3.5 h-3.5 text-purple-600" /> {user.email || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-normal">
                          <Phone className="w-3.5 h-3.5 text-purple-600" /> {user.phone || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-medium text-gray-500">#{user.id}</span>
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

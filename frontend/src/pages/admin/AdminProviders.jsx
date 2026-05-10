import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, Eye, MapPin, Phone, Mail, DollarSign, Clock, Briefcase, X, TrendingUp, Users, Activity, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar } from 'recharts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_PROVIDERS = [];

const ANALYTICS_DATA = [];

const AdminProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'ANALYTICS' or 'REPORT'

  const filteredProviders = MOCK_PROVIDERS.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || provider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (provider, type) => {
    setSelectedProvider(provider);
    setActiveModal(type);
  };

  const closeModal = () => {
    setSelectedProvider(null);
    setActiveModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Provider Monitoring</h1>
          <p className="text-slate-400 mt-1">Real-time oversight of service professionals and earnings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search providers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
            />
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-inner">
            {['ALL', 'PENDING', 'VERIFIED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-700">
                <th className="px-6 py-5 font-semibold">Provider & Contact</th>
                <th className="px-6 py-5 font-semibold text-center">Status</th>
                <th className="px-6 py-5 font-semibold">Live Tracking</th>
                <th className="px-6 py-5 font-semibold">Total Revenue</th>
                <th className="px-6 py-5 font-semibold text-right">Monitoring Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/20">
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium italic">
                    No providers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-slate-800/40 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-blue-400 border border-slate-700 group-hover:border-blue-500/50 transition-all">
                          {provider.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{provider.name}</span>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {provider.service}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {provider.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${
                        provider.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                        provider.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${
                          provider.location === 'Active Now' ? 'bg-emerald-500 animate-pulse' : 
                          provider.location === 'At User House' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700'
                        }`} />
                        <span className={`text-sm font-bold ${
                          provider.location === 'Active Now' ? 'text-emerald-400' : 
                          provider.location === 'At User House' ? 'text-blue-400' : 'text-slate-500'
                        }`}>
                          {provider.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-white font-black text-base">{provider.earnings}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Platform Revenue</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openModal(provider, 'ANALYTICS')}
                          className="bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-blue-400 border border-slate-700 hover:border-blue-500/50 transition-all shadow-sm group/btn" 
                          title="Live Analytics"
                        >
                          <Activity className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => openModal(provider, 'REPORT')}
                          className="bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-all shadow-sm group/btn" 
                          title="View Full Report"
                        >
                          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Monitoring Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-600/20">
                    {selectedProvider?.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedProvider?.name}</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{activeModal === 'ANALYTICS' ? 'Real-time Analytics' : 'Professional Report'}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {activeModal === 'ANALYTICS' ? (
                  <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mb-4" />
                        <div className="text-2xl font-black text-white">₹{selectedProvider?.earnings}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Net Revenue</div>
                      </div>
                      <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                        <Users className="w-6 h-6 text-blue-400 mb-4" />
                        <div className="text-2xl font-black text-white">42</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Total Bookings</div>
                      </div>
                      <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50">
                        <Star className="w-6 h-6 text-amber-400 mb-4" />
                        <div className="text-2xl font-black text-white">{selectedProvider?.rating || 'N/A'}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Customer Satisfaction</div>
                      </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 h-[350px]">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Revenue Growth (Last 7 Days)
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ANALYTICS_DATA}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', color: '#fff' }}
                            itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" /> Contact Details
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase">Mobile</span>
                            <span className="text-white font-bold">{selectedProvider?.phone}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase">Email</span>
                            <span className="text-white font-bold">{selectedProvider?.email}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs font-bold uppercase">Work Area</span>
                            <span className="text-white font-bold">Mumbai South</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Compliance Status
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-white text-sm">Aadhar Verified</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-white text-sm">Bank Details Verified</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-slate-600" />
                            </div>
                            <span className="text-slate-500 text-sm italic">Insurance Renewal Pending</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Recent Feedback Monitoring</h4>
                      {[
                        { user: 'John D.', comment: 'Expert plumber, very punctual.', rating: 5, time: '2 days ago' },
                        { user: 'Sarah M.', comment: 'Good work but arrived 15 mins late.', rating: 4, time: '1 week ago' },
                        { user: 'Vikram R.', comment: 'Highly recommended for complex leaks.', rating: 5, time: '2 weeks ago' },
                      ].map((review, i) => (
                        <div key={i} className="p-4 bg-slate-800/20 rounded-2xl border border-slate-700/30">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-blue-400">{review.user}</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase">{review.time}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2 italic">"{review.comment}"</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-800/30 border-t border-slate-800 flex justify-between items-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Generated by Panchayat Admin Core v1.2</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-slate-700" onClick={closeModal}>Close View</Button>
                  {activeModal === 'REPORT' && <Button variant="primary" size="sm">Download Full PDF</Button>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default AdminProviders;

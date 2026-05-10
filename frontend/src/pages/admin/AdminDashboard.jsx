import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Activity, Shield, TrendingUp, Search, Bell, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { title: 'Total Active Users', value: '0', icon: Users, trend: '0%', color: 'blue' },
    { title: 'Verified Providers', value: '0', icon: Briefcase, trend: '0%', color: 'emerald' },
    { title: 'System Status', value: '100%', icon: Activity, trend: 'Stable', color: 'indigo' },
    { title: 'Platform Revenue', value: '₹0', icon: DollarSign, trend: '0%', color: 'purple' }
  ]);
  const [recentApps, setRecentApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        const { stats: statsData, recentApplications } = response.data;
        
        setStats(prev => prev.map(s => {
          if (s.title === 'Total Active Users') return { ...s, value: statsData.users, trend: statsData.usersTrend };
          if (s.title === 'Verified Providers') return { ...s, value: statsData.providers, trend: statsData.providersTrend };
          if (s.title === 'Platform Revenue') return { ...s, value: `₹${statsData.revenue}`, trend: statsData.revenueTrend };
          return s;
        }));
        
        setRecentApps(recentApplications);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Command Center</h1>
          <p className="text-slate-400 font-medium">Platform-wide monitoring and resource management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 relative">
            <Bell className="w-5 h-5 text-slate-400" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 relative group overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-${stat.color}-500/10`} />
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 uppercase">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.title}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-slate-700/50">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h3 className="font-black text-white text-lg tracking-tight">Active Applications</h3>
              <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-all">View All Entries</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                    <th className="px-8 py-4">Professional</th>
                    <th className="px-8 py-4">Expertise</th>
                    <th className="px-8 py-4">Received</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentApps.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-12 text-center text-slate-500 font-medium italic">
                        No active applications found.
                      </td>
                    </tr>
                  ) : (
                    recentApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/30 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <img src={app.img} alt="" className="w-9 h-9 rounded-xl border border-slate-700 object-cover" />
                            <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{app.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-400 font-bold text-xs uppercase tracking-tight">{app.service}</td>
                        <td className="px-8 py-5 text-slate-500 font-bold text-xs">{app.date}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider ${app.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all border border-slate-700">
                            <Activity className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <Card className="p-8 border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" /> Infrastructure Logs
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Security Protocol', status: 'Operational', color: 'emerald' },
                { title: 'API Gateway', status: 'Stable (12ms)', color: 'blue' },
                { title: 'Database Sync', status: 'Backup Running', color: 'amber' },
              ].map((log, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{log.title}</span>
                    <span className={`text-[10px] font-black text-${log.color}-400 uppercase`}>{log.status}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full bg-${log.color}-500/50`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16" />
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Platform Intelligence</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">User engagement is up 12% following the 3D UI deployment. Monitoring systems are active.</p>
            <Button variant="primary" className="w-full py-4 shadow-xl shadow-blue-600/20">Full Analytics Suite</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

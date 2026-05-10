import React, { useEffect, useState } from 'react';
import { Calendar, Wallet, CheckCircle2, Navigation, Star, Clock, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: 'Total Bookings', value: '0', icon: Calendar, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { title: 'Total Spent', value: '₹0', icon: Wallet, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { title: 'Completed', value: '0', icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  ]);

  const [recentServices, setRecentServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/dashboard');
        const { stats: statsData, recentServices: services } = response.data;
        
        setStats([
          { title: 'Total Bookings', value: statsData.totalBookings, icon: Calendar, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { title: 'Total Spent', value: `₹${statsData.totalSpent}`, icon: Wallet, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
          { title: 'Completed', value: statsData.completedBookings, icon: CheckCircle2, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
        ]);
        
        setRecentServices(services);
      } catch (error) {
        console.error('Failed to fetch user dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 tracking-wide pb-1">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Here's what's happening with your account today.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition">
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 flex flex-col">
            <div className={`w-12 h-12 rounded-lg border ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">Current Booking Status</h3>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center mb-4">
                <Navigation className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="font-bold text-white mb-2">No active bookings</h4>
              <p className="text-slate-400 text-sm mb-4">You don't have any services currently in progress.</p>
              <button className="text-blue-400 font-medium hover:text-white transition-colors">Browse Services &rarr;</button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg">Recent Services</h3>
              <button className="text-sm text-blue-400 hover:text-white transition-colors font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentServices.length === 0 ? (
                <div className="py-8 text-center text-slate-500 italic bg-slate-900/50 rounded-xl border border-slate-700">No recent services.</div>
              ) : (
                recentServices.map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">Home Cleaning</p>
                      <p className="text-sm text-slate-400">Completed 2 days ago</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${120 - i * 15}</p>
                      <p className="text-sm text-green-400 font-medium">Paid</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 self-start">
          <h3 className="font-bold text-white mb-6 text-lg">Booking Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-700"></div>
            {[
              { title: 'Requested', desc: '10:00 AM', status: 'done' },
              { title: 'Accepted', desc: '10:05 AM', status: 'done' },
              { title: 'In Progress', desc: 'Working', status: 'current' },
              { title: 'Completed', desc: 'Pending', status: 'upcoming' },
            ].map((step, i) => (
              <div key={i} className="relative flex items-start mb-6 last:mb-0">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.status === 'done' ? 'bg-slate-900 border-green-500 text-green-400' :
                  step.status === 'current' ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    'bg-slate-900 border-slate-700 text-slate-500'
                  }`}>
                  {step.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="ml-4 mt-0.5">
                  <h4 className={`font-bold ${step.status === 'upcoming' ? 'text-slate-500' : 'text-white'}`}>{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

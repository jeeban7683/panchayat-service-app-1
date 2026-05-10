import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Star, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function ProviderDashboard() {
  const [stats, setStats] = useState([
    { title: 'Total Earnings', value: '₹0', icon: DollarSign, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { title: 'Active Jobs', value: '0', icon: Clock, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { title: 'Rating', value: 'N/A', icon: Star, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  ]);

  const [activeRequests, setActiveRequests] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const response = await api.get('/provider/dashboard');
        const { stats: statsData, activeRequests: requests, recentReviews: reviews } = response.data;
        
        setStats([
          { title: 'Total Earnings', value: `₹${statsData.earnings}`, icon: DollarSign, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
          { title: 'Active Jobs', value: statsData.activeJobs, icon: Clock, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { title: 'Rating', value: statsData.rating || 'N/A', icon: Star, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
        ]);
        
        setActiveRequests(requests);
        setRecentReviews(reviews);
      } catch (error) {
        console.error('Failed to fetch provider dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviderData();
  }, []);

  // Real-time location sharing
  useEffect(() => {
    let interval;
    if (!isLoading) {
      const updateLocation = () => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            try {
              await api.post('/provider/location', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            } catch (error) {
              console.error('Error updating location:', error);
            }
          });
        }
      };

      updateLocation();
      interval = setInterval(updateLocation, 30000); // Update every 30 seconds
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 tracking-wide pb-1">Provider Overview</h1>
          <p className="text-slate-400 mt-1 font-medium">Track your performance and manage incoming requests.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition">
            Go Offline
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition">
            View Payouts
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 flex flex-col items-start transition-colors hover:border-slate-600">
            <div className={`p-3 rounded-xl border ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg">Active Requests</h3>
          </div>
          <div className="space-y-4">
            {activeRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic bg-slate-900 rounded-xl border border-slate-700">No active requests at the moment.</div>
            ) : (
              activeRequests.map((request, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 hover:bg-slate-800 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="px-2.5 py-1 text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg">Pending</span>
                      <span className="text-slate-400 text-xs font-medium">Requested 10 mins ago</span>
                    </div>
                    <p className="text-white font-bold text-lg">Plumbing Repair</p>
                    <p className="text-sm text-slate-400">123 Main St, New York</p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end justify-center">
                    <p className="text-white font-bold sm:mb-2 text-2xl">${85}</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm font-medium border border-slate-600 text-white bg-slate-800 rounded-lg hover:bg-slate-700">Decline</button>
                      <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500">Accept</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 h-fit">
          <h3 className="font-bold text-white text-lg mb-6">Recent Reviews</h3>
          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic bg-slate-900 rounded-xl border border-slate-700">No reviews received yet.</div>
            ) : (
              recentReviews.map((review, i) => (
                <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="Sarah" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-white font-bold text-sm">Sarah Jenkins</p>
                    </div>
                    <div className="flex gap-1 text-yellow-500">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">"Excellent service, arrived on time and fixed the issue quickly!"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

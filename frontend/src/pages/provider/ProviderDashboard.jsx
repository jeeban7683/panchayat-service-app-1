import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Star, Clock, HeadphonesIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../../components/ui/GlowButton';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const providerId = user?.provider?.id || localStorage.getItem('providerId') || 11;

  useEffect(() => { if (providerId) fetchBookings(); }, [providerId]);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/bookings/provider/${providerId}`);
      setBookings(response.data);
      setStats([
        { title: 'Total Earnings', value: `₹${response.data.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + (b.provider?.price || 0), 0)}`, icon: DollarSign, bg: '#DCFCE7', color: '#16A34A' },
        { title: 'Active Jobs', value: response.data.filter(b => b.status === 'ACCEPTED').length, icon: Clock, bg: '#FEF3C7', color: '#D97706' },
        { title: 'Rating', value: '4.8', icon: Star, bg: '#F3F0FF', color: '#8B5CF6' },
      ]);
    } catch (error) { console.error('Failed to fetch provider bookings:', error); }
    finally { setIsLoading(false); }
  };

  const acceptBooking = async (id) => { try { await api.put(`/bookings/${id}/accept`); fetchBookings(); } catch (error) { console.error(error); } };
  const rejectBooking = async (id) => { try { await api.put(`/bookings/${id}/reject`); fetchBookings(); } catch (error) { console.error(error); } };
  const completeBooking = async (id) => { try { await api.put(`/bookings/${id}/complete`); fetchBookings(); } catch (error) { console.error(error); } };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: { bg: '#FEF3C7', color: '#D97706', border: 'rgba(245,158,11,0.2)' },
      ACCEPTED: { bg: '#F3F0FF', color: '#8B5CF6', border: 'rgba(139,92,246,0.2)' },
      IN_PROGRESS: { bg: '#EDE9FE', color: '#6D28D9', border: 'rgba(109,40,217,0.2)' },
      COMPLETED: { bg: '#DCFCE7', color: '#16A34A', border: 'rgba(34,197,94,0.2)' },
      REJECTED: { bg: '#FEE2E2', color: '#DC2626', border: 'rgba(239,68,68,0.2)' },
    };
    return map[status] || map.PENDING;
  };

  if (isLoading) return <div className="p-10 text-gray-500 font-medium bg-[#F5F3FF] min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F3FF] min-h-screen">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight pb-1">Provider Overview</h1>
          <p className="text-gray-600 text-sm font-normal">Track your performance and manage incoming requests.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <GlowButton variant="secondary" className="px-5 py-2 text-xs">Go Offline</GlowButton>
          <GlowButton variant="outline" className="px-5 py-2 text-xs">View Payouts</GlowButton>
          <button
            onClick={() => navigate('/provider/chat?role=ADMIN')}
            className="flex items-center gap-2 px-5 py-2.5 text-white text-xs font-medium rounded-full hover:scale-105 transition-all shadow-md"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            <HeadphonesIcon className="w-3.5 h-3.5" /> Contact Admin
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <div className="p-3 rounded-2xl shrink-0" style={{ background: stat.bg }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-0.5">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTIVE REQUESTS */}
        <div className="rounded-3xl p-6 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
          <h3 className="font-semibold text-gray-900 text-base mb-5">Active Requests</h3>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="py-12 text-center text-gray-500 rounded-2xl text-sm font-medium bg-white border border-purple-100 shadow-xs">
                No active requests at the moment.
              </div>
            ) : (
              bookings.map((booking) => {
                const s = getStatusBadge(booking.status);
                return (
                  <div key={booking.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl transition-all duration-200 bg-[#FAFAFF] border border-purple-50 hover:border-purple-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-[10px] font-medium rounded-full uppercase tracking-wider border shadow-xs"
                          style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-900 font-semibold text-base">{booking.service?.name}</p>
                      <p className="text-xs text-gray-600 mt-1 font-normal">{booking.requirements || 'No special requirements'}</p>
                      <p className="text-xs text-gray-600 mt-2 font-normal">📍 {booking.address}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-center">
                      <p className="text-gray-900 font-semibold sm:mb-2 text-xl">₹{booking.provider?.price}</p>
                      <div className="flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button onClick={() => rejectBooking(booking.id)}
                              className="px-4 py-2 text-xs font-medium rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white transition-all">
                              Reject
                            </button>
                            <button onClick={() => acceptBooking(booking.id)}
                              className="px-4 py-2 text-xs font-medium rounded-full text-white transition-all hover:scale-105 shadow-md"
                              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                              Accept
                            </button>
                          </>
                        )}
                        {booking.status === 'ACCEPTED' && (
                          <button onClick={() => completeBooking(booking.id)}
                            className="px-4 py-2 text-xs font-medium rounded-full text-white transition-all hover:scale-105 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' }}>
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="rounded-3xl p-6 h-fit bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
          <h3 className="font-semibold text-gray-900 text-base mb-5">Recent Reviews</h3>
          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <div className="py-12 text-center text-gray-500 rounded-2xl text-sm font-medium bg-white border border-purple-100 shadow-xs">
                No reviews received yet.
              </div>
            ) : (
              recentReviews.map((review, i) => (
                <div key={i} className="p-5 rounded-2xl text-sm text-gray-600 leading-relaxed italic bg-[#FAFAFF] border border-purple-50">
                  "{review.comment}"
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
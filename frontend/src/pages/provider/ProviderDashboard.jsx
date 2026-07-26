import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Star,
  Clock,
  HeadphonesIcon
} from 'lucide-react';

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

  // Get dynamic provider ID from user context or local storage
  const providerId = user?.provider?.id || localStorage.getItem('providerId') || 11;

  useEffect(() => {
    if (providerId) {
      fetchBookings();
    }
  }, [providerId]);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/bookings/provider/${providerId}`);
      console.log("PROVIDER BOOKINGS:", response.data);
      setBookings(response.data);

      // UPDATE STATS
      setStats([
        {
          title: 'Total Earnings',
          value: `₹${response.data
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + (b.provider?.price || 0), 0)}`,
          icon: DollarSign,
          bg: 'rgba(52,211,153,0.1)',
          border: 'rgba(52,211,153,0.2)',
          color: '#34D399',
        },
        {
          title: 'Active Jobs',
          value: response.data.filter(b => b.status === 'ACCEPTED').length,
          icon: Clock,
          bg: 'rgba(244,180,0,0.1)',
          border: 'rgba(244,180,0,0.2)',
          color: '#F4B400',
        },
        {
          title: 'Rating',
          value: '4.8',
          icon: Star,
          bg: 'rgba(251,191,36,0.1)',
          border: 'rgba(251,191,36,0.2)',
          color: '#FBBF24',
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch provider bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/accept`);
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/reject`);
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const completeBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/complete`);
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: { bg: 'rgba(244,180,0,0.12)', color: '#F4B400', border: 'rgba(244,180,0,0.3)' },
      ACCEPTED: { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: 'rgba(96,165,250,0.3)' },
      IN_PROGRESS: { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
      COMPLETED: { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'rgba(52,211,153,0.3)' },
      REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#F87171', border: 'rgba(239,68,68,0.3)' },
    };
    return map[status] || map.PENDING;
  };

  if (isLoading) {
    return (
      <div className="p-10 text-[#9099A8] font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight pb-1">
            Provider Overview
          </h1>
          <p className="text-[#9099A8] text-sm font-semibold">
            Track your performance and manage incoming requests.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <GlowButton variant="secondary" className="px-5 py-2 text-xs font-bold">
            Go Offline
          </GlowButton>
          <GlowButton variant="outline" className="px-5 py-2 text-xs font-bold">
            View Payouts
          </GlowButton>
          <button
            onClick={() => navigate('/provider/chat?role=ADMIN')}
            className="flex items-center gap-2 px-4 py-2 text-black text-xs font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
          >
            <HeadphonesIcon className="w-3.5 h-3.5" />
            Contact Admin
          </button>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 flex flex-col items-start transition-all duration-300 hover:-translate-y-1"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="p-3 rounded-xl mb-4 shrink-0"
              style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <h3 className="text-2xl font-black text-white mb-0.5">
              {stat.value}
            </h3>
            <p className="text-[#9099A8] text-xs font-bold uppercase tracking-wider">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTIVE REQUESTS */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="font-bold text-white text-base mb-5">
            Active Requests
          </h3>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div
                className="py-12 text-center text-[#9099A8] italic rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                No active requests at the moment.
              </div>
            ) : (
              bookings.map((booking) => {
                const s = getStatusBadge(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="text-white font-bold text-base">
                        {booking.service?.name}
                      </p>
                      <p className="text-xs text-[#9099A8] mt-1">
                        {booking.requirements || 'No special requirements'}
                      </p>
                      <p className="text-[11px] text-[#9099A8] mt-2 font-semibold">
                        📍 {booking.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end justify-center">
                      <p className="text-white font-black sm:mb-2 text-xl">
                        ₹{booking.provider?.price}
                      </p>

                      <div className="flex gap-2">
                        {booking.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => rejectBooking(booking.id)}
                              className="px-4 py-2 text-xs font-bold rounded-lg transition-colors"
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => acceptBooking(booking.id)}
                              className="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:-translate-y-0.5 text-black"
                              style={{ background: 'linear-gradient(135deg, #F4B400, #FFC928)', boxShadow: '0 2px 12px rgba(244,180,0,0.3)' }}
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {booking.status === 'ACCEPTED' && (
                          <button
                            onClick={() => completeBooking(booking.id)}
                            className="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:-translate-y-0.5 text-black"
                            style={{ background: 'linear-gradient(135deg, #34D399, #10B981)', boxShadow: '0 2px 12px rgba(52,211,153,0.3)' }}
                          >
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
        <div
          className="rounded-2xl p-6 h-fit"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="font-bold text-white text-base mb-5">
            Recent Reviews
          </h3>

          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <div
                className="py-12 text-center text-[#9099A8] italic rounded-xl text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                No reviews received yet.
              </div>
            ) : (
              recentReviews.map((review, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl text-sm text-[#C9CED6] leading-relaxed italic"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
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
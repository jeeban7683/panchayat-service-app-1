import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Navigation,
  Clock,
  HeadphonesIcon
} from 'lucide-react';

import api from '../../services/api';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // CHANGE THIS LATER AFTER AUTH
  const userId = 6;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/bookings/user/${userId}`);
      console.log(response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // STATS
  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    booking => booking.status === 'COMPLETED'
  ).length;

  const totalSpent = bookings.reduce(
    (total, booking) => total + (booking.provider?.price || 0),
    0
  );

  // ACTIVE BOOKING
  const activeBooking = bookings.find(
    booking =>
      booking.status === 'PENDING' ||
      booking.status === 'ACCEPTED' ||
      booking.status === 'IN_PROGRESS'
  );

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

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-[#9099A8] text-sm mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/chat?role=ADMIN')}
          className="flex items-center gap-2 px-4 py-2.5 text-black text-sm font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
        >
          <HeadphonesIcon className="w-4 h-4" />
          Contact Admin
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* TOTAL BOOKINGS */}
        <div
          className="rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
          >
            <Calendar size={22} className="text-[#F4B400]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{totalBookings}</h2>
            <p className="text-[#9099A8] text-xs font-bold uppercase tracking-wider mt-0.5">Total Bookings</p>
          </div>
        </div>

        {/* TOTAL SPENT */}
        <div
          className="rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}
          >
            <Wallet size={22} className="text-[#60A5FA]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">₹{totalSpent}</h2>
            <p className="text-[#9099A8] text-xs font-bold uppercase tracking-wider mt-0.5">Total Spent</p>
          </div>
        </div>

        {/* COMPLETED */}
        <div
          className="rounded-2xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}
          >
            <CheckCircle2 size={22} className="text-[#34D399]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{completedBookings}</h2>
            <p className="text-[#9099A8] text-xs font-bold uppercase tracking-wider mt-0.5">Completed</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* ACTIVE BOOKING */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <h3 className="text-lg font-bold text-white">
                Current Booking Status
              </h3>
            </div>

            <div className="p-6">
              {activeBooking ? (
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <h3 className="text-lg font-black text-white mb-1.5">
                    {activeBooking.service?.name}
                  </h3>
                  <p className="text-[#C9CED6] text-sm mb-3">
                    {activeBooking.requirements}
                  </p>
                  <div className="space-y-1.5 text-xs text-[#9099A8]">
                    <p>📍 {activeBooking.address}</p>
                    <p>📅 {activeBooking.date}</p>
                  </div>

                  <div className="mt-4">
                    {(() => {
                      const s = getStatusBadge(activeBooking.status);
                      return (
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          {activeBooking.status}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Navigation className="mx-auto text-[#9099A8] mb-4" size={40} />
                  <h3 className="text-lg font-bold text-white mb-1">
                    No Active Bookings
                  </h3>
                  <p className="text-[#9099A8] text-sm">
                    You don't have any active bookings right now.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h3 className="text-lg font-bold text-white mb-5">
              Recent Bookings
            </h3>

            {loading ? (
              <div className="text-center py-8 text-sm text-[#9099A8]">
                Loading...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#9099A8]">
                No bookings found
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const s = getStatusBadge(booking.status);
                  return (
                    <div
                      key={booking.id}
                      className="rounded-xl p-4 flex justify-between items-start gap-4 transition-all duration-200 hover:border-[#F4B400]/20"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {booking.service?.name}
                        </h4>
                        <p className="text-[#9099A8] text-xs mt-1">
                          {booking.requirements}
                        </p>
                        <div className="space-y-0.5 text-[11px] text-[#9099A8] mt-2.5">
                          <p>📍 {booking.address}</p>
                          <p>📅 {booking.date}</p>
                        </div>
                      </div>
                      <div>
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="rounded-2xl p-6 h-fit"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-lg font-bold text-white mb-5">
            Booking Timeline
          </h3>

          <div className="space-y-5">
            {[
              'PENDING',
              'ACCEPTED',
              'IN_PROGRESS',
              'COMPLETED'
            ].map((step, index) => {
              const exists = bookings.some(
                booking => booking.status === step
              );
              const s = getStatusBadge(step);

              return (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center border shrink-0"
                    style={exists ? {
                      background: s.bg,
                      borderColor: s.border,
                      color: s.color,
                    } : {
                      background: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.1)',
                      color: '#9099A8',
                    }}
                  >
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {step}
                    </h4>
                    <p className="text-[#9099A8] text-xs">
                      {exists ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
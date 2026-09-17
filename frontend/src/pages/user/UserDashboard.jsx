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
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bookings/user/${userId}`);
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
      PENDING: { bg: '#FEF3C7', color: '#D97706', border: 'rgba(245,158,11,0.2)' },
      ACCEPTED: { bg: '#F3F0FF', color: '#8B5CF6', border: 'rgba(139,92,246,0.2)' },
      IN_PROGRESS: { bg: '#EDE9FE', color: '#6D28D9', border: 'rgba(109,40,217,0.2)' },
      COMPLETED: { bg: '#DCFCE7', color: '#16A34A', border: 'rgba(34,197,94,0.2)' },
      REJECTED: { bg: '#FEE2E2', color: '#DC2626', border: 'rgba(239,68,68,0.2)' },
    };
    return map[status] || map.PENDING;
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F3FF] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome Back, <span className="text-[#8B5CF6]">{user?.name || 'User'}</span>
          </h1>
          <p className="text-gray-900 text-sm mt-1 font-bold">
            Here's what's happening with your account today.
          </p>
        </div>
        <button
          onClick={() => navigate('/user/chat?role=ADMIN')}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-full hover:scale-105 transition-all shadow-md shrink-0"
          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
        >
          <HeadphonesIcon className="w-4 h-4" />
          Contact Admin
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* TOTAL BOOKINGS */}
        <div
          className="rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 text-[#8B5CF6]"
          >
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{totalBookings}</h2>
            <p className="text-gray-900 text-xs font-extrabold uppercase tracking-wider mt-0.5">Total Bookings</p>
          </div>
        </div>

        {/* TOTAL SPENT */}
        <div
          className="rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-50 text-indigo-600"
          >
            <Wallet size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">₹{totalSpent}</h2>
            <p className="text-gray-900 text-xs font-extrabold uppercase tracking-wider mt-0.5">Total Spent</p>
          </div>
        </div>

        {/* COMPLETED */}
        <div
          className="rounded-3xl p-6 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600"
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{completedBookings}</h2>
            <p className="text-gray-900 text-xs font-extrabold uppercase tracking-wider mt-0.5">Completed</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* ACTIVE BOOKING */}
          <div
            className="rounded-3xl overflow-hidden bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
          >
            <div className="p-6 border-b border-purple-50 bg-[#FAFAFF]">
              <h3 className="text-lg font-bold text-gray-900">
                Current Booking Status
              </h3>
            </div>

            <div className="p-6">
              {activeBooking ? (
                <div
                  className="rounded-2xl p-5 bg-[#FAFAFF] border border-purple-50"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                    {activeBooking.service?.name}
                  </h3>
                  <p className="text-gray-900 text-sm mb-3 font-bold">
                    {activeBooking.requirements}
                  </p>
                  <div className="space-y-1 text-xs text-gray-900 font-bold">
                    <p>📍 {activeBooking.address}</p>
                    <p>📅 {activeBooking.date}</p>
                  </div>

                  <div className="mt-4">
                    {(() => {
                      const s = getStatusBadge(activeBooking.status);
                      return (
                        <span
                          className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs"
                          style={{ background: s.bg, color: s.color, borderColor: s.border }}
                        >
                          {activeBooking.status}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Navigation className="mx-auto text-purple-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No Active Bookings
                  </h3>
                  <p className="text-gray-900 text-sm font-bold">
                    You don't have any active bookings right now.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RECENT BOOKINGS */}
          <div
            className="rounded-3xl p-6 bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Recent Bookings
            </h3>

            {loading ? (
              <div className="text-center py-8 text-sm text-gray-500 font-medium">
                Loading...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 font-medium">
                No bookings found
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const s = getStatusBadge(booking.status);
                  return (
                    <div
                      key={booking.id}
                      className="rounded-2xl p-4 flex justify-between items-start gap-4 transition-all duration-200 hover:border-purple-200 bg-[#FAFAFF] border border-purple-50"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {booking.service?.name}
                        </h4>
                        <p className="text-gray-900 text-xs mt-1 font-bold">
                          {booking.requirements}
                        </p>
                        <div className="space-y-0.5 text-xs text-gray-900 mt-2 font-bold">
                          <p>📍 {booking.address}</p>
                          <p>📅 {booking.date}</p>
                        </div>
                      </div>
                      <div>
                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap border shadow-xs"
                          style={{ background: s.bg, color: s.color, borderColor: s.border }}
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
          className="rounded-3xl p-6 h-fit bg-white border border-purple-50 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Booking Timeline
            </h3>
            {activeBooking && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                Live Status
              </span>
            )}
          </div>

          {(() => {
            const statusOrder = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
            const targetBooking = activeBooking || (bookings.length > 0 ? bookings[0] : null);
            const currentStatusIndex = targetBooking ? statusOrder.indexOf(targetBooking.status) : -1;

            const timelineSteps = [
              { status: 'PENDING', label: 'PENDING', desc: 'Request Submitted' },
              { status: 'ACCEPTED', label: 'ACCEPTED', desc: 'Provider Accepted' },
              { status: 'IN_PROGRESS', label: 'IN PROGRESS', desc: 'Service In Progress' },
              { status: 'COMPLETED', label: 'COMPLETED', desc: 'Service Completed' }
            ];

            return (
              <div className="relative pl-1">
                {timelineSteps.map((step, index) => {
                  const isReached = currentStatusIndex !== -1 && index <= currentStatusIndex;
                  const isCurrent = currentStatusIndex !== -1 && index === currentStatusIndex;
                  const isCompleted = currentStatusIndex !== -1 && index < currentStatusIndex;
                  // The line connecting to the next step is green if current booking status has reached or passed the next step (i.e. index < currentStatusIndex)
                  const isLineGreen = currentStatusIndex !== -1 && index < currentStatusIndex;
                  const isLast = index === timelineSteps.length - 1;

                  return (
                    <div key={step.status} className="relative flex items-start pb-6 last:pb-0 group">
                      {/* Connected Progress Line */}
                      {!isLast && (
                        <div
                          className={`absolute left-5 top-10 bottom-0 w-1 transition-all duration-500 rounded-full ${
                            isLineGreen
                              ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                              : 'bg-purple-100'
                          }`}
                        />
                      )}

                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                          isReached
                            ? isCurrent
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 scale-105 ring-4 ring-emerald-100'
                              : 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                            : 'bg-purple-50/50 border-purple-100 text-gray-400'
                        }`}
                      >
                        {isReached ? (
                          <CheckCircle2 className="w-5 h-5 text-white stroke-[2.5]" />
                        ) : (
                          <Clock className="w-4 h-4 text-purple-300" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="ml-4 pt-1 flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={`text-sm font-black transition-colors ${
                            isReached ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 font-bold transition-colors ${
                          isReached ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
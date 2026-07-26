import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import { getUserBookings } from '../../services/bookingService';

const getStatusStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
      return { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'rgba(52,211,153,0.3)' };
    case 'PENDING':
      return { bg: 'rgba(244,180,0,0.12)', color: '#F4B400', border: 'rgba(244,180,0,0.3)' };
    case 'REJECTED':
    case 'CANCELLED':
      return { bg: 'rgba(239,68,68,0.12)', color: '#F87171', border: 'rgba(239,68,68,0.3)' };
    case 'ACCEPTED':
      return { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: 'rgba(96,165,250,0.3)' };
    default:
      return { bg: 'rgba(255,255,255,0.05)', color: '#9099A8', border: 'rgba(255,255,255,0.1)' };
  }
};

const BookingHistory = () => {
  // TEMP FIX
  const user = { id: 6 };
  const authLoading = false;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      console.log("Fetching bookings for user:", user);
      if (user?.id) {
        try {
          const response = await getUserBookings(user.id);
          console.log("Bookings received:", response.data);
          setBookings(response.data);
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        console.log("No user found");
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const providerName = b.provider?.user?.name || '';
    const serviceName = b.service?.name || '';

    const matchesSearch =
      serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#9099A8]">
        <Loader2 className="w-10 h-10 text-[#F4B400] animate-spin" />
        <p className="text-sm font-medium">Loading your booking history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Booking History
          </h1>
          <p className="text-[#9099A8] text-sm mt-1">
            View and manage your service bookings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9099A8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium"
              style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl text-[#9099A8] font-medium"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            No bookings found
          </div>
        ) : (
          filteredBookings.map((booking, idx) => {
            const s = getStatusStyle(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div
                  className="p-5 sm:p-6 rounded-2xl transition-all duration-300"
                  style={{
                    background: '#14181F',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,180,0,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="flex items-center gap-4 shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-[#F4B400]"
                        style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
                      >
                        {booking.provider?.user?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">
                          {booking.provider?.user?.name}
                        </h3>
                        <p className="text-xs font-bold text-[#F4B400] uppercase tracking-wide">
                          {booking.service?.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 w-full"
                      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#9099A8] uppercase tracking-wider block">Requirements</span>
                        <p className="text-[#C9CED6] font-medium mt-0.5">{booking.requirements || 'None specified'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#9099A8] uppercase tracking-wider block">Service Address</span>
                        <p className="text-[#C9CED6] font-medium mt-0.5">{booking.address}</p>
                      </div>
                      <div className="flex justify-between sm:justify-start items-center sm:items-start gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#9099A8] uppercase tracking-wider block">Date & Time</span>
                          <p className="text-white font-bold mt-0.5">{booking.date} at {booking.time}</p>
                        </div>
                        <span
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
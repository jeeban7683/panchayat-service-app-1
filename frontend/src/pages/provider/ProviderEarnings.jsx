import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Download, Calendar as CalendarIcon, Loader2, IndianRupee } from 'lucide-react';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';
import { getProviderBookings } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const getStatusStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    case 'ACCEPTED':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    default:
      return 'bg-purple-50 text-purple-600 border-purple-200';
  }
};

const ProviderEarnings = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (user?.provider?.id) {
        try {
          const response = await getProviderBookings(user.provider.id);
          setBookings(response.data);
        } catch (error) {
          console.error('Failed to fetch earnings:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!authLoading) {
        setIsLoading(false);
      }
    };
    fetchEarnings();
  }, [user, authLoading]);

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const pendingBookings = bookings.filter(b => b.status === 'ACCEPTED');
  
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (user?.provider?.price || 0), 0);
  const pendingClearance = pendingBookings.reduce((sum, b) => sum + (user?.provider?.price || 0), 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500 min-h-screen bg-[#F5F3FF]">
        <Loader2 className="w-10 h-10 text-[#8B5CF6] animate-spin" />
        <p className="text-sm font-semibold">Calculating your earnings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8 bg-[#F5F3FF] min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
        <p className="text-gray-500 text-sm font-normal mt-1">Track your financial performance and payouts.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 border border-purple-100 text-[#8B5CF6]">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="font-semibold text-[#8B5CF6] text-sm">Total Earnings</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {totalEarnings}</p>
          <p className="text-gray-500 text-xs mt-2.5 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Based on {completedBookings.length} completed jobs
          </p>
        </Card>
        
        <Card className="p-6 bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-100">
          <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Pending Clearance</p>
          <p className="text-3xl font-bold text-gray-900 flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {pendingClearance}</p>
          <p className="text-gray-500 text-xs mt-2.5 font-medium">{pendingBookings.length} active jobs in progress</p>
        </Card>
        
        <Card className="p-6 flex flex-col justify-between bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-100">
          <div>
            <p className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Platform Fees (Estimated)</p>
            <p className="text-3xl font-bold text-gray-900 flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {completedBookings.length * 20}</p>
          </div>
          <p className="text-xs text-gray-500 mt-2.5 flex items-center gap-1.5 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" /> ₹20 fixed fee per job
          </p>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="overflow-hidden bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-100">
        <div className="p-5 flex justify-between items-center border-b border-purple-50">
          <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
          <GlowButton variant="outline" className="text-xs px-4 py-2"><Download className="w-3.5 h-3.5 mr-1.5" /> Export Data</GlowButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider border-b border-purple-50 bg-purple-50/50">
                <th className="px-6 py-4 font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking, idx) => (
                  <motion.tr 
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500 font-medium text-xs">#{booking.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold text-sm">{booking.service?.name}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-sm">₹{user?.provider?.price || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium border uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
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

export default ProviderEarnings;

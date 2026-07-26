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
      return 'bg-green-500/10 text-[#34D399] border-green-500/20';
    case 'ACCEPTED':
      return 'bg-blue-500/10 text-[#60A5FA] border-blue-500/20';
    default:
      return 'bg-[#F4B400]/10 text-[#FBBF24] border-[#FBBF24]/20';
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
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
        <Loader2 className="w-10 h-10 text-[#1A5CC8] animate-spin" />
        <p className="text-sm font-medium">Calculating your earnings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Earnings</h1>
        <p className="text-[#9099A8] text-sm mt-1">Track your financial performance and payouts.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #14181F 0%, #1A1F28 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ background: 'rgba(244,180,0,0.1)', borderColor: 'rgba(244,180,0,0.2)', color: '#F4B400' }}>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="font-bold text-[#F4B400] text-sm">Total Earnings</p>
          </div>
          <p className="text-3xl font-black text-white flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {totalEarnings}</p>
          <p className="text-[#9099A8] text-xs mt-2.5 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-[#34D399]" /> Based on {completedBookings.length} completed jobs
          </p>
        </Card>
        
        <Card className="p-6" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-[#9099A8] font-bold text-xs uppercase tracking-wider mb-2">Pending Clearance</p>
          <p className="text-3xl font-black text-white flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {pendingClearance}</p>
          <p className="text-[#9099A8] text-xs mt-2.5 font-bold">{pendingBookings.length} active jobs in progress</p>
        </Card>
        
        <Card className="p-6 flex flex-col justify-between" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[#9099A8] font-bold text-xs uppercase tracking-wider mb-2">Platform Fees (Estimated)</p>
            <p className="text-3xl font-black text-white flex items-center gap-0.5"><IndianRupee className="w-6 h-6"/> {completedBookings.length * 20}</p>
          </div>
          <p className="text-xs text-[#9099A8] mt-2.5 flex items-center gap-1.5 font-bold">
            <CalendarIcon className="w-3.5 h-3.5 text-[#9099A8]" /> ₹20 fixed fee per job
          </p>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="overflow-hidden" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <h2 className="text-base font-bold text-white">Recent Transactions</h2>
          <GlowButton variant="outline" className="text-xs px-4 py-2"><Download className="w-3.5 h-3.5 mr-1.5" /> Export Data</GlowButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#9099A8] text-[10px] font-bold uppercase tracking-wider border-b" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <th className="px-6 py-4 font-bold">Booking ID</th>
                <th className="px-6 py-4 font-bold">Service</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[#9099A8] font-medium">
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
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#9099A8] font-semibold text-xs">#{booking.id}</td>
                    <td className="px-6 py-4 text-white font-bold text-sm">{booking.service?.name}</td>
                    <td className="px-6 py-4 text-white font-black text-sm">₹{user?.provider?.price || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
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

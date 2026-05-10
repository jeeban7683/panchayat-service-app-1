import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_BOOKINGS = [];

const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-slate-700 text-slate-400 border-slate-600';
  }
};

const BookingHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredBookings = MOCK_BOOKINGS.filter(b => {
    const matchesSearch = b.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking History</h1>
          <p className="text-slate-400 mt-1">View and manage your service bookings.</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
            />
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {['ALL', 'PENDING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-white">No bookings found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          filteredBookings.map((booking, idx) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="p-4 sm:p-6 hover:border-slate-600 transition-all">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4 shrink-0 sm:w-64">
                    <img 
                      src={booking.image} 
                      alt={booking.provider} 
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-white">{booking.provider}</h3>
                      <p className="text-sm font-medium text-blue-400">{booking.service}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="font-bold text-lg text-white">{booking.amount}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-3 justify-center shrink-0 border-t sm:border-t-0 sm:border-l border-slate-700 pt-4 sm:pt-0 sm:pl-6">
                    <Link to={`/user/bookings/${booking.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full">Details</Button>
                    </Link>
                    {booking.status === 'COMPLETED' && (
                      <Button className="flex-1 sm:flex-none">Leave Review</Button>
                    )}
                    {booking.status === 'PENDING' && (
                      <Button variant="danger" className="flex-1 sm:flex-none">Cancel</Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingHistory;

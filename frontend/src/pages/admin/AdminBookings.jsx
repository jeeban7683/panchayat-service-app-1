import { useState } from 'react';
import { Search, Filter, Calendar, Clock, CreditCard, FileText, MapPin, User, Briefcase } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_BOOKINGS = [];

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = MOCK_BOOKINGS.filter(booking => 
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Live Operations</h1>
          <p className="text-slate-400 mt-1">Track active services, time-at-location, and financial settlements.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by ID, User or Provider..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
            />
          </div>
          <Button variant="outline" className="shrink-0 border-slate-700"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-700">
                <th className="px-6 py-5 font-semibold">Booking ID</th>
                <th className="px-6 py-5 font-semibold">Client & Service</th>
                <th className="px-6 py-5 font-semibold">Professional</th>
                <th className="px-6 py-5 font-semibold text-center">Status</th>
                <th className="px-6 py-5 font-semibold">Time Monitor</th>
                <th className="px-6 py-5 font-semibold">Financials</th>
                <th className="px-6 py-5 font-semibold text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/20">
               {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium italic">
                    No bookings found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-800/40 transition-all group">
                    <td className="px-6 py-5">
                      <span className="font-black text-blue-500 text-sm">{booking.id}</span>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <Calendar className="w-3 h-3" /> {booking.date}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 font-bold text-white mb-1">
                          <User className="w-3.5 h-3.5 text-slate-500" /> {booking.customer}
                        </div>
                        <div className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded w-fit border border-blue-500/20 uppercase tracking-tighter">
                          {booking.service}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-bold text-slate-300">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {booking.provider}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${
                        booking.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        booking.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                        booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Clock className="w-4 h-4 text-slate-500" /> {booking.timeSpent}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Total at User House</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-white text-base">{booking.amount}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                          booking.payment === 'RECEIVED' ? 'text-emerald-400' : 'text-amber-500'
                        }`}>
                          {booking.payment}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {booking.receipt ? (
                        <button className="inline-flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl text-blue-400 hover:text-white border border-slate-700 hover:border-blue-500 transition-all font-bold text-xs">
                          <FileText className="w-4 h-4" /> View Receipt
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs font-bold uppercase tracking-widest italic">In Progress</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminBookings;

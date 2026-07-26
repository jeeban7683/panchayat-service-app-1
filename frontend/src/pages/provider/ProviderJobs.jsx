import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Search, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';
import {
  getProviderBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

const getStatusStyle = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500/10 text-[#34D399] border-green-500/25';
    case 'ACCEPTED':
      return 'bg-blue-500/10 text-[#60A5FA] border-blue-500/25';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-red-500/10 text-[#F87171] border-red-500/25';
    default:
      return 'bg-[#F4B400]/10 text-[#FBBF24] border-[#F4B400]/25';
  }
};

const ProviderJobs = () => {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = async () => {
    if (user?.provider?.id) {
      try {
        const response = await getProviderBookings(user.provider.id);
        setJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    } else if (!authLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, authLoading]);

  const handleAction = async (id, actionFn) => {
    setActionLoading(id);
    try {
      await actionFn(id);
      await fetchJobs(); // Refresh the list
    } catch (error) {
      console.error(`Action failed:`, error);
      alert('Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'ALL' || 
                         (filter === 'ACTIVE' && job.status === 'ACCEPTED') ||
                         (filter === 'COMPLETED' && job.status === 'COMPLETED') ||
                         (filter === 'PENDING' && job.status === 'PENDING');
                         
    const customerName = job.user?.name || '';
    const serviceName = job.service?.name || '';
    
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          serviceName.toLowerCase().includes(searchTerm.toLowerCase());
                          
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#9099A8]">
        <Loader2 className="w-10 h-10 text-[#F4B400] animate-spin" />
        <p className="text-sm font-medium">Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Jobs</h1>
          <p className="text-[#9099A8] text-sm mt-1">Track your active and completed services.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9099A8] w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-[#4B5563] outline-none transition-all text-sm font-medium"
              style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div className="flex p-1 rounded-xl w-fit" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['ALL', 'PENDING', 'ACTIVE', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className="px-4 py-2 text-xs font-bold rounded-lg transition-colors"
                style={filter === status ? {
                  background: '#F4B400',
                  color: '#000',
                  boxShadow: '0 2px 8px rgba(244,180,0,0.2)'
                } : {
                  color: '#9099A8'
                }}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {filteredJobs.length === 0 ? (
          <div
            className="text-center py-16 text-[#9099A8] rounded-2xl font-medium"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            No jobs found matching your criteria.
          </div>
        ) : (
          filteredJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="p-5 sm:p-6 transition-all duration-300"
                style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">{job.service?.name}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-[#9099A8] font-semibold text-sm mb-3">for <span className="text-white font-bold">{job.user?.name || 'Customer'}</span></p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#9099A8] font-semibold">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#9099A8]" /> ID: #{job.id}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#9099A8]" /> {job.user?.phone || 'No phone'}</span>
                    </div>
                  </div>
                  
                  <div
                    className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-4 sm:pt-0 sm:pl-8 shrink-0 gap-4 w-full sm:w-auto"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="text-left sm:text-right">
                      <div className="text-2xl font-black text-white">₹{user.provider?.price || '0'}</div>
                      <div className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider">starting price</div>
                    </div>
                    
                    <div className="flex gap-2 w-fit">
                      {job.status === 'PENDING' && (
                        <>
                          <GlowButton 
                            variant="primary" 
                            className="text-xs px-4 py-2 flex items-center gap-1.5"
                            onClick={() => handleAction(job.id, acceptBooking)}
                            disabled={actionLoading === job.id}
                          >
                            {actionLoading === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Accept
                          </GlowButton>
                          <button 
                            className="px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}
                            onClick={() => handleAction(job.id, rejectBooking)}
                            disabled={actionLoading === job.id}
                            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#F87171'; }}
                          >
                            {actionLoading === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                            Reject
                          </button>
                        </>
                      )}
                      
                      {job.status === 'ACCEPTED' && (
                        <GlowButton 
                          variant="primary"
                          className="text-xs px-4 py-2 flex items-center gap-1.5"
                          onClick={() => handleAction(job.id, completeBooking)}
                          disabled={actionLoading === job.id}
                        >
                          {actionLoading === job.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Mark Complete
                        </GlowButton>
                      )}
                    </div>
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

export default ProviderJobs;

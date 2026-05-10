import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_JOBS = [];

const ProviderJobs = () => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesFilter = filter === 'ALL' || job.status === filter;
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Jobs</h1>
          <p className="text-slate-400">Track your active and completed services.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {['ALL', 'ACTIVE', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === status
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

      <div className="space-y-4 mt-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">No jobs found matching your criteria.</div>
        ) : (
          filteredJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="p-6 transition-colors hover:border-slate-600 hover:bg-slate-800/80">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white text-lg">{job.service}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        job.status === 'COMPLETED' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium mb-3">for <span className="text-slate-300">{job.customer}</span></p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> {job.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {job.location}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="text-2xl font-bold text-white mb-2">{job.amount}</div>
                    {job.status === 'ACTIVE' && (
                      <Button size="sm" className="w-full sm:w-auto mt-2">Mark Complete</Button>
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

export default ProviderJobs;

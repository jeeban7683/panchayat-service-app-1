import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Download, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_EARNINGS = [];

const ProviderEarnings = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings</h1>
        <p className="text-slate-400 mt-1">Track your financial performance and payouts.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="font-medium text-green-400">Total Earnings</p>
          </div>
          <p className="text-3xl font-bold text-white">₹0</p>
          <p className="text-green-500/80 text-sm mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> 0% this month
          </p>
        </Card>
        
        <Card className="p-6 transition-colors hover:border-slate-600">
          <p className="text-slate-400 font-medium mb-2">Pending Clearance</p>
          <p className="text-3xl font-bold text-white">₹0</p>
          <p className="text-slate-500 text-sm mt-2">No pending transactions</p>
        </Card>
        
        <Card className="p-6 flex flex-col justify-between transition-colors hover:border-slate-600">
          <div>
            <p className="text-slate-400 font-medium mb-2">Next Payout</p>
            <p className="text-3xl font-bold text-white">₹0</p>
          </div>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" /> No payout scheduled
          </p>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
          <Button variant="secondary" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Service</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {MOCK_EARNINGS.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic bg-slate-800/20">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                MOCK_EARNINGS.map((earning, idx) => (
                  <motion.tr 
                    key={earning.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.1 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300 text-sm">{earning.date}</td>
                    <td className="px-6 py-4 text-white font-medium text-sm">{earning.service}</td>
                    <td className="px-6 py-4 text-white font-bold text-sm">₹{earning.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        earning.status === 'CLEARED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }`}>
                        {earning.status}
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

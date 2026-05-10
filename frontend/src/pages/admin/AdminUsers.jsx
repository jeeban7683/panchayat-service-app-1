import { useState } from 'react';
import { Search, Filter, Edit, Ban, Phone, Mail, CreditCard, Clock, ShieldCheck } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_USERS = [];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">User Monitoring</h1>
          <p className="text-slate-400 mt-1">Monitor user activity, contact details, and platform spending.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
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
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-700">
                <th className="px-6 py-5 font-semibold">User & Identity</th>
                <th className="px-6 py-5 font-semibold text-center">Account Status</th>
                <th className="px-6 py-5 font-semibold">Activity Hub</th>
                <th className="px-6 py-5 font-semibold">Lifetime Spend</th>
                <th className="px-6 py-5 font-semibold">Joined On</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/20">
               {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium italic">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                          {user.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{user.name}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              <Mail className="w-3 h-3" /> {user.email}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              <Phone className="w-3 h-3" /> {user.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider ${
                        user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        user.status === 'BANNED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-3.5 h-3.5 ${user.lastActive === 'Active Now' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                        <span className={`text-sm font-bold ${user.lastActive === 'Active Now' ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {user.lastActive}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 font-black text-white text-base">
                        {user.spent}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Across all services</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-400 font-medium">{user.joined}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all shadow-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-all shadow-sm">
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
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

export default AdminUsers;

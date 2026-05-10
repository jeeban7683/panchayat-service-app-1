import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Wrench, Zap, Briefcase, Droplets, Paintbrush, Truck, Camera, HeartPulse, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/services');
        console.log('Services:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (iconName) => {
    const icons = {
      Droplets, Zap, Briefcase, Wrench, Paintbrush, Truck, Camera, HeartPulse
    };
    return icons[iconName] || Briefcase;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-2 tracking-tight">Our Services</h1>
          <p className="text-lg text-slate-400 font-medium">Find the perfect professional for your needs.</p>
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-shadow shadow-sm"
            />
          </div>
          <button className="shrink-0 hidden sm:flex items-center px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 shadow-sm transition">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-24 bg-slate-800 rounded-2xl border border-slate-700 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-slate-400">Loading services...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50/10 text-blue-400 mb-4 border border-blue-500/20">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
          <p className="text-slate-400">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, idx) => {
            const Icon = getIcon(category.icon);
            return (
              <motion.div
                key={category._id || category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="h-full bg-slate-800 border border-slate-700 rounded-2xl flex flex-col hover:border-slate-500 hover:shadow-md transition-all cursor-pointer group">
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 flex-grow">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-blue-400">
                        {category.count || 0} Providers
                      </span>
                      <span className="text-sm font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                        Browse &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Services;

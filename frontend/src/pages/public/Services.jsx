import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Wrench, Zap, Briefcase, Droplets, Paintbrush,
  Truck, Camera, HeartPulse, Loader2, Users, ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { getServiceImage } from '../../utils/serviceImages';

const ICON_MAP = { Droplets, Zap, Briefcase, Wrench, Paintbrush, Truck, Camera, HeartPulse };
const ICON_BG = [
  { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA' },
  { bg: 'rgba(52,211,153,0.12)', color: '#34D399' },
  { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
  { bg: 'rgba(251,113,133,0.12)', color: '#FB7185' },
  { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  { bg: 'rgba(14,165,233,0.12)', color: '#38BDF8' },
  { bg: 'rgba(74,222,128,0.12)', color: '#4ADE80' },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/services');
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

  const getIcon = (iconName) => ICON_MAP[iconName] || Briefcase;

  return (
    <div className="min-h-screen bg-[#F5F3FF]">

      {/* Page Header */}
      <div className="bg-white border-b border-purple-100 shadow-[0_4px_20px_rgba(99,102,241,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="badge-primary mb-3 inline-flex">All Services</span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                Our Services
              </h1>
              <p className="text-gray-600 text-sm font-semibold">
                Find the perfect professional for every need.{' '}
                <span className="font-bold text-[#8B5CF6]">{categories.length} categories</span> available.
              </p>
            </div>

            {/* Search */}
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[18px] h-[18px]" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 outline-none transition-all text-sm bg-white"
                  style={{ border: '1.5px solid rgba(139,92,246,0.12)', boxShadow: '0 4px 14px rgba(99,102,241,0.04)' }}
                  onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-gray-500 rounded-3xl bg-white border border-purple-100 shadow-[0_12px_40px_rgba(99,102,241,0.08)]"
          >
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#8B5CF6]" />
            <p className="text-sm font-semibold">Loading services...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white border border-purple-100 shadow-[0_12px_40px_rgba(99,102,241,0.08)]">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-purple-50 border border-purple-100"
            >
              <Search className="w-7 h-7 text-[#8B5CF6]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 text-sm font-semibold">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, idx) => {
              const Icon = getIcon(category.icon);
              const style = ICON_BG[idx % ICON_BG.length];
              const imageUrl = getServiceImage(category.name);
              return (
                <motion.div
                  key={category._id || category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <Link to={`/services/${encodeURIComponent(category.name)}/providers`} className="group block h-full">
                    <div
                      className="h-full flex flex-col overflow-hidden rounded-3xl transition-all duration-300 bg-white border border-purple-100 shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(139,92,246,0.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.06)';
                      }}
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                            <Icon className="h-4 w-4" style={{ color: style.color }} />
                          </div>
                          <span className="text-xs font-bold text-white drop-shadow-sm">{category.name}</span>
                        </div>
                        <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white">
                          Starts ₹199
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-gray-800 mb-1.5 group-hover:text-[#8B5CF6] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-normal leading-relaxed mb-4 flex-grow line-clamp-2">
                          {category.description}
                        </p>
                        <div
                          className="flex items-center justify-between pt-3 border-t border-purple-50 mt-auto"
                        >
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Users className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            <span className="font-semibold text-gray-700">{category.providerCount || 0}</span>
                            <span>Providers</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] group-hover:gap-2 transition-all">
                            Browse <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;

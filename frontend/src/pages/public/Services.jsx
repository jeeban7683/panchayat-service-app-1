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
  { bg: 'rgba(244,180,0,0.12)', color: '#F4B400' },
  { bg: 'rgba(96,165,250,0.12)', color: '#60A5FA' },
  { bg: 'rgba(52,211,153,0.12)', color: '#34D399' },
  { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
  { bg: 'rgba(251,113,133,0.12)', color: '#FB7185' },
  { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
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
    <div className="min-h-screen" style={{ background: '#000000' }}>

      {/* Page Header */}
      <div style={{ background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="badge-primary mb-3 inline-flex">All Services</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                Our Services
              </h1>
              <p className="text-[#9099A8]">
                Find the perfect professional for every need.{' '}
                <span className="font-bold text-[#F4B400]">{categories.length} categories</span> available.
              </p>
            </div>

            {/* Search */}
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] w-[18px] h-[18px]" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-[#4B5563] outline-none transition-all text-sm font-medium"
                  style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
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
            className="flex flex-col items-center justify-center py-24 text-[#9099A8] rounded-2xl"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#F4B400]" />
            <p className="text-sm">Loading services...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-24 text-center rounded-2xl" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
              style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.2)' }}
            >
              <Search className="w-7 h-7 text-[#F4B400]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
            <p className="text-[#9099A8] text-sm">Try adjusting your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, idx) => {
              const Icon = getIcon(category.icon);
              const style = ICON_BG[idx % ICON_BG.length];
              return (
                <motion.div
                  key={category._id || category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <Link to={`/services/${encodeURIComponent(category.name)}/providers`} className="group block h-full">
                    <div
                      className="h-full flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
                      style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(244,180,0,0.3)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(244,180,0,0.1)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Image */}
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={getServiceImage(category.name)}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,15,20,0.8), transparent)' }} />
                        <div
                          className="absolute bottom-3 left-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: style.bg, border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: style.color }} />
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#F4B400] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-[#9099A8] leading-relaxed mb-4 flex-grow line-clamp-2">
                          {category.description}
                        </p>
                        <div
                          className="flex items-center justify-between pt-3 border-t mt-auto"
                          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                        >
                          <div className="flex items-center gap-1.5 text-xs text-[#9099A8]">
                            <Users className="w-3.5 h-3.5 text-[#F4B400]" />
                            <span className="font-bold text-white">{category.providerCount || 0}</span>
                            <span>Providers</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-[#F4B400] group-hover:gap-2 transition-all">
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

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';

import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';
import api, { getImageUrl } from '../../services/api';

import { useSearchParams } from 'react-router-dom';

const ProviderListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState([]);
  const [ratings, setRatings] = useState({});   // { [providerId]: avgRating }
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const serviceFilter = searchParams.get('service');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await api.get('/providers/verified');
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Providers API Response:', data);
      setProviders(data);

      // Fetch average rating for every provider in parallel
      const ratingResults = await Promise.allSettled(
        data.map((p) =>
          api
            .get(`/reviews/provider/${p.id}/rating`)
            .then((res) => ({ id: p.id, rating: res.data }))
        )
      );

      const ratingsMap = {};
      ratingResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.rating !== null && result.value.rating !== undefined) {
          ratingsMap[result.value.id] = result.value.rating;
        }
      });
      console.log('Ratings Map:', ratingsMap);
      setRatings(ratingsMap);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    const providerName = p.user?.name || '';
    const providerService = p.service?.name || '';

    const matchesSearch =
      providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerService.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = serviceFilter
      ? providerService.toLowerCase().replace(/\s+/g, '-') === serviceFilter.toLowerCase()
      : true;

    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto" style={{ background: '#000000' }}>
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Available Providers
            </h1>
            <p className="text-[#9099A8] font-medium">
              Find the right professional for your needs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] w-[18px] h-[18px]" />
              <input
                type="text"
                placeholder="Search providers or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder:text-[#4B5563] outline-none transition-all text-sm font-medium"
                style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* FILTER BUTTON */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold"
              style={showFilters ? {
                background: '#F4B400',
                border: '1px solid #F4B400',
                color: '#000',
              } : {
                background: '#14181F',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#C9CED6',
              }}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div
                className="rounded-2xl p-6"
                style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {/* CATEGORIES */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-sm">
                      <ChevronDown className="w-4 h-4 text-[#F4B400]" />
                      Categories
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Plumber',
                        'Electrician',
                        'RO Repair',
                        'Carpenter',
                        'Cleaner',
                      ].map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <span className="text-sm text-[#9099A8] group-hover:text-[#F4B400] transition-colors">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROVIDERS */}
      <div className="space-y-6">
        {isLoading ? (
          <div
            className="py-20 flex flex-col items-center justify-center text-[#9099A8] rounded-2xl"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#F4B400]" />
            <p className="text-sm font-medium">Loading professionals...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div
            className="py-20 text-center rounded-2xl text-[#9099A8] font-medium"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            No providers found matching your criteria.
          </div>
        ) : (
          filteredProviders.map((provider, idx) => {
            const providerName = provider.user?.name || 'Provider';
            const serviceName = provider.service?.name || 'Service';
            const price = provider.price || 0;
            const experience = provider.experience || 0;
            const verified = provider.verified ?? false;
            const address = provider.address || 'Bhubaneswar';

            // Real average rating from reviews API
            const avgRating = ratings[provider.id];
            const ratingDisplay = avgRating != null && avgRating > 0
              ? Number(avgRating).toFixed(1)
              : '0.0';

            const profileImage = provider.profileImage
              ? getImageUrl(provider.profileImage)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=F4B400&color=000&size=256`;

            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div
                  className="rounded-2xl p-5 sm:p-6 transition-all duration-300 group"
                  style={{
                    background: '#14181F',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(244,180,0,0.25)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(244,180,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* PROFILE */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                      <div className="relative">
                        <img
                          src={profileImage}
                          alt={providerName}
                          className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                          style={{ border: '2px solid rgba(244,180,0,0.2)' }}
                        />
                        {verified && (
                          <div
                            className="absolute -top-1.5 -right-1.5 p-1 rounded-full border-2 shadow-sm"
                            style={{ background: '#F4B400', borderColor: '#14181F' }}
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-black" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                          <h2 className="text-xl font-bold text-white mb-0.5 group-hover:text-[#F4B400] transition-colors">
                            {providerName}
                          </h2>
                          <p className="text-sm font-bold text-[#F4B400] mb-4 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F4B400]" />
                            {serviceName}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                              style={{ background: 'rgba(244,180,0,0.1)', border: '1px solid rgba(244,180,0,0.25)', color: '#F4B400' }}
                            >
                              <Star className="w-3.5 h-3.5 fill-[#F4B400] text-[#F4B400]" />
                              <span>{ratingDisplay}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#9099A8]">
                              <MapPin className="w-4 h-4 text-[#9099A8]" />
                              {address}
                            </div>
                            <div className="text-[#9099A8]">
                              {experience} yr{experience !== 1 ? 's' : ''} experience
                            </div>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div
                          className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8 shrink-0 gap-4"
                          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                        >
                          <div className="text-center md:text-right">
                            <div className="text-2xl font-black text-white">₹{price}</div>
                            <div className="text-[10px] text-[#9099A8] font-medium uppercase tracking-wider mt-0.5">
                              starting price
                            </div>
                          </div>
                          <GlowButton
                            variant="primary"
                            href={`/providers/${provider.id}`}
                            className="text-sm px-5 py-2.5"
                          >
                            View Profile
                          </GlowButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProviderListing;
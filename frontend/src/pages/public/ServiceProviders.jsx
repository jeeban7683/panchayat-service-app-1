import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Star, MapPin, CheckCircle, ArrowLeft, Loader2, Briefcase, Users, ArrowRight
} from 'lucide-react';
import api, { getImageUrl } from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';

const ServiceProviders = () => {
  const { serviceName } = useParams();
  const decodedServiceName = decodeURIComponent(serviceName || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get('/providers/verified');
        const allProviders = Array.isArray(response.data) ? response.data : [];
        const filtered = allProviders.filter(
          (p) => p.service?.name?.toLowerCase() === decodedServiceName.toLowerCase()
        );
        setProviders(filtered);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [decodedServiceName]);

  const filteredProviders = providers.filter((p) => {
    const name = p.user?.name || '';
    const address = p.address || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: '#000000' }}>

      {/* Hero Header */}
      <div style={{ backgroundColor: '#11151B', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[#9099A8] hover:text-white hover:bg-white/5 transition-all group mb-8 text-sm font-medium border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border" style={{ background: 'rgba(244,180,0,0.1)', borderColor: 'rgba(244,180,0,0.25)' }}>
                <Users className="w-7 h-7 text-[#F4B400]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  {decodedServiceName} Providers
                </h1>
                <p className="text-[#9099A8] text-sm font-semibold mt-1">
                  {providers.length} professional{providers.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9099A8] w-[18px] h-[18px]" />
              <input
                type="text"
                placeholder={`Search providers...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-[#4B5563] outline-none transition-all text-sm"
                style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={e => { e.target.style.borderColor = '#F4B400'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#9099A8] rounded-2xl border" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#F4B400]" />
            <p className="text-sm font-semibold">Finding {decodedServiceName.toLowerCase()} professionals...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border" style={{ background: 'rgba(244,180,0,0.1)', borderColor: 'rgba(244,180,0,0.25)' }}>
              <Briefcase className="w-8 h-8 text-[#F4B400]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No providers found</h3>
            <p className="text-[#9099A8] mb-8 max-w-md mx-auto text-sm font-medium">
              {searchTerm
                ? `No providers match "${searchTerm}". Try a different search.`
                : `No ${decodedServiceName.toLowerCase()} providers are available right now.`}
            </p>
            <GlowButton variant="primary" href="/services">
              Browse Other Services
            </GlowButton>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredProviders.map((provider, idx) => {
              const providerName = provider.user?.name || 'Provider';
              const svcName = provider.service?.name || 'Service';
              const price = provider.price || 0;
              const experience = provider.experience || 0;
              const verified = provider.verified ?? false;
              const profileImage = provider.profileImage
                ? getImageUrl(provider.profileImage)
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=F4B400&color=000&size=256`;
              const address = provider.address || 'Bhubaneswar';
              const rating = provider.rating || 'N/A';

              return (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07 }}
                >
                  <div className="rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 group p-5 sm:p-6" style={{ background: '#14181F', borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="relative">
                          <img
                            src={profileImage}
                            alt={providerName}
                            className="w-20 h-20 rounded-2xl object-cover border"
                            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                          />
                          {verified && (
                            <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full border-2 shadow-sm" style={{ background: '#F4B400', borderColor: '#14181F' }}>
                              <CheckCircle className="w-3 h-3 text-black font-black" />
                            </div>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border" style={{
                          background: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.25)', color: '#34D399'
                        }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                          Online
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between gap-5">
                          <div className="flex-1">
                            <h2 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#FBBF24] transition-colors">
                              {providerName}
                            </h2>
                            <p className="text-sm font-semibold text-[#F4B400] mb-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                              {svcName}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-sm" style={{ background: 'rgba(244,180,0,0.1)', borderColor: 'rgba(244,180,0,0.25)' }}>
                                <Star className="w-3.5 h-3.5 fill-[#FFC928] text-[#FFC928]" />
                                <span className="font-bold text-[#FFC928]">{rating}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-[#9099A8]">
                                <MapPin className="w-3.5 h-3.5 text-[#9099A8]" />
                                {address}
                              </div>
                              <div className="text-sm text-[#9099A8]/70">
                                {experience} yr{experience !== 1 ? 's' : ''} experience
                              </div>
                            </div>
                          </div>

                          {/* Price + CTA */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 shrink-0 gap-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <div className="text-center md:text-right">
                              <div className="text-2xl font-black text-white">₹{price}</div>
                              <div className="text-[10px] text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">
                                Starting price
                              </div>
                            </div>
                            <GlowButton
                              variant="primary"
                              href={`/providers/${provider.id || provider._id}`}
                              className="text-sm px-5 py-2.5 whitespace-nowrap"
                            >
                              View Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </GlowButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviders;

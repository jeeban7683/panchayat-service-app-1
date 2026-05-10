import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

const ProviderListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Correct backend endpoint
        const response = await api.get('/providers/verified');

        console.log('Providers API Response:', response.data);

        // Ensure response is always an array
        setProviders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Filter by provider name or service name
  const filteredProviders = providers.filter((p) => {
    const name = p.user?.name || '';
    const service = p.service?.name || '';

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header & Search Area */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Available Providers
            </h1>
            <p className="text-slate-400">
              Find the right professional for your needs
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search providers or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${showFilters
                  ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <Card className="p-6 border-blue-500/20 bg-slate-800/50 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Categories */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                      Categories
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Plumbing',
                        'Electrical',
                        'Carpentry',
                        'Cleaning',
                        'Painting',
                        'AC Repair',
                      ].map((cat) => (
                        <label
                          key={cat}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                      Minimum Rating
                    </h4>
                    <div className="space-y-3">
                      {[4, 3, 2].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="rating"
                            className="w-4 h-4 border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
                          />
                          <div className="flex items-center text-sm text-slate-400 group-hover:text-white transition-colors">
                            <div className="flex gap-0.5 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-slate-700'
                                    }`}
                                />
                              ))}
                            </div>
                            {rating}.0 & up
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                      Availability
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
                        />
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                          Available Now
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50"
                        />
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                          Verified Only
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-end gap-3">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                  <Button
                    variant="primary"
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-2 text-sm"
                  >
                    Apply Filters
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Provider Cards */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-700/50 italic">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p>Loading professionals...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="py-20 text-center bg-slate-800/50 rounded-2xl border border-slate-700/50 italic text-slate-500">
            No providers found matching your criteria. Try adjusting your search
            or filters.
          </div>
        ) : (
          filteredProviders.map((provider, idx) => {
            const providerName = provider.user?.name || 'Provider';
            const serviceName = provider.service?.name || 'Service';
            const price = provider.price || 0;
            const experience = provider.experience || 0;
            const verified = provider.verified ?? false;
            const profileImage =
              provider.profileImage ||
              'https://images.unsplash.com/photo-1540565993045-303545f8226d?q=80&w=200&auto=format&fit=crop';
            const address = provider.address || 'Bhubaneswar';
            const rating = provider.rating || 'N/A';

            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="p-5 sm:p-6 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />

                  <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                      <div className="relative">
                        <img
                          src={profileImage}
                          alt={providerName}
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-800 shadow-xl"
                        />

                        {verified && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 p-1.5 rounded-lg border-2 border-slate-900 shadow-lg">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {providerName}
                          </h2>

                          <p className="text-blue-500 font-semibold mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {serviceName}
                          </p>

                          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-white">
                                {rating}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              {address}
                            </div>

                            <div className="text-slate-400">
                              {experience} years experience
                            </div>
                          </div>
                        </div>

                        {/* Price + Button */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8 shrink-0">
                          <div className="mb-0 md:mb-4">
                            <div className="text-2xl font-black text-white">
                              ₹{price}
                            </div>
                            <div className="text-xs text-slate-500 font-medium uppercase tracking-widest text-right">
                              starting price
                            </div>
                          </div>

                          <Button
                            variant="primary"
                            className="shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProviderListing;
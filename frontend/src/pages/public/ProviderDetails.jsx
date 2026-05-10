import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle, Clock, Calendar as CalendarIcon, Phone, Mail, Award, Shield, ThumbsUp, Loader2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

const ProviderDetails = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/providers/${id}`);
        setProvider(response.data);
      } catch (error) {
        console.error('Failed to fetch provider details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>Loading provider profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-2">Provider not found</h3>
        <p className="text-slate-400">We couldn't find the professional you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Profile Section */}
      <div className="relative mb-8">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-dark-900/20" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 flex flex-col md:flex-row gap-6 items-end md:items-center">
          <img 
            src={provider.image} 
            alt={provider.name} 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover ring-4 ring-white dark:ring-dark-900 shadow-xl"
          />
          <div className="flex-1 w-full bg-white dark:bg-dark-900 p-4 sm:p-6 rounded-2xl shadow-xl ring-1 ring-dark-900/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4 md:mt-16">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
                  {provider.name}
                </h1>
                {provider.verified && (
                  <CheckCircle className="w-6 h-6 text-primary-500" />
                )}
              </div>
              <p className="text-lg text-dark-600 dark:text-dark-400 font-medium mb-3">
                {provider.service}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-dark-900 dark:text-white">{provider.rating}</span>
                  <span>({provider.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-dark-400" />
                  {provider.location}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button size="lg" className="w-full">Book Now</Button>
              <div className="text-center">
                <span className="text-xl font-bold text-dark-900 dark:text-white">{provider.hourlyRate}</span>
                <span className="text-sm text-dark-500"> / hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-dark-200 dark:border-dark-700">
            {['about', 'portfolio', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-dark-500 hover:text-dark-900 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">About Me</h3>
                  <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                    {provider.about}
                  </p>
                </Card>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-dark-500">Completed Jobs</div>
                      <div className="text-xl font-bold text-dark-900 dark:text-white">{provider.completedJobs}+</div>
                    </div>
                  </Card>
                  <Card className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm text-dark-500">Background Checked</div>
                      <div className="text-xl font-bold text-dark-900 dark:text-white">Verified</div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {provider.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                    <img 
                      src={img} 
                      alt={`Portfolio item ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {provider.recentReviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center font-bold">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-dark-900 dark:text-white">{review.user}</div>
                          <div className="text-xs text-dark-400">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-dark-200 text-dark-200 dark:fill-dark-700 dark:text-dark-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400">{review.text}</p>
                  </Card>
                ))}
                <Button variant="outline" className="w-full">Load More Reviews</Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-dark-900 dark:text-white mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-dark-600 dark:text-dark-400">
                <CalendarIcon className="w-5 h-5 text-dark-400" />
                <span>Member since {provider.memberSince}</span>
              </div>
              <div className="flex items-center gap-3 text-dark-600 dark:text-dark-400">
                <Clock className="w-5 h-5 text-dark-400" />
                <span>Usually responds in 1 hour</span>
              </div>
              <div className="flex items-center gap-3 text-dark-600 dark:text-dark-400">
                <ThumbsUp className="w-5 h-5 text-dark-400" />
                <span>98% positive reviews</span>
              </div>
            </div>
            
            <hr className="my-6 border-dark-200 dark:border-dark-700" />
            
            <h3 className="font-bold text-dark-900 dark:text-white mb-4">Contact Details</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-3" /> Show Phone Number
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-3" /> Send a Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;

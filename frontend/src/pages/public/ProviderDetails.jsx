import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, CheckCircle, Clock, Calendar as CalendarIcon,
  Phone, Mail, Award, Shield, ThumbsUp, Loader2, ArrowLeft,
  Briefcase, MessageSquare, IndianRupee, Verified
} from 'lucide-react';
import Card from '../../components/ui/Card';
import api, { getImageUrl } from '../../services/api';
import { createBooking } from '../../services/bookingService';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../../components/ui/GlowButton';

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    requirements: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (searchParams.get('book') === 'true') {
        setShowBookingModal(true);
        setSearchParams({}, { replace: true });
      } else if (searchParams.get('chat') === 'true' && provider?.user?.id) {
        navigate(`/chat?contactId=${provider.user.id}`);
      }
    }
  }, [user, searchParams, setSearchParams, provider, navigate]);

  useEffect(() => {
    const fetchProviderData = async () => {
      setIsLoading(true);

      // 1. Fetch provider details
      try {
        const providerRes = await api.get(`/providers/${id}`);
        setProvider(providerRes.data);
        console.log("Provider:", providerRes.data);
      } catch (error) {
        console.error('Failed to fetch provider details:', error);
      }

      // 2. Fetch reviews
      try {
        const reviewsRes = await api.get(`/reviews/provider/${id}`);
        setReviews(reviewsRes.data || []);
        console.log("Reviews:", reviewsRes.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }

      // 3. Fetch bookings
      try {
        const bookingsRes = await api.get(`/bookings/provider/${id}`);
        setBookings(bookingsRes.data || []);
        console.log("Bookings:", bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }

      setIsLoading(false);
    };
    fetchProviderData();
  }, [id, user]);

  const handleBookClick = () => {
    if (!user) {
      navigate('/register', { state: { from: `/providers/${id}?book=true` } });
    } else {
      setShowBookingModal(true);
    }
  };

  const handleDirectMessageClick = () => {
    if (!user) {
      navigate('/register', { state: { from: `/providers/${id}?chat=true` } });
    } else {
      navigate(`/chat?contactId=${provider.user?.id}`);
    }
  };

  const handleCallClick = () => {
    if (!user) {
      navigate('/register', { state: { from: `/providers/${id}` } });
    } else {
      alert(`Connecting call to ${name}...`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewRating) return;
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        provider: { id: Number(id) },
        user: { id: user.id },
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment('');
      // Re-fetch reviews to update list and stats
      const refreshed = await api.get(`/reviews/provider/${id}`);
      setReviews(refreshed.data || []);
      setTimeout(() => setReviewSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderLockedSection = (title, description) => (
    <div
      className="py-12 px-6 text-center backdrop-blur-md rounded-2xl border flex flex-col items-center"
      style={{ background: 'rgba(20,24,31,0.6)', borderColor: 'rgba(139,92,246,0.08)' }}
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border" style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.25)' }}>
        <Shield className="w-8 h-8 text-[#8B5CF6]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title} Locked
      </h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed font-semibold">
        {description}
      </p>
      <GlowButton
        variant="primary"
        onClick={() => navigate('/register', { state: { from: `/providers/${id}` } })}
        className="px-6 py-2.5 text-xs font-bold"
      >
        Register to Unlock Access
      </GlowButton>
    </div>
  );

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowBookingModal(false);
      navigate('/register', { state: { from: `/providers/${id}?book=true` } });
      return;
    }

    setIsBooking(true);

    try {
      const userId = user?.id;

      const bookingPayload = {
        user: { id: userId },
        provider: { id: provider.id },
        service: { id: provider.service?.id },
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        requirements: bookingData.requirements,
        status: 'PENDING'
      };

      console.log("BOOKING PAYLOAD:", bookingPayload);
      const response = await createBooking(bookingPayload);
      console.log("BOOKING CREATED:", response.data);

      setIsBookingSuccess(true);

      setTimeout(() => {
        setShowBookingModal(false);
        setIsBookingSuccess(false);
        navigate('/user/bookings');
      }, 2500);

    } catch (error) {
      console.error('Booking failed:', error);
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setShowBookingModal(false);
        navigate('/login', { state: { from: `/providers/${id}?book=true` } });
      } else {
        alert('Booking failed. Please try again.');
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500" >
        <div className="relative">
          <div className="w-16 h-16 border-2 border-[#8B5CF6]/20 border-t-[#8B5CF6] rounded-full animate-spin" />
          <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-6 font-semibold text-sm">Loading professional profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" >
        <div className="text-center max-w-md w-full py-12 px-6 rounded-3xl border shadow-xl" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional not found</h3>
          <p className="text-gray-500 mb-8 leading-relaxed font-semibold">
            We couldn't find the provider you're looking for. They may have moved or the link is incorrect.
          </p>
          <GlowButton variant="primary" href="/providers" className="w-full">
            Browse All Providers
          </GlowButton>
        </div>
      </div>
    );
  }

  const name = provider?.user?.name || provider?.name || 'Professional';
  const service = provider?.service?.name || (typeof provider?.service === 'string' ? provider?.service : null) || 'Professional Service';
  const rawImage = provider?.profileImage || provider?.profilePic || provider?.image;
  const profileImage = rawImage
    ? getImageUrl(rawImage)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4B400&color=000&size=256`;
  const location = provider?.location || provider?.address || 'Bhubaneswar, Odisha';

  // Dynamically calculate average rating from reviews
  const rating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "N/A";

  // Dynamically calculate review count
  const reviewsCount = reviews.length;

  const price = provider?.hourlyRate || provider?.price || 0;
  const bio = provider?.about || provider?.bio || provider?.description || 'Experienced professional dedicated to providing top-quality service. Committed to punctuality, transparency, and customer satisfaction.';

  // Format joined date
  const formatMemberSince = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  const joinedDate = formatMemberSince(provider?.createdAt || provider?.user?.createdAt);

  // Dynamically calculate completed jobs
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED').length;

  // Response Time
  const responseTime = provider?.responseTime || 'N/A';

  // Success Rate
  const successRate = bookings.length > 0
    ? Math.round((bookings.filter(b => b.status === 'COMPLETED').length / bookings.length) * 100)
    : 0;

  // Years Pro
  const experience = provider?.experience !== undefined && provider?.experience !== null
    ? `${provider.experience} Years Pro`
    : 'N/A';

  return (
    <div className="min-h-screen pb-20" >
      {/* Header Profile Section */}
      <div className="relative h-[250px] md:h-[320px]">
        {/* Cover Photo */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-100">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>

        {/* Back Button */}
        <Link
          to="/providers"
          className="absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 bg-white/90 hover:bg-white hover:text-[#8B5CF6] transition-all group border border-purple-100 text-sm font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Listing</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-32 md:-mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Profile Info Card */}
          <div className="flex-1">
            <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-4 shadow-md relative" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {provider?.verified && (
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full border-4 shadow-md bg-[#8B5CF6] border-white" title="Verified Professional">
                      <CheckCircle className="w-5 h-5 text-white font-black" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1.5 tracking-tight">
                        {name}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full border text-[#8B5CF6] text-xs font-bold uppercase" style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.25)' }}>
                          {service}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-semibold">{location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center md:justify-start gap-6">
                        <div className="text-center md:text-left">
                          <div className="flex items-center gap-1 mb-0.5 justify-center md:justify-start text-[#A78BFA]">
                            <Star className="w-4.5 h-4.5 fill-[#A78BFA]" />
                            <span className="text-lg font-black">{rating}</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{reviewsCount} Reviews</span>
                        </div>
                        <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="text-center md:text-left">
                          <div className="flex items-center gap-1.5 mb-0.5 justify-center md:justify-start text-[#8B5CF6]">
                            <Briefcase className="w-4.5 h-4.5 text-[#8B5CF6]" />
                            <span className="text-lg font-black">{completedJobs}+</span>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jobs Done</span>
                        </div>
                      </div>
                    </div>

                    {/* Book Card */}
                    <div className="rounded-2xl p-5 md:text-right min-w-[200px] w-full md:w-auto border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                      <div className="mb-3">
                        <div className="text-2xl font-black text-gray-900 flex items-center justify-center md:justify-end">
                          <IndianRupee className="w-5 h-5 text-[#8B5CF6]" />
                          {price}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">per hour starting</span>
                      </div>
                      <GlowButton
                        variant="primary"
                        className="w-full text-sm"
                        onClick={handleBookClick}
                      >
                        {user ? 'Book Service' : '🔒 Register to Book'}
                      </GlowButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mt-8">
              <div className="flex gap-1 p-1 rounded-xl w-fit mb-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                {['about', 'portfolio', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    style={activeTab === tab
                      ? { background: '#8B5CF6', color: '#000' }
                      : { color: '#6B7280' }
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'about' && (
                    !user ? (
                      renderLockedSection('Professional Bio', 'Register to view full experience history, safety verification status, and professional biography.')
                    ) : (
                      <div className="space-y-6">
                        <div className="rounded-2xl p-6 md:p-8 border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Verified className="w-5 h-5 text-[#8B5CF6]" />
                            Professional Bio
                          </h3>
                          <p className="text-gray-600 leading-relaxed italic text-sm md:text-base">
                            "{bio}"
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="rounded-2xl p-5 flex items-center gap-4 border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', borderColor: 'rgba(139,92,246,0.25)' }}>
                              <Award className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Experience</div>
                              <div className="text-lg font-black text-gray-900">{experience}</div>
                            </div>
                          </div>
                          <div className="rounded-2xl p-5 flex items-center gap-4 border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', borderColor: 'rgba(52,211,153,0.25)' }}>
                              <Shield className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Safety Status</div>
                              <div className="text-lg font-black text-gray-900">Verified Identity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {activeTab === 'portfolio' && (
                    !user ? (
                      renderLockedSection('Portfolio Gallery', 'Register to browse past project uploads, service delivery photos, and proof of work.')
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {(() => {
                          const portfolioImages = [
                            provider?.portfolioImage1,
                            provider?.portfolioImage2,
                            provider?.portfolioImage3
                          ].filter(Boolean).map(getImageUrl);

                          if (portfolioImages.length > 0) {
                            return portfolioImages.map((img, idx) => (
                              <motion.div
                                key={idx}
                                whileHover={{ scale: 1.01 }}
                                className="aspect-square rounded-2xl overflow-hidden border cursor-pointer"
                                style={{ borderColor: 'rgba(139,92,246,0.08)' }}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </motion.div>
                            ));
                          }

                          return (
                            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                              <Briefcase className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm font-semibold">No portfolio projects uploaded yet.</p>
                            </div>
                          );
                        })()}
                      </div>
                    )
                  )}

                  {activeTab === 'reviews' && (
                    !user ? (
                      renderLockedSection('Customer Reviews', 'Register to read honest ratings and verified feedback from other local customers.')
                    ) : (
                      <div className="space-y-4">

                        {/* Write a Review Form */}
                        <div className="rounded-2xl p-6 border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#A78BFA]" />
                            Write a Review
                          </h3>

                          {reviewSuccess && (
                            <div className="mb-4 p-3 rounded-xl text-sm font-bold text-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34D399' }}>
                              ✓ Review submitted successfully!
                            </div>
                          )}

                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                            {/* Star Picker */}
                            <div>
                              <div className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">Your Rating</div>
                              {(() => {
                                const currentRating = reviewHover || reviewRating;
                                const ratingTheme = {
                                  1: { star: 'fill-red-500 text-red-500', badge: 'bg-red-50 text-red-700 border-red-200', text: '★ Poor (1/5)' },
                                  2: { star: 'fill-orange-500 text-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200', text: '★★ Fair (2/5)' },
                                  3: { star: 'fill-amber-400 text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200', text: '★★★ Good (3/5)' },
                                  4: { star: 'fill-emerald-500 text-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: '★★★★ Very Good (4/5)' },
                                  5: { star: 'fill-green-600 text-green-600', badge: 'bg-green-100 text-green-800 border-green-300', text: '★★★★★ Excellent (5/5)' }
                                }[currentRating] || { star: 'fill-gray-200 text-gray-300', badge: '', text: '' };

                                return (
                                  <div className="flex items-center gap-2 py-1 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setReviewRating(star)}
                                          onMouseEnter={() => setReviewHover(star)}
                                          onMouseLeave={() => setReviewHover(0)}
                                          className="transition-transform hover:scale-125 p-1"
                                        >
                                          <Star
                                            className={`w-8 h-8 transition-colors ${
                                              star <= currentRating
                                                ? ratingTheme.star
                                                : 'fill-gray-100 text-gray-300 hover:text-amber-300'
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                    {currentRating > 0 && (
                                      <span className={`ml-2 text-xs font-extrabold px-3 py-1 rounded-full border shadow-xs animate-in fade-in ${ratingTheme.badge}`}>
                                        {ratingTheme.text}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Comment */}
                            <div>
                              <div className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-2">Your Comment</div>
                              <textarea
                                rows="3"
                                placeholder="Share your experience with this provider..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 outline-none transition-all text-sm resize-none bg-white"
                                style={{ border: '1.5px solid rgba(139,92,246,0.12)' }}
                                onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>

                            <GlowButton
                              type="submit"
                              variant="primary"
                              className="text-sm py-2.5 px-6"
                              disabled={isSubmittingReview || !reviewRating}
                            >
                              {isSubmittingReview ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Submitting...
                                </div>
                              ) : 'Submit Review'}
                            </GlowButton>
                          </form>
                        </div>

                        {/* Existing Reviews */}
                        {reviews.length > 0 && reviews.map((review) => {
                            const rVal = Math.round(Number(review.rating) || 5);
                            const rStyle = {
                              1: { star: 'fill-red-500 text-red-500', badge: 'bg-red-50 text-red-700 border-red-200' },
                              2: { star: 'fill-orange-500 text-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
                              3: { star: 'fill-amber-400 text-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
                              4: { star: 'fill-emerald-500 text-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                              5: { star: 'fill-green-600 text-green-600', badge: 'bg-green-100 text-green-800 border-green-300' }
                            }[rVal] || { star: 'fill-amber-400 text-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' };

                            return (
                              <div key={review.id} className="rounded-2xl p-6 border bg-white shadow-sm" style={{ borderColor: 'rgba(139,92,246,0.12)' }}>
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg bg-purple-100 text-[#8B5CF6]">
                                      {(review.user?.name || 'U').charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-bold text-gray-900 text-sm">{review.user?.name || 'Verified Customer'}</div>
                                      <div className="flex gap-0.5 mt-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? rStyle.star : 'fill-gray-200 text-gray-200'}`} />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`flex items-center px-2.5 py-1 rounded-lg border font-black text-xs ${rStyle.badge}`}>
                                    <Star className={`w-3.5 h-3.5 mr-1 ${rStyle.star}`} />
                                    <span>{Number(review.rating).toFixed(1)}</span>
                                  </div>
                                </div>
                                <p className="text-gray-900 text-sm font-semibold leading-relaxed">"{review.comment}"</p>
                              </div>
                            );
                          })}
                        
                        {reviews.length === 0 && (
                          <div className="py-12 text-center rounded-2xl border border-dashed" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                            <MessageSquare className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm font-semibold">No reviews yet. Be the first to review!</p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full lg:w-[350px] space-y-6">
            <div className="rounded-3xl p-6 shadow-md relative overflow-hidden border" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
              <h3 className="text-xs font-bold text-gray-500 mb-6 tracking-widest uppercase flex items-center gap-2 border-b pb-3" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-pulse" />
                Quick Stats
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
                    <CalendarIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Member</div>
                    <div className="text-gray-900 font-bold text-sm">{joinedDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Response Time</div>
                    <div className="text-gray-900 font-bold text-sm">{responseTime}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(139,92,246,0.08)', color: '#8B5CF6' }}>
                    <ThumbsUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Success Rate</div>
                    <div className="text-gray-900 font-bold text-sm">{successRate}% Satisfaction</div>
                  </div>
                </div>
              </div>

              <div className="my-6 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

              <h3 className="text-xs font-bold text-gray-500 mb-5 tracking-widest uppercase border-b pb-3" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>Connectivity</h3>
              <div className="space-y-3">
                <GlowButton
                  variant="outline"
                  className="w-full py-3 justify-between group text-sm"
                  onClick={handleCallClick}
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Secure Call
                  </span>
                  {user ? (
                    <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-bold">HIDDEN</span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/10 px-2 py-0.5 rounded text-[#8B5CF6] font-bold flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </GlowButton>
                <GlowButton
                  variant="outline"
                  className="w-full py-3 justify-between group text-sm"
                  onClick={handleDirectMessageClick}
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Direct Message
                  </span>
                  {user ? (
                    <span className="text-[9px] bg-green-500/10 px-2 py-0.5 rounded text-[#34D399] font-bold">READY</span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/10 px-2 py-0.5 rounded text-[#8B5CF6] font-bold flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> LOCKED
                    </span>
                  )}
                </GlowButton>
              </div>

              <div className="mt-6 p-4 rounded-xl text-center border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide leading-relaxed font-bold">
                  Payment is only released after work completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-[#F5F3FF]/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-lg border rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
              style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}
            >
              <AnimatePresence mode="wait">
                {isBookingSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 relative z-10"
                  >
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/25 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Booking Request Sent!</h2>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">
                      Your booking is now <span className="text-[#8B5CF6] font-bold">PENDING</span>. {name} will review your request and get back to you shortly.
                    </p>
                    <div className="p-3 rounded-xl border inline-block mb-6" style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.08)' }}>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reference ID: BK-{Math.floor(1000 + Math.random() * 9000)}</p>
                    </div>

                    <div className="pt-2">
                      <GlowButton
                        variant="outline"
                        className="w-full text-sm py-2.5"
                        onClick={() => {
                          setShowBookingModal(false);
                          setIsBookingSuccess(false);
                        }}
                      >
                        Close Window
                      </GlowButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="text-2xl font-black text-gray-900 mb-1.5 tracking-tight flex items-center gap-2">
                      <CalendarIcon className="w-7 h-7 text-[#8B5CF6]" />
                      Schedule Booking
                    </h2>
                    <p className="text-sm text-gray-500 mb-6 font-semibold">Request a service from {name}</p>

                    <form onSubmit={handleBookingSubmit} className="space-y-4 relative z-10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Select Date</label>
                          <input
                            type="date"
                            required
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-gray-900 bg-white outline-none transition-all text-sm font-semibold border"
                            style={{ colorScheme: 'light', background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.2)' }}
                            onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Time</label>
                          <input
                            type="time"
                            required
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl text-gray-900 bg-white outline-none transition-all text-sm font-semibold border"
                            style={{ colorScheme: 'light', background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.2)' }}
                            onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Service Address</label>
                        <input
                          type="text"
                          required
                          placeholder="Where should we come?"
                          value={bookingData.address}
                          onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 bg-white outline-none transition-all text-sm font-medium border"
                          style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.2)' }}
                          onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Special Requirements</label>
                        <textarea
                          rows="3"
                          placeholder="Describe your issue or requirements..."
                          value={bookingData.requirements}
                          onChange={(e) => setBookingData({ ...bookingData, requirements: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl text-gray-900 placeholder:text-gray-400 bg-white outline-none transition-all text-sm font-medium resize-none border"
                          style={{ background: '#FFFFFF', borderColor: 'rgba(139,92,246,0.2)' }}
                          onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.2)'; e.target.style.boxShadow = 'none'; }}
                        ></textarea>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <GlowButton
                          type="button"
                          variant="secondary"
                          className="flex-1 text-sm py-2.5"
                          onClick={() => setShowBookingModal(false)}
                        >
                          Cancel
                        </GlowButton>
                        <GlowButton
                          type="submit"
                          variant="primary"
                          className="flex-1 text-sm py-2.5"
                          disabled={isBooking}
                        >
                          {isBooking ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </div>
                          ) : 'Confirm Booking'}
                        </GlowButton>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProviderDetails;

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, FileText, Download, MessageSquare, Star, ArrowLeft, Loader2, Navigation } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

// Mock data
const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [providerLocation, setProviderLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_KEY_HERE"
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/user/bookings/${id}`);
        setBookingData(response.data);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Real-time location polling
  useEffect(() => {
    let interval;
    if (bookingData && (bookingData.status === 'ACCEPTED' || bookingData.status === 'IN_PROGRESS')) {
      const fetchLocation = async () => {
        try {
          const response = await api.get(`/providers/${bookingData.provider.id}/location`);
          setProviderLocation({
            lat: parseFloat(response.data.latitude),
            lng: parseFloat(response.data.longitude)
          });
        } catch (error) {
          console.error('Failed to fetch provider location:', error);
        }
      };

      fetchLocation();
      interval = setInterval(fetchLocation, 10000); // Poll every 10 seconds
    }
    return () => clearInterval(interval);
  }, [bookingData]);

  const submitReview = async () => {
    try {
      await api.post(`/user/bookings/${id}/review`, { rating, text: reviewText });
      setShowReviewForm(false);
      // Fetch data again or show success message
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-2">Booking not found</h3>
        <p className="text-slate-400 mb-6">We couldn't find the booking you're looking for.</p>
        <Button onClick={() => navigate('/user/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="px-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-3">
            Booking #{id}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 tracking-wide">
              {bookingData.status}
            </span>
          </h1>
          <p className="text-dark-500 mt-1">{bookingData.service}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details (Left Col) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4 border-b border-dark-100 dark:border-dark-800 pb-2">
              Service Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-dark-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</p>
                <p className="font-medium text-dark-900 dark:text-white">{bookingData.schedule.date}</p>
              </div>
              <div>
                <p className="text-sm text-dark-500 mb-1 flex items-center gap-2"><Clock className="w-4 h-4"/> Time</p>
                <p className="font-medium text-dark-900 dark:text-white">{bookingData.schedule.time} ({bookingData.schedule.duration})</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-dark-500 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</p>
                <p className="font-medium text-dark-900 dark:text-white">{bookingData.location}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-dark-500 mb-1 flex items-center gap-2"><FileText className="w-4 h-4"/> Problem Description</p>
                <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-lg text-dark-700 dark:text-dark-300">
                  {bookingData.notes}
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline Section */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-6 border-b border-dark-100 dark:border-dark-800 pb-2">
              Booking Timeline
            </h3>
            <div className="relative border-l-2 border-dark-100 dark:border-dark-800 ml-3 space-y-6">
              {[
                { title: 'Booking Confirmed', date: 'Oct 23, 2023 - 10:00 AM', status: 'completed' },
                { title: 'Provider Assigned', date: 'Oct 23, 2023 - 11:30 AM', status: 'completed' },
                { title: 'Provider En Route', date: 'Oct 24, 2023 - 1:15 PM', status: 'completed' },
                { title: 'Service Started', date: 'Oct 24, 2023 - 2:00 PM', status: 'completed' },
                { title: 'Service Completed', date: 'Oct 24, 2023 - 4:00 PM', status: 'current' },
              ].map((event, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-dark-900 ${
                    event.status === 'completed' ? 'bg-primary-500' : 
                    event.status === 'current' ? 'bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30' : 
                    'bg-dark-200 dark:bg-dark-700'
                  }`} />
                  <h4 className={`font-medium ${event.status === 'future' ? 'text-dark-400' : 'text-dark-900 dark:text-white'}`}>
                    {event.title}
                  </h4>
                  <p className="text-sm text-dark-500">{event.date}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Map Section */}
          {(bookingData.status === 'ACCEPTED' || bookingData.status === 'IN_PROGRESS') && (
            <Card className="p-0 overflow-hidden border-blue-500/30">
              <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  Live Tracking
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                  Provider en route
                </span>
              </div>
              <div className="h-[300px] w-full bg-slate-900 flex items-center justify-center">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={providerLocation || { lat: 20.2961, lng: 85.8245 }}
                    zoom={15}
                    options={{
                      styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
                      ],
                      disableDefaultUI: true,
                    }}
                  >
                    {providerLocation && <Marker position={providerLocation} />}
                  </GoogleMap>
                ) : (
                  <div className="text-slate-500 flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Initializing Map...</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {bookingData.status === 'COMPLETED' && !showReviewForm && (
            <Card className="p-6 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-1 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" /> Rate your experience
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 text-sm">
                    How was the service provided by {bookingData.provider.name}?
                  </p>
                </div>
                <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
              </div>
            </Card>
          )}

          {showReviewForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Card className="p-6 border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Submit Review</h3>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                      <Star className={`w-8 h-8 transition-colors ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300 dark:text-dark-700'}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  rows="4" 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details of your own experience at this place..."
                  className="w-full p-4 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 outline-none resize-none mb-4"
                ></textarea>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                  <Button onClick={submitReview} disabled={rating === 0}>Submit Review</Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar Info (Right Col) */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Provider</h3>
            <div className="flex items-center gap-4 mb-4">
              <img src={bookingData.provider.image} alt={bookingData.provider.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <p className="font-bold text-dark-900 dark:text-white">{bookingData.provider.name}</p>
                <Link to={`/providers/${bookingData.provider.name}`} className="text-sm text-primary-600 hover:underline">View Profile</Link>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-dark-600 dark:text-dark-400">
                <span>Subtotal</span>
                <span>₹{bookingData.payment.subtotal}</span>
              </div>
              <div className="flex justify-between text-dark-600 dark:text-dark-400">
                <span>Taxes & Fees</span>
                <span>₹{bookingData.payment.tax}</span>
              </div>
              <div className="border-t border-dark-100 dark:border-dark-800 pt-3 flex justify-between font-bold text-dark-900 dark:text-white text-base">
                <span>Total Paid</span>
                <span>₹{bookingData.payment.total}</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-xs text-dark-500 bg-dark-50 dark:bg-dark-800 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Paid via {bookingData.payment.method}
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4"><Download className="w-4 h-4 mr-2" /> Download Invoice</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

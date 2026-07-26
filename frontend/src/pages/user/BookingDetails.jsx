import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, FileText, MessageSquare, ArrowLeft, Loader2, IndianRupee } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import GlowButton from '../../components/ui/GlowButton';
import { getBookingById } from '../../services/bookingService';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(id);
        setBookingData(response.data);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-[#9099A8]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#F4B400]" />
        <p className="text-sm font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div
        className="text-center py-20 rounded-2xl max-w-md mx-auto"
        style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Booking not found</h3>
        <p className="text-[#9099A8] mb-6 text-sm">We couldn't find the booking you're looking for.</p>
        <GlowButton variant="primary" onClick={() => navigate('/user/bookings')}>Back to Bookings</GlowButton>
      </div>
    );
  }

  // Normalize data
  const providerName = bookingData.provider?.user?.name || 'Professional';
  const serviceName = bookingData.service?.name || 'Service';
  const price = bookingData.provider?.price || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 transition-all rounded-xl text-[#9099A8] hover:text-white"
          style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            Booking #{id}
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F4B400]/10 text-[#FBBF24] border border-[#F4B400]/25">
              {bookingData.status}
            </span>
          </h1>
          <p className="text-[#9099A8] text-xs font-semibold uppercase tracking-wider mt-0.5">{serviceName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details (Left Col) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 md:p-8" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-bold text-white mb-5 border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              Service Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-[#9099A8] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#F4B400]"/> Date</p>
                <p className="font-bold text-[#C9CED6] text-sm">{bookingData.date || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9099A8] uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#F4B400]"/> Time</p>
                <p className="font-bold text-[#C9CED6] text-sm">{bookingData.time || 'Not specified'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-[#9099A8] uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#F4B400]"/> Location</p>
                <p className="font-bold text-[#C9CED6] text-sm">{bookingData.address || 'Address not provided'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-[#9099A8] uppercase tracking-wider mb-1 flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#F4B400]"/> Requirements</p>
                <div className="p-4 rounded-xl text-[#C9CED6] text-sm leading-relaxed italic" style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}>
                  "{bookingData.requirements || 'No special requirements mentioned.'}"
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline Section */}
          <Card className="p-6 md:p-8" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-lg font-bold text-white mb-6 border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              Booking Timeline
            </h3>
            <div className="relative border-l ml-3 space-y-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#F4B400]" style={{ borderColor: '#14181F' }} />
                <h4 className="font-bold text-white text-sm">Booking Placed</h4>
                <p className="text-xs text-[#9099A8] mt-0.5">Wait for provider confirmation</p>
              </div>
              {bookingData.status !== 'PENDING' && bookingData.status !== 'REJECTED' && (
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#F4B400]" style={{ borderColor: '#14181F' }} />
                  <h4 className="font-bold text-white text-sm">Provider Confirmed</h4>
                  <p className="text-xs text-[#9099A8] mt-0.5">Service has been accepted</p>
                </div>
              )}
              {bookingData.status === 'COMPLETED' && (
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#34D399]" style={{ borderColor: '#14181F' }} />
                  <h4 className="font-bold text-white text-sm">Service Completed</h4>
                  <p className="text-xs text-[#9099A8] mt-0.5">Job successfully finished</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Info (Right Col) */}
        <div className="space-y-6">
          <Card className="p-6" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-xs font-bold text-[#9099A8] mb-4 tracking-widest uppercase border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Provider</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black" style={{ background: '#F4B400', color: '#000' }}>
                {providerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{providerName}</p>
                <Link to={`/providers/${bookingData.provider?.id}`} className="text-xs text-[#F4B400] font-bold hover:underline">View Profile</Link>
              </div>
            </div>
            <div className="space-y-3">
              <GlowButton variant="outline" className="w-full text-xs py-2.5 justify-center"><MessageSquare className="w-4 h-4 mr-2" /> Message Provider</GlowButton>
            </div>
          </Card>

          <Card className="p-6" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 className="text-xs font-bold text-[#9099A8] mb-4 tracking-widest uppercase border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>Payment Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#9099A8] font-semibold">
                <span>Service Charge</span>
                <span className="flex items-center gap-0.5 text-white font-bold"><IndianRupee className="w-3 h-3" /> {price}</span>
              </div>
              <div className="flex justify-between text-[#9099A8] font-semibold">
                <span>Platform Fees</span>
                <span className="flex items-center gap-0.5 text-white font-bold"><IndianRupee className="w-3 h-3" /> 20</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-white text-sm" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span>Estimated Total</span>
                <span className="flex items-center gap-0.5 text-[#F4B400] font-black text-lg"><IndianRupee className="w-3.5 h-3.5" /> {price + 20}</span>
              </div>
            </div>
            
            <div className="mt-5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] text-[#9099A8] uppercase tracking-wider text-center font-bold">
                Payment after service completion
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

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
      <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#8B5CF6]" />
        <p className="text-sm font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div
        className="text-center py-20 rounded-2xl max-w-md mx-auto"
        style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking not found</h3>
        <p className="text-gray-500 mb-6 text-sm">We couldn't find the booking you're looking for.</p>
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
          className="p-2 transition-all rounded-xl text-gray-500 hover:text-white"
          style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            Booking #{id}
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/25">
              {bookingData.status}
            </span>
          </h1>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-0.5">{serviceName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details (Left Col) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 md:p-8" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-5 border-b pb-3" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
              Service Details
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#8B5CF6]"/> Date</p>
                <p className="font-bold text-gray-600 text-sm">{bookingData.date || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#8B5CF6]"/> Time</p>
                <p className="font-bold text-gray-600 text-sm">{bookingData.time || 'Not specified'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#8B5CF6]"/> Location</p>
                <p className="font-bold text-gray-600 text-sm">{bookingData.address || 'Address not provided'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#8B5CF6]"/> Requirements</p>
                <div className="p-4 rounded-xl text-gray-600 text-sm leading-relaxed italic" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                  "{bookingData.requirements || 'No special requirements mentioned.'}"
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline Section */}
          <Card className="p-6 md:p-8" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-3" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
              Booking Timeline
            </h3>
            {(() => {
              const statusOrder = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];
              const currentStatusIndex = statusOrder.indexOf(bookingData.status);
              const steps = [
                { status: 'PENDING', title: 'Booking Placed', desc: 'Wait for provider confirmation' },
                { status: 'ACCEPTED', title: 'Provider Confirmed', desc: 'Service request accepted' },
                { status: 'IN_PROGRESS', title: 'In Progress', desc: 'Service currently underway' },
                { status: 'COMPLETED', title: 'Service Completed', desc: 'Job finished successfully' }
              ];

              return (
                <div className="relative pl-1">
                  {steps.map((step, index) => {
                    const isReached = currentStatusIndex !== -1 && index <= currentStatusIndex;
                    const isCurrent = currentStatusIndex !== -1 && index === currentStatusIndex;
                    const isCompleted = currentStatusIndex !== -1 && index < currentStatusIndex;
                    const isLineGreen = currentStatusIndex !== -1 && index < currentStatusIndex;
                    const isLast = index === steps.length - 1;

                    return (
                      <div key={step.status} className="relative flex items-start pb-6 last:pb-0 group">
                        {!isLast && (
                          <div
                            className={`absolute left-5 top-10 bottom-0 w-1 transition-all duration-500 rounded-full ${
                              isLineGreen
                                ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : 'bg-purple-100'
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                            isReached
                              ? isCurrent
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 scale-105 ring-4 ring-emerald-100'
                                : 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                              : 'bg-purple-50/50 border-purple-100 text-gray-400'
                          }`}
                        >
                          {isReached ? (
                            <CheckCircle className="w-5 h-5 text-white stroke-[2.5]" />
                          ) : (
                            <Clock className="w-4 h-4 text-purple-300" />
                          )}
                        </div>
                        <div className="ml-4 pt-1 flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className={`text-sm font-black transition-colors ${
                              isReached ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.title}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 animate-pulse">
                                Active
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 font-bold transition-colors ${
                            isReached ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            {isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Pending'}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </Card>
        </div>

        {/* Sidebar Info (Right Col) */}
        <div className="space-y-6">
          <Card className="p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
            <h3 className="text-xs font-bold text-gray-500 mb-4 tracking-widest uppercase border-b pb-2" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>Provider</h3>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black" style={{ background: '#8B5CF6', color: '#000' }}>
                {providerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{providerName}</p>
                <Link to={`/providers/${bookingData.provider?.id}`} className="text-xs text-[#8B5CF6] font-bold hover:underline">View Profile</Link>
              </div>
            </div>
            <div className="space-y-3">
              <GlowButton variant="outline" className="w-full text-xs py-2.5 justify-center"><MessageSquare className="w-4 h-4 mr-2" /> Message Provider</GlowButton>
            </div>
          </Card>

          <Card className="p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
            <h3 className="text-xs font-bold text-gray-500 mb-4 tracking-widest uppercase border-b pb-2" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>Payment Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500 font-semibold">
                <span>Service Charge</span>
                <span className="flex items-center gap-0.5 text-gray-900 font-bold"><IndianRupee className="w-3 h-3" /> {price}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-semibold">
                <span>Platform Fees</span>
                <span className="flex items-center gap-0.5 text-gray-900 font-bold"><IndianRupee className="w-3 h-3" /> 20</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-sm" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                <span>Estimated Total</span>
                <span className="flex items-center gap-0.5 text-[#8B5CF6] font-black text-lg"><IndianRupee className="w-3.5 h-3.5" /> {price + 20}</span>
              </div>
            </div>
            
            <div className="mt-5 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider text-center font-bold">
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

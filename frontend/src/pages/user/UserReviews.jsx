import { motion } from 'framer-motion';
import { Star, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const MOCK_REVIEWS = [];

const UserReviews = () => {
  return (
    <div className="w-full space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage the reviews you've written for service providers.</p>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}
          >
            <p className="text-gray-500 font-semibold text-sm">You haven't written any reviews yet.</p>
          </div>
        ) : (
          MOCK_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(139,92,246,0.08)' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={review.image} alt={review.provider} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                    <div>
                      <h3 className="font-bold text-gray-900">{review.provider}</h3>
                      <p className="text-xs text-gray-500 font-semibold">{review.service} • {review.date}</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'fill-[#FBBF24] text-[#8B5CF6]' : 'fill-white/10 text-white/10'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 leading-relaxed text-sm italic">
                  "{review.text}"
                </p>
                
                <div className="mt-4 pt-4 border-t text-sm" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                  <Link to={`/providers/${review.provider}`} className="text-[#8B5CF6] font-bold hover:underline">
                    View Provider Profile
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserReviews;

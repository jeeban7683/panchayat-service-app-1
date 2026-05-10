import { motion } from 'framer-motion';
import { Star, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';

const MOCK_REVIEWS = [];

const UserReviews = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Reviews</h1>
        <p className="text-slate-400 mt-1">Manage the reviews you've written for service providers.</p>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">You haven't written any reviews yet.</p>
          </div>
        ) : (
          MOCK_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <img src={review.image} alt={review.provider} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                    <div>
                      <h3 className="font-bold text-white">{review.provider}</h3>
                      <p className="text-sm text-slate-400">{review.service} • {review.date}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-slate-700 text-slate-700'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-slate-300 leading-relaxed">
                  "{review.text}"
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm">
                  <Link to={`/providers/${review.provider}`} className="text-blue-400 font-medium hover:underline">
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

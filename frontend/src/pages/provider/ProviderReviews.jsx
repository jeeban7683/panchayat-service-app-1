import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Card from '../../components/ui/Card';

const MOCK_REVIEWS = [];

const ProviderReviews = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Reviews</h1>
          <p className="text-slate-400 mt-1">See what customers are saying about your services.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white flex items-center gap-2 justify-end">
            N/A <Star className="w-6 h-6 fill-slate-700 text-slate-700" />
          </div>
          <p className="text-sm text-slate-400">Average Rating (0 reviews)</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">No reviews yet.</div>
        ) : (
          MOCK_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img src={review.image} alt={review.customer} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white">{review.customer}</h3>
                      <span className="text-sm text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-blue-400 font-medium">{review.service}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
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
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProviderReviews;

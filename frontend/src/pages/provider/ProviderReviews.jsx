import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Card from '../../components/ui/Card';

const MOCK_REVIEWS = [];

const ProviderReviews = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Customer Reviews</h1>
          <p className="text-[#9099A8] text-sm mt-1">See what customers are saying about your services.</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-2xl font-black text-white flex items-center gap-2 justify-start sm:justify-end">
            N/A <Star className="w-5 h-5 fill-white/10 text-white/10" />
          </div>
          <p className="text-xs text-[#9099A8] font-bold uppercase tracking-wider mt-0.5">Average Rating (0 reviews)</p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_REVIEWS.length === 0 ? (
          <div
            className="text-center py-16 text-[#9099A8] rounded-2xl font-medium"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            No reviews yet.
          </div>
        ) : (
          MOCK_REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className="p-6 transition-all duration-300"
                style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img src={review.image} alt={review.customer} className="w-12 h-12 rounded-full object-cover border" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white">{review.customer}</h3>
                      <span className="text-xs text-[#9099A8] font-semibold">{review.date}</span>
                    </div>
                    <p className="text-xs text-[#F4B400] font-bold uppercase tracking-wide mt-0.5">{review.service}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= review.rating ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-white/10 text-white/10'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-[#C9CED6] leading-relaxed text-sm italic">
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

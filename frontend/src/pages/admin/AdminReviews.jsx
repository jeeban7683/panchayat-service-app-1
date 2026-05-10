import { useState } from 'react';
import { Search, Filter, Star, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const MOCK_REVIEWS = [];

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = MOCK_REVIEWS.filter(review => 
    review.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
    review.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Moderation</h1>
          <p className="text-slate-400 mt-1">Monitor and moderate customer reviews across the platform.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-sm"
            />
          </div>
          <Button variant="outline" className="shrink-0"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="col-span-full py-12 text-center bg-slate-800/50 rounded-2xl border border-slate-700/50 italic text-slate-500">
          No reviews found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-white">To: {review.provider}</p>
                  <p className="text-sm text-slate-400">From: {review.customer} • {review.date}</p>
                </div>
                <button className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-slate-700 text-slate-700'}`} 
                  />
                ))}
              </div>
              <p className="text-slate-300 italic leading-relaxed">"{review.text}"</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

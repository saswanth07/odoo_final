import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ThumbsUp, ThumbsDown, Meh, X } from 'lucide-react';
import { feedbacks, ratingDistribution } from '@/lib/data';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C4A8]/30 rounded-xl p-3 shadow-xl">
        <p className="text-sm font-medium text-white">{payload[0].payload.rating} Stars</p>
        <p className="text-xs text-[#8B7355]">{payload[0].value} reviews</p>
      </div>
    );
  }
  return null;
};

export function Feedback() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<typeof feedbacks[0] | null>(null);

  const filteredFeedback = feedbacks.filter((f) =>
    f.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.review.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1);
  const positiveCount = feedbacks.filter((f) => f.sentiment === 'Positive').length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === 'Negative').length;
  const neutralCount = feedbacks.filter((f) => f.sentiment === 'Neutral').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Feedback</h1>
          <p className="text-sm text-[#8B7355] mt-0.5">Customer reviews and sentiment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Star className="w-6 h-6 text-[#C9A84C] fill-[#C9A84C]" />
            <span className="text-3xl font-bold text-white">{avgRating}</span>
          </div>
          <p className="text-xs text-[#8B7355]">Average Rating</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <ThumbsUp className="w-6 h-6 text-[#6B7F59]" />
            <span className="text-3xl font-bold text-white">{positiveCount}</span>
          </div>
          <p className="text-xs text-[#8B7355]">Positive</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Meh className="w-6 h-6 text-[#C9A84C]" />
            <span className="text-3xl font-bold text-white">{neutralCount}</span>
          </div>
          <p className="text-xs text-[#8B7355]">Neutral</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <ThumbsDown className="w-6 h-6 text-[#C75B39]" />
            <span className="text-3xl font-bold text-white">{negativeCount}</span>
          </div>
          <p className="text-xs text-[#8B7355]">Negative</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="rating" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5">
          <h3 className="font-semibold text-white mb-4">Sentiment Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#8B7355]">Positive</span>
                <span className="text-sm font-medium text-white">{Math.round((positiveCount / feedbacks.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EDE5D8]/40 overflow-hidden">
                <div className="h-full rounded-full bg-[#6B7F59]" style={{ width: `${(positiveCount / feedbacks.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#8B7355]">Neutral</span>
                <span className="text-sm font-medium text-white">{Math.round((neutralCount / feedbacks.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EDE5D8]/40 overflow-hidden">
                <div className="h-full rounded-full bg-[#C9A84C]" style={{ width: `${(neutralCount / feedbacks.length) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#8B7355]">Negative</span>
                <span className="text-sm font-medium text-white">{Math.round((negativeCount / feedbacks.length) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EDE5D8]/40 overflow-hidden">
                <div className="h-full rounded-full bg-[#C75B39]" style={{ width: `${(negativeCount / feedbacks.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reviews..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-[#D4C4A8]/30 text-white placeholder:text-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#6B4E3D]/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeedback.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedFeedback(f)}
            className="rounded-2xl bg-white border border-[#D4C4A8]/30 p-5 cursor-pointer hover:border-[#D4C4A8]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-sm font-bold">
                  {f.customer.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-white">{f.customer}</span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} className={cn('w-3.5 h-3.5', star < f.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#8B7355]')} />
                ))}
              </div>
            </div>
            <p className="text-sm text-[#8B7355] line-clamp-2">{f.review}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[#8B7355]">{f.date}</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                f.sentiment === 'Positive' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : f.sentiment === 'Neutral' ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#C75B39]/20 text-[#C75B39]'
              )}>
                {f.sentiment}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C1E14]/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-[#D4C4A8]/30 rounded-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-bold">
                    {selectedFeedback.customer.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedFeedback.customer}</h3>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star key={star} className={cn('w-3.5 h-3.5', star < selectedFeedback.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#8B7355]')} />
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedFeedback(null)} className="w-8 h-8 rounded-lg bg-[#EDE5D8]/30 hover:bg-[#EDE5D8]/40 flex items-center justify-center">
                  <X className="w-4 h-4 text-[#8B7355]" />
                </button>
              </div>
              <p className="text-sm text-[#8B7355] leading-relaxed">{selectedFeedback.review}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#D4C4A8]/30">
                <span className="text-xs text-[#8B7355]">{selectedFeedback.date}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  selectedFeedback.sentiment === 'Positive' ? 'bg-[#6B7F59]/20 text-[#6B7F59]' : selectedFeedback.sentiment === 'Neutral' ? 'bg-[#C9A84C]/20 text-[#C9A84C]' : 'bg-[#C75B39]/20 text-[#C75B39]'
                )}>
                  {selectedFeedback.sentiment}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

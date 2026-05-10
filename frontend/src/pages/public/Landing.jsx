import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../services/api';
import GradientHeroSection from '../../components/ui/GradientHeroSection';
import LiveTrackingPanel from '../../components/ui/LiveTrackingPanel';
import GlowButton from '../../components/ui/GlowButton';
import AnimatedBackground from '../../components/3d/AnimatedBackground';

export default function Landing() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        const response = await api.get('/providers/featured');
        setProviders(response.data);
      } catch (error) {
        console.error('Failed to fetch featured providers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopProviders();
  }, []);

  const features = [
    { title: "Instant Booking", description: "Get a professional at your door in under 30 minutes.", icon: Zap },
    { title: "Verified Pros", description: "Every provider is background checked and top-rated.", icon: Shield },
    { title: "Live Tracking", description: "Watch your provider arrive in real-time on the map.", icon: CheckCircle2 }
  ];

  return (
    <div className="bg-slate-900 text-slate-50 relative selection:bg-blue-500/30 selection:text-white overflow-hidden">
      <AnimatedBackground />
      <GradientHeroSection />

      {/* Featured Services/Providers */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated <span className="text-cyan-400">Professionals</span></h2>
            <p className="text-slate-400">Hire the best local talent right now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                <p className="italic">Finding the best pros for you...</p>
              </div>
            ) : providers.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 italic">
                Searching for top professionals in your area...
              </div>
            ) : (
              providers.map((p, i) => (
                <motion.div
                  key={p._id || i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 p-4 rounded-2xl group hover:border-slate-600 transition-colors"
                >
                  <div className="bg-slate-800 rounded-xl overflow-hidden aspect-video relative mb-4">
                    <img src={p.image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop"} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-lg font-bold text-white">{p.name}</p>
                      <p className="text-cyan-400 text-sm font-medium">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-2 pb-2">
                    <p className="text-white font-medium">₹{p.price}/hr</p>
                    <GlowButton variant="secondary" href={`/providers/${p._id || p.id}`} className="px-4 py-2 text-sm">Book</GlowButton>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Live Tracking Showcase */}
      <section className="py-24 bg-slate-800/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Track Your Service <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">In Real Time</span></h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                No more guessing when they will arrive. Our integrated tracking system gives you live map updates and estimated arrival times down to the minute.
              </p>
              <div className="space-y-4 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{f.title}</h4>
                      <p className="text-sm text-slate-500">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <LiveTrackingPanel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to experience the future?</h2>
          <div className="flex justify-center gap-4">
            <GlowButton variant="primary" href="/register" className="px-8 py-4 text-lg">Join for Free</GlowButton>
            <GlowButton variant="glass" href="/services" className="px-8 py-4 text-lg">Browse Services</GlowButton>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Image as ImageIcon, Briefcase, MapPin, Camera, ChevronRight, Check, Star, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProviderProfile = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Info', icon: User, desc: 'Your personal and contact details' },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase, desc: 'Manage your rates and service types' },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: ImageIcon, desc: 'Display your best work and results' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Professional Profile</h1>
        <p className="text-slate-400">Manage how clients see your expertise on the platform</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Modern Settings Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-3 space-y-1 shadow-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group overflow-hidden ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                    isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">{tab.label}</div>
                    <div className={`text-[10px] truncate w-40 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {tab.desc}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeProviderTabIndicator"
                      className="absolute right-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-6 p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Public View</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">Your profile is currently live and visible to potential clients in Mumbai area.</p>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 underline-offset-4">View Public Profile →</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {activeTab === 'general' && (
                <Card className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32" />
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" /> General Information
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-8 mb-10 items-center bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                    <div className="relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1540565993045-303545f8226d?q=80&w=200&auto=format&fit=crop" 
                        alt="Profile" 
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-700 shadow-2xl transition-transform group-hover:scale-105"
                      />
                      <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-xl text-white shadow-lg hover:bg-blue-500 transition-all hover:scale-110">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h4 className="text-lg font-bold text-white mb-1">Professional Photo</h4>
                      <p className="text-sm text-slate-400 mb-4">Profiles with professional photos receive 3x more bookings.</p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                        <Button size="sm" className="px-6">Upload Photo</Button>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-400">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <Input label="Full Name" defaultValue="Rahul Sharma" placeholder="Your Name" />
                    <Input label="Professional Email" defaultValue="rahul@example.com" type="email" />
                    <Input label="Mobile Number" defaultValue="+91 98765 43210" placeholder="+91" />
                    <Input label="Primary Location" defaultValue="Andheri West, Mumbai" leftIcon={<MapPin className="w-4 h-4 text-slate-500" />} />
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-300 mb-3">
                      About Me / Professional Bio
                    </label>
                    <textarea 
                      rows="5" 
                      className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all shadow-inner leading-relaxed"
                      defaultValue="With over 10 years of experience in residential and commercial plumbing, I specialize in complex leak detection and eco-friendly installations. I take pride in providing fast, reliable, and clean service to every household."
                      placeholder="Tell your clients about your expertise..."
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-700/50 flex justify-end">
                    <Button variant="primary" className="px-10 shadow-lg shadow-blue-600/20">Save Profile</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'services' && (
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" /> Services & Pricing
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Input label="Primary Expertise" defaultValue="Plumbing" disabled className="opacity-60 bg-slate-800" />
                      <Input label="Service Title" defaultValue="Master Plumber" placeholder="e.g. Senior Electrician" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Hourly Rate (₹)" defaultValue="400" type="number" />
                        <Input label="Min. Booking (₹)" defaultValue="200" type="number" />
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
                      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest text-slate-500">Price Preview</h4>
                      <div className="flex justify-between items-center py-3 border-b border-slate-800">
                        <span className="text-slate-400 text-sm">Hourly Charge</span>
                        <span className="text-white font-bold">₹400 / hr</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-800">
                        <span className="text-slate-400 text-sm">Platform Fee</span>
                        <span className="text-slate-500 font-bold">- ₹40</span>
                      </div>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-white font-bold">Your Take-home</span>
                        <span className="text-green-400 font-black text-lg">₹360 / hr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-slate-700/50 flex justify-start">
                    <Button variant="primary" className="px-8 shadow-lg shadow-blue-600/20">Update Service Info</Button>
                  </div>
                </Card>
              )}

              {activeTab === 'portfolio' && (
                <Card className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-400" /> Work Portfolio
                      </h3>
                      <p className="text-xs text-slate-400">Showcase your completed projects to build trust</p>
                    </div>
                    <Button size="sm" className="px-6">+ Add New Work</Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {[
                      { img: 'https://images.unsplash.com/photo-1585819200845-a764d2be73eb?auto=format&fit=crop&q=80&w=400', label: 'Leak Repair' },
                      { img: 'https://images.unsplash.com/photo-1607472586893-edb57cb31322?auto=format&fit=crop&q=80&w=400', label: 'Bathroom Fitting' },
                      { img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400', label: 'Pipe Installation' },
                    ].map((item, idx) => (
                      <div key={idx} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 shadow-xl cursor-pointer">
                        <img 
                          src={item.img} 
                          alt={item.label} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-white font-bold text-xs mb-1">{item.label}</p>
                          <div className="flex gap-2">
                            <button className="text-[10px] font-black text-blue-400 uppercase tracking-tighter hover:text-blue-300">Edit</button>
                            <button className="text-[10px] font-black text-red-400 uppercase tracking-tighter hover:text-red-300">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button className="aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-3 group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                        <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400">Upload Project</span>
                    </button>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

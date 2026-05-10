import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Lock, Shield, CreditCard, Camera, ChevronRight, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User, desc: 'Update your photo and personal details' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Choose what updates you want to receive' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Manage your password and account safety' },
    { id: 'billing', label: 'Payment Methods', icon: CreditCard, desc: 'Manage your cards and billing info' },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-slate-400">Manage your profile and platform preferences</p>
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
                      layoutId="activeTabIndicator"
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
              {activeTab === 'profile' && (
                <>
                  <Card className="p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32" />
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" /> Personal Details
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-8 mb-10 items-center bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                      <div className="relative group">
                        <img 
                          src="https://images.unsplash.com/photo-1535715014582-719598e4b6b0?q=80&w=200&auto=format&fit=crop" 
                          alt="Profile" 
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-700 shadow-2xl transition-transform group-hover:scale-105"
                        />
                        <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 rounded-xl text-white shadow-lg hover:bg-blue-500 transition-all hover:scale-110">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">Profile Avatar</h4>
                        <p className="text-sm text-slate-400 mb-4">Recommended: 400x400px, Max 2MB</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                          <Button size="sm" className="px-6">Upload New</Button>
                          <Button variant="outline" size="sm" className="border-slate-700 text-slate-400">Remove</Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Input label="First Name" defaultValue="John" placeholder="e.g. John" />
                      <Input label="Last Name" defaultValue="Doe" placeholder="e.g. Doe" />
                      <Input label="Email Address" defaultValue="john.doe@example.com" type="email" placeholder="your@email.com" />
                      <Input label="Phone Number" defaultValue="+91 98765 43210" placeholder="+91" />
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-slate-700/50 flex justify-end">
                      <Button variant="primary" className="px-10 shadow-lg shadow-blue-600/20">Update Profile</Button>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Service Addresses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 relative group cursor-pointer">
                        <div className="absolute top-4 right-4 bg-blue-600 p-1 rounded-md">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">Primary Home</span>
                        <p className="font-bold text-white mb-1">123 Palm Grove, Apt 4B</p>
                        <p className="text-sm text-slate-400">Andheri West, Mumbai, 400053</p>
                      </div>
                      <button className="p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-500 hover:text-blue-400 flex flex-col items-center justify-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                          <span className="text-xl">+</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">Add New Address</span>
                      </button>
                    </div>
                  </Card>
                </>
              )}

              {activeTab === 'notifications' && (
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" /> Notifications
                  </h3>
                  <div className="space-y-1">
                    {[
                      { title: 'Booking Status', desc: 'Real-time updates on your service progress', icon: Check },
                      { title: 'Provider Messages', desc: 'Direct chat notifications from experts', icon: Check },
                      { title: 'Promotional Offers', desc: 'New deals and community discounts', icon: Check },
                      { title: 'Security Alerts', desc: 'Login attempts and account activity', icon: Check },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-4 px-2 rounded-2xl hover:bg-slate-800/30 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                          <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 shadow-inner" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" /> Password & Security
                  </h3>
                  <div className="max-w-md space-y-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                    <div className="space-y-4">
                      <Input label="Current Password" type="password" placeholder="••••••••" />
                      <div className="h-px bg-slate-800 my-2" />
                      <Input label="New Password" type="password" placeholder="••••••••" />
                      <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    </div>
                    <Button variant="primary" className="w-full shadow-lg shadow-blue-600/20 py-3">Update Credentials</Button>
                  </div>
                  
                  <div className="mt-8 p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-start gap-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg shrink-0">
                      <Lock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">Add an extra layer of security to your account by requiring a code from your phone to log in.</p>
                      <button className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors">Enable 2FA Now →</button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === 'billing' && (
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" /> Payment Methods
                  </h3>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 transition-all group-hover:opacity-100" />
                      <div className="relative p-6 flex justify-between items-center text-white">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-9 bg-white/20 rounded-lg backdrop-blur-md flex items-center justify-center border border-white/30">
                            <span className="font-black italic text-xs">VISA</span>
                          </div>
                          <div>
                            <p className="text-lg font-black tracking-widest">•••• •••• •••• 4242</p>
                            <p className="text-[10px] uppercase font-bold opacity-70">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase border border-white/30">Primary</div>
                      </div>
                    </div>
                    
                    <button className="w-full py-6 border-2 border-dashed border-slate-700 rounded-3xl text-slate-500 font-bold hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all">
                      + Add New Card
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

export default UserSettings;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Lock, Shield, CreditCard, Camera, ChevronRight, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import GlowButton from '../../components/ui/GlowButton';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User, desc: 'Update your photo and personal details' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Choose what updates you want to receive' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Manage your password and account safety' },
    { id: 'billing', label: 'Payment Methods', icon: CreditCard, desc: 'Manage your cards and billing info' },
  ];

  const inputStyle = {
    background: '#1A1F28',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Account Settings</h1>
        <p className="text-[#9099A8]">Manage your profile and platform preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div
            className="rounded-3xl p-3 space-y-1"
            style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group overflow-hidden"
                  style={isActive ? {
                    background: '#F4B400',
                    color: '#000',
                    boxShadow: '0 4px 16px rgba(244,180,0,0.25)',
                  } : {
                    color: '#9099A8',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div
                    className="p-2 rounded-xl shrink-0 transition-colors"
                    style={isActive ? { background: 'rgba(0,0,0,0.15)' } : { background: 'rgba(255,255,255,0.05)' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">{tab.label}</div>
                    <div className={`text-[10px] truncate w-40 font-semibold ${isActive ? 'text-black/60' : 'text-[#9099A8]'}`}>
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
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeTab === 'profile' && (
                <>
                  <div
                    className="p-6 md:p-8 relative overflow-hidden rounded-2xl"
                    style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#F4B400]" /> Personal Details
                    </h3>

                    <div
                      className="flex flex-col sm:flex-row gap-6 mb-8 items-center p-6 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="relative group">
                        <img
                          src="https://images.unsplash.com/photo-1535715014582-719598e4b6b0?q=80&w=200&auto=format&fit=crop"
                          alt="Profile"
                          className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                          style={{ border: '2px solid rgba(244,180,0,0.2)' }}
                        />
                        <button
                          className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl text-black shadow-md transition-all hover:scale-105"
                          style={{ background: '#F4B400' }}
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h4 className="text-base font-bold text-white mb-0.5">Profile Avatar</h4>
                        <p className="text-xs text-[#9099A8] mb-4 font-semibold">Recommended: 400x400px, Max 2MB</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                          <GlowButton variant="primary" className="px-5 py-2 text-xs">Upload New</GlowButton>
                          <GlowButton variant="secondary" className="px-5 py-2 text-xs">Remove</GlowButton>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {['First Name', 'Last Name', 'Email Address', 'Phone Number'].map((label, i) => (
                        <div key={label}>
                          <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">{label}</label>
                          <input
                            type={label === 'Email Address' ? 'email' : 'text'}
                            defaultValue={['John', 'Doe', 'john.doe@example.com', '+91 98765 43210'][i]}
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <GlowButton variant="primary" className="px-8 py-3 text-sm">Update Profile</GlowButton>
                    </div>
                  </div>

                  <div
                    className="p-6 md:p-8 rounded-2xl"
                    style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <h3 className="text-lg font-bold text-white mb-6">Service Addresses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className="p-5 rounded-2xl border-2 relative group cursor-pointer"
                        style={{ borderColor: '#F4B400', background: 'rgba(244,180,0,0.06)' }}
                      >
                        <div
                          className="absolute top-4 right-4 p-1 rounded-md"
                          style={{ background: '#F4B400' }}
                        >
                          <Check className="w-3 h-3 text-black" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#F4B400] mb-2 block">Primary Home</span>
                        <p className="font-bold text-white mb-1 text-sm">123 Palm Grove, Apt 4B</p>
                        <p className="text-xs text-[#9099A8] font-semibold">Andheri West, Mumbai, 400053</p>
                      </div>
                      <button
                        className="p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 group transition-all"
                        style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#9099A8' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,180,0,0.4)'; e.currentTarget.style.color = '#F4B400'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#9099A8'; }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
                          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                          <span className="text-lg font-black">+</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">Add New Address</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <div
                  className="p-6 md:p-8 rounded-2xl"
                  style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#F4B400]" /> Notifications
                  </h3>
                  <div className="space-y-1">
                    {[
                      { title: 'Booking Status', desc: 'Real-time updates on your service progress', icon: Check },
                      { title: 'Provider Messages', desc: 'Direct chat notifications from experts', icon: Check },
                      { title: 'Promotional Offers', desc: 'New deals and community discounts', icon: Check },
                      { title: 'Security Alerts', desc: 'Login attempts and account activity', icon: Check },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4 px-2 rounded-2xl transition-all"
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className="flex gap-4 items-center">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(244,180,0,0.08)', border: '1px solid rgba(244,180,0,0.15)', color: '#F4B400' }}
                          >
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-[#9099A8] font-semibold">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F4B400] shadow-inner" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div
                  className="p-6 md:p-8 rounded-2xl"
                  style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#F4B400]" /> Password & Security
                  </h3>
                  <div
                    className="max-w-md space-y-5 p-6 rounded-2xl mb-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="space-y-4">
                      {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                        <div key={label}>
                          <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">{label}</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            style={inputStyle}
                            onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>
                    <GlowButton variant="primary" className="w-full py-3 text-sm">Update Credentials</GlowButton>
                  </div>

                  <div
                    className="p-5 rounded-2xl flex items-start gap-4"
                    style={{ background: 'rgba(244,180,0,0.06)', border: '1px solid rgba(244,180,0,0.15)' }}
                  >
                    <div
                      className="p-2 rounded-xl shrink-0"
                      style={{ background: 'rgba(244,180,0,0.1)' }}
                    >
                      <Lock className="w-5 h-5 text-[#F4B400]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Two-Factor Authentication</h4>
                      <p className="text-xs text-[#9099A8] mb-3 leading-relaxed font-semibold">Add an extra layer of security to your account by requiring a code from your phone to log in.</p>
                      <button className="text-xs font-bold text-[#F4B400] hover:underline transition-colors">Enable 2FA Now →</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div
                  className="p-6 md:p-8 rounded-2xl"
                  style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#F4B400]" /> Payment Methods
                  </h3>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden group rounded-2xl shadow-xl">
                      <div className="absolute inset-0 opacity-90 transition-all group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }} />
                      <div className="relative p-6 flex justify-between items-center text-black">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-9 bg-black/20 rounded-lg backdrop-blur-sm flex items-center justify-center border border-black/20">
                            <span className="font-black italic text-xs">VISA</span>
                          </div>
                          <div>
                            <p className="text-base font-black tracking-widest">•••• •••• •••• 4242</p>
                            <p className="text-[10px] uppercase font-bold opacity-75 mt-0.5">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-black/20 rounded-lg text-[10px] font-black uppercase border border-black/20">Primary</div>
                      </div>
                    </div>

                    <button
                      className="w-full py-5 border-2 border-dashed rounded-2xl font-bold transition-all text-sm"
                      style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#9099A8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,180,0,0.4)'; e.currentTarget.style.color = '#F4B400'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#9099A8'; }}
                    >
                      + Add New Card
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

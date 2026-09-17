import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Lock, Shield, CreditCard, Camera, ChevronRight, Check,
  Loader2, AlertCircle, MapPin, Trash2, CheckCircle
} from 'lucide-react';
import GlowButton from '../../components/ui/GlowButton';
import { useAuth } from '../../context/AuthContext';
import api, { getImageUrl } from '../../services/api';

const inputStyle = {
  background: '#FFFFFF',
  border: '1.5px solid rgba(139,92,246,0.12)',
  color: '#111827',
  borderRadius: '1rem',
  padding: '0.75rem 1rem',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: '0 4px 14px rgba(99,102,241,0.04)',
};

const inputFocus = (e) => {
  e.target.style.borderColor = '#8B5CF6';
  e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)';
};
const inputBlur = (e) => {
  e.target.style.borderColor = 'rgba(139,92,246,0.12)';
  e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)';
};

const UserSettings = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [address, setAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState(null);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('user_notifications');
      return saved ? JSON.parse(saved) : { bookingStatus: true, providerMessages: true, promotionalOffers: false, securityAlerts: true };
    } catch { return { bookingStatus: true, providerMessages: true, promotionalOffers: false, securityAlerts: true }; }
  });

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfileImage(user.profileImage || '');
      setAddress(user.address || '');
      setNewAddressInput(user.address || '');
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User, desc: 'Update your photo and personal details' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Choose what updates you want to receive' },
    { id: 'security', label: 'Security', icon: Lock, desc: 'Manage your password and account safety' },
    { id: 'billing', label: 'Payment Methods', icon: CreditCard, desc: 'Manage your cards and billing info' },
  ];

  const getImageSrc = () => {
    if (!profileImage) return null;
    return getImageUrl(profileImage);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setMessage({ type: 'error', text: 'File size exceeds 5MB limit.' }); return; }
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true); setMessage(null);
    try {
      const response = await api.post(`/users/${user.id}/upload-photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const uploadedUrl = response.data.profileImage || response.data.imageUrl;
      setProfileImage(uploadedUrl);
      refreshUser({ ...user, profileImage: uploadedUrl });
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo.' });
    } finally { setUploading(false); }
  };

  const handleRemovePhoto = async () => {
    setUploading(true); setMessage(null);
    try {
      const updatedUserDto = { name: `${firstName} ${lastName}`.trim(), email, phone, address, profileImage: '' };
      const response = await api.put(`/users/${user.id}`, updatedUserDto);
      setProfileImage(''); refreshUser(response.data);
      setMessage({ type: 'success', text: 'Profile picture removed.' });
    } catch { setMessage({ type: 'error', text: 'Failed to remove picture.' }); }
    finally { setUploading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); setLoading(true); setMessage(null);
    try {
      const response = await api.put(`/users/${user.id}`, { name: `${firstName} ${lastName}`.trim(), email, phone, address, profileImage });
      refreshUser(response.data);
      setMessage({ type: 'success', text: 'Account details updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally { setLoading(false); }
  };

  const handleSaveAddress = async () => {
    if (!newAddressInput.trim()) return;
    setLoading(true);
    try {
      const response = await api.put(`/users/${user.id}`, { name: `${firstName} ${lastName}`.trim(), email, phone, address: newAddressInput.trim(), profileImage });
      setAddress(response.data.address); refreshUser(response.data); setIsEditingAddress(false);
      setMessage({ type: 'success', text: 'Service address updated!' });
    } catch { setMessage({ type: 'error', text: 'Failed to update address.' }); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault(); setSecurityMessage(null);
    if (!currentPassword) { setSecurityMessage({ type: 'error', text: 'Please enter your current password.' }); return; }
    if (newPassword.length < 6) { setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters.' }); return; }
    if (newPassword !== confirmPassword) { setSecurityMessage({ type: 'error', text: 'Passwords do not match.' }); return; }
    setUpdatingPassword(true);
    try {
      await api.post(`/users/${user.id}/change-password`, { currentPassword, newPassword });
      setSecurityMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setSecurityMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally { setUpdatingPassword(false); }
  };

  const toggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('user_notifications', JSON.stringify(updated));
  };

  const Alert = ({ msg }) => msg && (
    <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold border ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
      {msg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <span>{msg.text}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 bg-[#F5F3FF] min-h-screen">
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/png, image/jpeg, image/webp" className="hidden" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Account Settings</h1>
        <p className="text-gray-800 font-semibold text-sm">Manage your profile details, service addresses, and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="rounded-3xl p-3 space-y-1 bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMessage(null); setSecurityMessage(null); }}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-left"
                  style={isActive ? { background: '#F3F0FF', color: '#8B5CF6' } : { color: '#6B7280' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#FAFAFF'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-purple-100 text-[#8B5CF6]' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-bold text-gray-900">{tab.label}</div>
                    <div className="text-[10px] truncate w-40 font-semibold text-gray-700">{tab.desc}</div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#8B5CF6]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">
              <Alert msg={message} />

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <>
                  <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 rounded-3xl bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#8B5CF6]" /> Personal Details
                    </h3>

                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center p-6 rounded-2xl bg-[#FAFAFF] border border-purple-50">
                      <div className="relative group">
                        {getImageSrc() ? (
                          <img src={getImageSrc()} alt="Profile Avatar" className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-purple-200" />
                        ) : (
                          <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-2xl text-gray-900 shadow-md" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                            {(firstName[0] || 'U') + (lastName[0] || '')}
                          </div>
                        )}
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                          className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl text-white shadow-md transition-all hover:scale-110"
                          style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <h4 className="text-base font-bold text-gray-900 mb-1">Profile Avatar</h4>
                        <p className="text-xs text-gray-800 mb-4 font-semibold">Recommended: Square JPG or PNG, Max 5MB</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                            className="px-5 py-2 text-xs font-semibold rounded-full text-white flex items-center gap-2 shadow-md transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                            {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Upload New Photo
                          </button>
                          {profileImage && (
                            <button type="button" onClick={handleRemovePhoto} disabled={uploading}
                              className="px-4 py-2 text-xs font-semibold rounded-full text-red-600 bg-red-50 border border-red-200 flex items-center gap-1.5 hover:bg-red-100 transition-all">
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { label: 'First Name', value: firstName, set: setFirstName, type: 'text', required: true },
                        { label: 'Last Name', value: lastName, set: setLastName, type: 'text' },
                        { label: 'Email Address', value: email, set: setEmail, type: 'email', required: true },
                        { label: 'Phone Number', value: phone, set: setPhone, type: 'text', placeholder: '+91 98765 43210' },
                      ].map(({ label, value, set, type, required, placeholder }) => (
                        <div key={label}>
                          <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wider">{label}</label>
                          <input type={type} required={required} value={value} placeholder={placeholder}
                            onChange={(e) => set(e.target.value)} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 flex justify-end border-t border-purple-50">
                      <button type="submit" disabled={loading}
                        className="px-8 py-3 rounded-full text-sm font-semibold text-white flex items-center gap-2 shadow-md transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />} Save Profile Details
                      </button>
                    </div>
                  </form>

                  {/* SERVICE ADDRESS */}
                  <div className="p-6 md:p-8 rounded-3xl bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#8B5CF6]" /> Service Address
                    </h3>
                    {isEditingAddress ? (
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">Full Service Location / Address</label>
                        <textarea rows={3} value={newAddressInput} onChange={(e) => setNewAddressInput(e.target.value)}
                          placeholder="e.g. 123 Main Street, Sector 4, Panchayat City, 751001"
                          style={{ ...inputStyle, resize: 'none' }} onFocus={inputFocus} onBlur={inputBlur} />
                        <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsEditingAddress(false)}
                            className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 border border-purple-100 bg-white">Cancel</button>
                          <button type="button" onClick={handleSaveAddress} disabled={loading}
                            className="px-5 py-2 rounded-full text-xs font-semibold text-white flex items-center gap-2 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Address
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div onClick={() => setIsEditingAddress(true)}
                          className="p-5 rounded-2xl border-2 relative group cursor-pointer transition-all hover:border-purple-400 bg-[#F3F0FF] border-purple-300">
                          <div className="absolute top-4 right-4 p-1 rounded-lg bg-[#8B5CF6]">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8B5CF6] mb-2 block">Primary Address</span>
                          <p className="font-bold text-gray-900 mb-1 text-sm">{address || 'No service address specified'}</p>
                          <p className="text-xs text-gray-500 font-medium mt-2 underline">Click to edit address</p>
                        </div>
                        <button type="button" onClick={() => setIsEditingAddress(true)}
                          className="p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 group transition-all hover:border-purple-400 border-purple-200 bg-white">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 group-hover:bg-purple-100 transition-all">
                            <span className="text-lg font-bold text-[#8B5CF6]">+</span>
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-[#8B5CF6]">Update Address</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div className="p-6 md:p-8 rounded-3xl bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#8B5CF6]" /> Notifications
                  </h3>
                  <div className="space-y-1">
                    {[
                      { key: 'bookingStatus', title: 'Booking Status', desc: 'Real-time updates on your service progress' },
                      { key: 'providerMessages', title: 'Provider Messages', desc: 'Direct chat notifications from service providers' },
                      { key: 'promotionalOffers', title: 'Promotional Offers', desc: 'Special discounts, deals, and community offers' },
                      { key: 'securityAlerts', title: 'Security Alerts', desc: 'Account login alerts and security updates' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-4 px-4 rounded-2xl transition-all hover:bg-purple-50/50">
                        <div className="flex gap-4 items-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-purple-50 text-[#8B5CF6]">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
                          <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5CF6] bg-gray-200" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div className="p-6 md:p-8 rounded-3xl bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#8B5CF6]" /> Password & Security
                  </h3>
                  <Alert msg={securityMessage} />
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-5 p-6 rounded-2xl mb-6 bg-[#FAFAFF] border border-purple-50 mt-4">
                    {[
                      { label: 'Current Password', value: currentPassword, set: setCurrentPassword },
                      { label: 'New Password', value: newPassword, set: setNewPassword },
                      { label: 'Confirm New Password', value: confirmPassword, set: setConfirmPassword },
                    ].map(({ label, value, set }) => (
                      <div key={label}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input type="password" required placeholder="••••••••" value={value} onChange={(e) => set(e.target.value)} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                      </div>
                    ))}
                    <button type="submit" disabled={updatingPassword}
                      className="w-full py-3 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                      {updatingPassword && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
                    </button>
                  </form>
                  <div className="p-5 rounded-2xl flex items-start gap-4 bg-purple-50 border border-purple-100">
                    <div className="p-2 rounded-xl shrink-0 bg-purple-100"><Lock className="w-5 h-5 text-[#8B5CF6]" /></div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Session Security</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">Your account is secured with JWT tokens and encrypted password verification.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && (
                <div className="p-6 md:p-8 rounded-3xl bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#8B5CF6]" /> Payment Methods
                  </h3>
                  <div className="space-y-4">
                    <div className="relative overflow-hidden group rounded-2xl shadow-md">
                      <div className="absolute inset-0 opacity-90 transition-all group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }} />
                      <div className="relative p-6 flex justify-between items-center text-white">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-9 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <span className="font-bold italic text-xs">UPI / CARD</span>
                          </div>
                          <div>
                            <p className="text-base font-bold tracking-widest">Pay on Service Completion</p>
                            <p className="text-[10px] uppercase font-semibold opacity-75 mt-0.5">Cash / UPI / Online Payment</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase border border-white/20">Active</div>
                      </div>
                    </div>
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

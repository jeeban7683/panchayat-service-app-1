import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Image as ImageIcon, Briefcase, MapPin, Camera, ChevronRight, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import GlowButton from '../../components/ui/GlowButton';
import api, { getImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProviderProfile = () => {
  const { user, refreshUser } = useAuth();
  const providerId = localStorage.getItem('providerId') || user?.provider?.id;
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', bio: '', experience: 0, price: 0, responseTime: '', profileImage: '', portfolioImage1: '', portfolioImage2: '', portfolioImage3: '', serviceTitle: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!providerId) { setErrorMessage('Provider ID not found. Please log in.'); setIsLoading(false); return; }
    const fetchProfile = async () => {
      try {
        setIsLoading(true); setErrorMessage('');
        const response = await api.get(`/providers/${providerId}/profile`);
        const data = response.data;
        setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', bio: data.bio || '', experience: data.experience !== undefined ? data.experience : 0, price: data.price !== undefined ? data.price : 0, responseTime: data.responseTime || '', profileImage: data.profileImage || '', portfolioImage1: data.portfolioImage1 || '', portfolioImage2: data.portfolioImage2 || '', portfolioImage3: data.portfolioImage3 || '', serviceTitle: data.serviceTitle || '' });
      } catch (err) { setErrorMessage('Failed to load profile. Please try again.'); }
      finally { setIsLoading(false); }
    };
    fetchProfile();
  }, [providerId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === 'number') parsedValue = value === '' ? '' : Number(value);
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Full Name is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Mobile Number is required';
    if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setErrorMessage('Please fix validation errors before saving.'); return; }
    try {
      setIsSaving(true); setSuccessMessage(''); setErrorMessage('');
      let currentProfileImage = formData.profileImage;
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        const photoRes = await api.post(`/providers/${providerId}/upload-photo`, fileData, { headers: { 'Content-Type': 'multipart/form-data' } });
        currentProfileImage = photoRes.data.profileImage || photoRes.data.imageUrl;
        setPreviewUrl(null); setSelectedFile(null);
      }
      const updatedFormData = { ...formData, profileImage: currentProfileImage };
      const response = await api.put(`/providers/${providerId}/profile`, updatedFormData);
      const data = response.data;
      setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', bio: data.bio || '', experience: data.experience !== undefined ? data.experience : 0, price: data.price !== undefined ? data.price : 0, responseTime: data.responseTime || '', profileImage: data.profileImage || '', portfolioImage1: data.portfolioImage1 || '', portfolioImage2: data.portfolioImage2 || '', portfolioImage3: data.portfolioImage3 || '', serviceTitle: data.serviceTitle || '' });
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) { setErrorMessage('Failed to save profile. Please try again.'); }
    finally { setIsSaving(false); }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;
    const fileData = new FormData();
    fileData.append('file', selectedFile);
    try {
      setIsSaving(true); setErrorMessage(''); setSuccessMessage('');
      const response = await api.post(`/providers/${providerId}/upload-photo`, fileData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const uploadedPath = response.data.profileImage || response.data.imageUrl;
      setFormData(prev => ({ ...prev, profileImage: uploadedPath }));
      setPreviewUrl(null); setSelectedFile(null);
      setSuccessMessage('Photo uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      try { const meRes = await api.get('/auth/me'); refreshUser(meRes.data); } catch (_) {}
      const profileResponse = await api.get(`/providers/${providerId}/profile`);
      const data = profileResponse.data;
      setFormData({ name: data.name || '', email: data.email || '', phone: data.phone || '', location: data.location || '', bio: data.bio || '', experience: data.experience !== undefined ? data.experience : 0, price: data.price !== undefined ? data.price : 0, responseTime: data.responseTime || '', profileImage: data.profileImage || '', portfolioImage1: data.portfolioImage1 || '', portfolioImage2: data.portfolioImage2 || '', portfolioImage3: data.portfolioImage3 || '', serviceTitle: data.serviceTitle || '' });
    } catch (err) { setErrorMessage('Failed to upload photo. Please try again.'); }
    finally { setIsSaving(false); }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: User, desc: 'Your personal and contact details' },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase, desc: 'Manage your rates and service types' },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: ImageIcon, desc: 'Display your best work and results' },
  ];

  if (isLoading) return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 text-center bg-[#F5F3FF] min-h-screen" style={{ paddingTop: '10rem' }}>
      <div className="animate-spin inline-block w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent rounded-full mb-4"></div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading professional profile...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 bg-[#F5F3FF] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Professional Profile</h1>
        <p className="text-gray-600 text-sm font-normal">Manage how clients see your expertise on the platform</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200">
          ⚠ {errorMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="rounded-3xl p-3 space-y-1 bg-white shadow-[0_12px_40px_rgba(99,102,241,0.08)] border border-purple-50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
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

          <div className="mt-6 p-5 rounded-3xl bg-purple-50 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-[#8B5CF6] uppercase tracking-wider">Public View</span>
            </div>
            <p className="text-xs text-gray-900 leading-relaxed mb-4 font-semibold">Your profile is currently live and visible to potential clients.</p>
            <button type="button" className="text-xs font-bold text-[#8B5CF6] hover:underline">View Public Profile →</button>
          </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-6">

              {activeTab === 'general' && (
                <Card className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#8B5CF6]" /> General Information
                  </h3>

                  {/* Photo Upload */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center p-6 rounded-2xl bg-[#FAFAFF] border border-purple-50">
                    <div className="relative group">
                      <img
                        src={previewUrl ? previewUrl : formData.profileImage ? getImageUrl(formData.profileImage) : "https://images.unsplash.com/photo-1540565993045-303545f8226d?q=80&w=200&auto=format&fit=crop"}
                        alt="Profile"
                        className="w-24 h-24 rounded-2xl object-cover shadow-md"
                        style={{ border: previewUrl ? '2px solid rgba(139,92,246,0.6)' : '2px solid rgba(139,92,246,0.2)' }}
                      />
                      <input ref={fileInputRef} id="profilePicInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl text-white shadow-md transition-all hover:scale-110"
                        style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}>
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-0.5">Professional Photo</h4>
                      <p className="text-xs text-gray-800 mb-4 font-semibold">Profiles with professional photos receive 3x more bookings.</p>
                      {selectedFile && <p className="text-xs text-[#8B5CF6] mb-3 font-semibold">Selected: {selectedFile.name}</p>}
                      <div className="mb-4"><Input placeholder="Or paste profile photo URL" name="profileImage" value={formData.profileImage} onChange={handleChange} /></div>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                        <GlowButton type="button" variant="secondary" onClick={() => fileInputRef.current.click()} className="px-5 py-2 text-xs">Choose Photo</GlowButton>
                        <GlowButton type="button" variant="primary" onClick={handlePhotoUpload} disabled={!selectedFile || isSaving} className="px-5 py-2 text-xs">
                          {isSaving ? 'Uploading...' : 'Upload Photo'}
                        </GlowButton>
                        <GlowButton type="button" variant="secondary" onClick={() => { setFormData(p => ({ ...p, profileImage: '' })); setPreviewUrl(null); setSelectedFile(null); }} className="px-5 py-2 text-xs">Remove</GlowButton>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <Input label="Full Name" value={formData.name} name="name" onChange={handleChange} error={errors.name} placeholder="Your Name" />
                    <Input label="Professional Email" value={formData.email} type="email" disabled className="opacity-50" />
                    <Input label="Mobile Number" value={formData.phone} name="phone" onChange={handleChange} error={errors.phone} placeholder="+91" />
                    <Input label="Primary Location" value={formData.location} name="location" onChange={handleChange} leftIcon={<MapPin className="w-4 h-4 text-gray-400" />} />
                  </div>

                  <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-900 mb-2.5 uppercase tracking-wider">About Me / Professional Bio</label>
                    <textarea rows="5"
                      className="w-full px-5 py-4 rounded-2xl outline-none transition-all text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 bg-white"
                      style={{ border: '1.5px solid rgba(139,92,246,0.12)', boxShadow: '0 4px 14px rgba(99,102,241,0.04)' }}
                      onFocus={e => { e.target.style.borderColor = '#8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(139,92,246,0.12)'; e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)'; }}
                      name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell your clients about your expertise..." />
                  </div>

                  <div className="pt-6 flex justify-end border-t border-purple-50">
                    <GlowButton type="submit" variant="primary" disabled={isSaving} className="px-8 py-3 text-sm">
                      {isSaving ? 'Saving Changes...' : 'Save Profile'}
                    </GlowButton>
                  </div>
                </Card>
              )}

              {activeTab === 'services' && (
                <Card className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#8B5CF6]" /> Services & Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <Input label="Primary Expertise" defaultValue="Plumbing" disabled className="opacity-50" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Experience (Years)" value={formData.experience} name="experience" type="number" onChange={handleChange} error={errors.experience} />
                        <Input label="Response Time" value={formData.responseTime} name="responseTime" onChange={handleChange} placeholder="e.g. Fast (under 1hr)" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Hourly Rate (₹)" value={formData.price} name="price" type="number" onChange={handleChange} error={errors.price} />
                        <Input label="Service Title" value={formData.serviceTitle} name="serviceTitle" onChange={handleChange} placeholder="e.g. Master Plumber" />
                      </div>
                    </div>
                    {/* Price Preview Card */}
                    <div className="p-6 rounded-2xl space-y-4 bg-[#FAFAFF] border border-purple-50">
                      <h4 className="text-[10px] font-bold text-gray-900 mb-2 uppercase tracking-wider">Price Preview</h4>
                      <div className="flex justify-between items-center py-2.5 border-b border-purple-50">
                        <span className="text-gray-800 text-sm font-semibold">Hourly Charge</span>
                        <span className="text-gray-900 font-bold text-sm">₹{formData.price || 0} / hr</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b border-purple-50">
                        <span className="text-gray-800 text-sm font-semibold">Platform Fee</span>
                        <span className="text-gray-800 font-bold text-sm">- ₹{(formData.price * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5">
                        <span className="text-gray-900 font-bold">Your Take-home</span>
                        <span className="text-emerald-600 font-bold text-lg">₹{(formData.price * 0.9).toFixed(2)} / hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 flex justify-start border-t border-purple-50">
                    <GlowButton type="submit" variant="primary" disabled={isSaving} className="px-6 py-2.5 text-sm">
                      {isSaving ? 'Updating...' : 'Update Service Info'}
                    </GlowButton>
                  </div>
                </Card>
              )}

              {activeTab === 'portfolio' && (
                <Card className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#8B5CF6]" /> Work Portfolio
                      </h3>
                      <p className="text-xs text-gray-800 font-semibold">Showcase your completed projects to build trust</p>
                    </div>
                    <GlowButton type="button" variant="primary" className="px-5 py-2 text-xs">Work Portfolio</GlowButton>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {[
                      { img: formData.portfolioImage1 ? getImageUrl(formData.portfolioImage1) : 'https://images.unsplash.com/photo-1585819200845-a764d2be73eb?auto=format&fit=crop&q=80&w=400', label: 'Leak Repair' },
                      { img: formData.portfolioImage2 ? getImageUrl(formData.portfolioImage2) : 'https://images.unsplash.com/photo-1607472586893-edb57cb31322?auto=format&fit=crop&q=80&w=400', label: 'Bathroom Fitting' },
                      { img: formData.portfolioImage3 ? getImageUrl(formData.portfolioImage3) : 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400', label: 'Pipe Installation' },
                    ].map((item, idx) => (
                      <div key={idx} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-purple-50">
                        <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-gray-900 font-bold text-xs mb-1">{item.label}</p>
                          <div className="flex gap-2">
                            <button type="button" className="text-[10px] font-semibold text-blue-200 uppercase tracking-wider hover:text-white transition-colors">Edit</button>
                            <button type="button" className="text-[10px] font-semibold text-red-200 uppercase tracking-wider hover:text-white transition-colors">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button type="button"
                      className="aspect-[4/3] rounded-2xl border-2 border-dashed border-purple-200 transition-all flex flex-col items-center justify-center gap-3 group hover:border-purple-400 hover:bg-purple-50/50 bg-white">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-50 group-hover:bg-purple-100 transition-all">
                        <ImageIcon className="w-5 h-5 text-[#8B5CF6]" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-[#8B5CF6]">Upload Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-6 border-t border-purple-50">
                    <Input label="Portfolio Image 1 URL" value={formData.portfolioImage1} name="portfolioImage1" onChange={handleChange} placeholder="Paste Image 1 URL" />
                    <Input label="Portfolio Image 2 URL" value={formData.portfolioImage2} name="portfolioImage2" onChange={handleChange} placeholder="Paste Image 2 URL" />
                    <Input label="Portfolio Image 3 URL" value={formData.portfolioImage3} name="portfolioImage3" onChange={handleChange} placeholder="Paste Image 3 URL" />
                  </div>

                  <div className="mt-8 pt-6 flex justify-end border-t border-purple-50">
                    <GlowButton type="submit" variant="primary" disabled={isSaving} className="px-8 py-3 text-sm">
                      {isSaving ? 'Saving Changes...' : 'Save Portfolio'}
                    </GlowButton>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default ProviderProfile;

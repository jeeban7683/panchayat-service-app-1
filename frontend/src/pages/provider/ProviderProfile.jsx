import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Image as ImageIcon, Briefcase, MapPin, Camera, ChevronRight, Globe } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import GlowButton from '../../components/ui/GlowButton';
import api, { getImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProviderProfile = () => {
  const { user } = useAuth();
  const providerId = localStorage.getItem('providerId') || user?.provider?.id;
  const [activeTab, setActiveTab] = useState('general');

  // Form State containing all profile details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience: 0,
    price: 0,
    responseTime: '',
    profileImage: '',
    portfolioImage1: '',
    portfolioImage2: '',
    portfolioImage3: '',
    serviceTitle: ''
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Core async states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Success/Failure feedback messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // === ADDED: Local preview of selected image before uploading ===
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch provider profile data on component load
  useEffect(() => {
    if (!providerId) {
      setErrorMessage('Provider ID not found. Please log in.');
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await api.get(`/providers/${providerId}/profile`);
        const data = response.data;
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          experience: data.experience !== undefined ? data.experience : 0,
          price: data.price !== undefined ? data.price : 0,
          responseTime: data.responseTime || '',
          profileImage: data.profileImage || '',
          portfolioImage1: data.portfolioImage1 || '',
          portfolioImage2: data.portfolioImage2 || '',
          portfolioImage3: data.portfolioImage3 || '',
          serviceTitle: data.serviceTitle || ''
        });
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setErrorMessage('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [providerId]);

  // Handler for input value changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Perform frontend data validation checks
  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Full Name is required';
    }
    if (!formData.phone || formData.phone.trim() === '') {
      newErrors.phone = 'Mobile Number is required';
    }
    if (formData.experience < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler to update the profile details
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrorMessage('Please fix validation errors before saving.');
      return;
    }

    try {
      setIsSaving(true);
      setSuccessMessage('');
      setErrorMessage('');
      const response = await api.put(`/providers/${providerId}/profile`, formData);
      const data = response.data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        experience: data.experience !== undefined ? data.experience : 0,
        price: data.price !== undefined ? data.price : 0,
        responseTime: data.responseTime || '',
        profileImage: data.profileImage || '',
        portfolioImage1: data.portfolioImage1 || '',
        portfolioImage2: data.portfolioImage2 || '',
        portfolioImage3: data.portfolioImage3 || '',
        serviceTitle: data.serviceTitle || ''
      });
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // === ADDED: Handle file selection – show preview without uploading yet ===
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    // Create a local object URL for instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // === ADDED: Upload the selected file to the backend when Upload button is clicked ===
  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    const fileData = new FormData();
    fileData.append('file', selectedFile);

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Fixed endpoint: POST /api/providers/{providerId}/upload-photo
      const response = await api.post(`/providers/${providerId}/upload-photo`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Backend returns { profileImage: "/uploads/profile/..." }
      const uploadedPath = response.data.profileImage || response.data.imageUrl;

      // Update formData with the new server path and clear local preview
      setFormData(prev => ({ ...prev, profileImage: uploadedPath }));
      setPreviewUrl(null);
      setSelectedFile(null);

      setSuccessMessage('Photo uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reload profile so all fields reflect the latest server data
      const profileResponse = await api.get(`/providers/${providerId}/profile`);
      const data = profileResponse.data;
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        experience: data.experience !== undefined ? data.experience : 0,
        price: data.price !== undefined ? data.price : 0,
        responseTime: data.responseTime || '',
        profileImage: data.profileImage || '',
        portfolioImage1: data.portfolioImage1 || '',
        portfolioImage2: data.portfolioImage2 || '',
        portfolioImage3: data.portfolioImage3 || '',
        serviceTitle: data.serviceTitle || ''
      });
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setErrorMessage('Failed to upload photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info', icon: User, desc: 'Your personal and contact details' },
    { id: 'services', label: 'Services & Pricing', icon: Briefcase, desc: 'Manage your rates and service types' },
    { id: 'portfolio', label: 'Portfolio Showcase', icon: ImageIcon, desc: 'Display your best work and results' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8 text-center text-white" style={{ minHeight: '60vh', paddingTop: '10rem' }}>
        <div className="animate-spin inline-block w-8 h-8 border-4 border-[#F4B400] border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs text-[#9099A8] font-bold uppercase tracking-wider">Loading professional profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Professional Profile</h1>
        <p className="text-[#9099A8] text-sm">Manage how clients see your expertise on the platform</p>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl text-sm font-bold text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20">
          ✓ {successMessage}
        </div>
      )}

      {/* Failure Notification Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/25">
          ⚠ {errorMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-3xl p-3 space-y-1" style={{ background: '#14181F', border: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group overflow-hidden ${isActive ? 'text-black shadow-md' : ''}`}
                  style={isActive ? { background: '#F4B400', boxShadow: '0 4px 16px rgba(244,180,0,0.25)' } : {}}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="p-2 rounded-xl shrink-0 transition-colors" style={isActive ? { background: 'rgba(0,0,0,0.15)' } : { background: 'rgba(255,255,255,0.05)' }}>
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
          
          <div className="mt-6 p-5 rounded-3xl" style={{ background: 'rgba(244,180,0,0.06)', border: '1px solid rgba(244,180,0,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F4B400, #FFC928)' }}>
                <Globe className="w-4 h-4 text-black" />
              </div>
              <span className="text-[10px] font-bold text-[#F4B400] uppercase tracking-wider">Public View</span>
            </div>
            <p className="text-xs text-[#9099A8] leading-relaxed mb-4 font-semibold">Your profile is currently live and visible to potential clients in Mumbai area.</p>
            <button type="button" className="text-xs font-bold text-[#F4B400] hover:underline transition-colors">View Public Profile →</button>
          </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeTab === 'general' && (
                <Card className="p-6 md:p-8 relative overflow-hidden">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#F4B400]" /> General Information
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-8 items-center p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="relative group">
                      {/* === ADDED: Show local preview if a file is selected, otherwise show saved profileImage === */}
                      <img 
                        src={
                          previewUrl
                            ? previewUrl
                            : formData.profileImage
                              ? getImageUrl(formData.profileImage)
                              : "https://images.unsplash.com/photo-1540565993045-303545f8226d?q=80&w=200&auto=format&fit=crop"
                        } 
                        alt="Profile" 
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                        style={{ border: previewUrl ? '2px solid rgba(244,180,0,0.6)' : '2px solid rgba(244,180,0,0.2)' }}
                      />
                      {/* === ADDED: Hidden file input wired to handleFileSelect for preview === */}
                      <input 
                        ref={fileInputRef}
                        id="profilePicInput" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl text-black shadow-md transition-all hover:scale-105" 
                        style={{ background: '#F4B400' }}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h4 className="text-base font-bold text-white mb-0.5">Professional Photo</h4>
                      <p className="text-xs text-[#9099A8] mb-4 font-semibold">Profiles with professional photos receive 3x more bookings.</p>

                      {/* === ADDED: Show selected file name as feedback when a file is chosen === */}
                      {selectedFile && (
                        <p className="text-xs text-[#F4B400] mb-3 font-semibold">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                      
                      <div className="mb-4">
                        <Input 
                          placeholder="Or paste profile photo URL"
                          name="profileImage"
                          value={formData.profileImage}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                        {/* Choose file → triggers preview only */}
                        <GlowButton type="button" variant="secondary" onClick={() => fileInputRef.current.click()} className="px-5 py-2 text-xs">Choose Photo</GlowButton>
                        {/* === ADDED: Upload button – only active when a file is selected === */}
                        <GlowButton
                          type="button"
                          variant="primary"
                          onClick={handlePhotoUpload}
                          disabled={!selectedFile || isSaving}
                          className="px-5 py-2 text-xs"
                        >
                          {isSaving ? 'Uploading...' : 'Upload Photo'}
                        </GlowButton>
                        <GlowButton
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setFormData(p => ({ ...p, profileImage: '' }));
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="px-5 py-2 text-xs"
                        >
                          Remove
                        </GlowButton>
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
                    <label className="block text-xs font-bold text-[#9099A8] mb-2.5 uppercase tracking-widest">
                      About Me / Professional Bio
                    </label>
                    <textarea 
                      rows="5" 
                      className="w-full px-5 py-4 rounded-xl outline-none transition-all text-sm leading-relaxed text-white placeholder:text-[#4B5563]"
                      style={{ background: '#1A1F28', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => { e.target.style.borderColor = '#F4B400'; e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell your clients about your expertise..."
                    />
                  </div>
                  
                  <div className="pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <GlowButton type="submit" variant="primary" disabled={isSaving} className="px-8 py-3 text-sm">
                      {isSaving ? 'Saving Changes...' : 'Save Profile'}
                    </GlowButton>
                  </div>
                </Card>
              )}

              {activeTab === 'services' && (
                <Card className="p-6 md:p-8">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#F4B400]" /> Services & Pricing
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

                    <div className="p-6 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h4 className="text-[10px] font-bold text-[#9099A8] mb-2 uppercase tracking-wider">Price Preview</h4>
                      <div className="flex justify-between items-center py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        <span className="text-[#9099A8] text-sm">Hourly Charge</span>
                        <span className="text-white font-bold text-sm">₹{formData.price || 0} / hr</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                        <span className="text-[#9099A8] text-sm">Platform Fee</span>
                        <span className="text-[#9099A8] font-bold text-sm">- ₹{(formData.price * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5">
                        <span className="text-white font-bold">Your Take-home</span>
                        <span className="text-[#34D399] font-black text-lg">₹{(formData.price * 0.9).toFixed(2)} / hr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 flex justify-start" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#F4B400]" /> Work Portfolio
                      </h3>
                      <p className="text-xs text-[#9099A8] font-semibold">Showcase your completed projects to build trust</p>
                    </div>
                    <GlowButton type="button" variant="primary" className="px-5 py-2 text-xs">Work Portfolio</GlowButton>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {[
                      { img: formData.portfolioImage1 ? getImageUrl(formData.portfolioImage1) : 'https://images.unsplash.com/photo-1585819200845-a764d2be73eb?auto=format&fit=crop&q=80&w=400', label: 'Leak Repair' },
                      { img: formData.portfolioImage2 ? getImageUrl(formData.portfolioImage2) : 'https://images.unsplash.com/photo-1607472586893-edb57cb31322?auto=format&fit=crop&q=80&w=400', label: 'Bathroom Fitting' },
                      { img: formData.portfolioImage3 ? getImageUrl(formData.portfolioImage3) : 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400', label: 'Pipe Installation' },
                    ].map((item, idx) => (
                      <div key={idx} className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img 
                          src={item.img} 
                          alt={item.label} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-white font-bold text-xs mb-1">{item.label}</p>
                          <div className="flex gap-2">
                            <button type="button" className="text-[10px] font-black text-blue-300 uppercase tracking-wider hover:text-white transition-colors">Edit</button>
                            <button type="button" className="text-[10px] font-black text-red-300 uppercase tracking-wider hover:text-white transition-colors">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="aspect-[4/3] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 group"
                      style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#9099A8' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,180,0,0.4)'; e.currentTarget.style.background = 'rgba(244,180,0,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'transparent'; }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <ImageIcon className="w-5 h-5 text-[#9099A8] group-hover:text-[#F4B400]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <Input label="Portfolio Image 1 URL" value={formData.portfolioImage1} name="portfolioImage1" onChange={handleChange} placeholder="Paste Image 1 URL" />
                    <Input label="Portfolio Image 2 URL" value={formData.portfolioImage2} name="portfolioImage2" onChange={handleChange} placeholder="Paste Image 2 URL" />
                    <Input label="Portfolio Image 3 URL" value={formData.portfolioImage3} name="portfolioImage3" onChange={handleChange} placeholder="Paste Image 3 URL" />
                  </div>

                  <div className="mt-8 pt-6 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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

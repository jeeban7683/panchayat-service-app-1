import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GlowButton from '../../components/ui/GlowButton';
import { User, Mail, Lock, Shield, UserCircle, Briefcase, Loader2, Phone, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ROLE_OPTIONS = [
  { value: 'user', label: 'Client', icon: UserCircle, desc: 'Book local services' },
  { value: 'provider', label: 'Provider', icon: Briefcase, desc: 'Offer your expertise' },
  { value: 'admin', label: 'Admin', icon: Shield, desc: 'Manage the platform' },
];

export default function Register() {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '', licenseId: '', experience: '', responseTime: ''
  });
  const [serviceId, setServiceId] = useState('');
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (role === 'admin') {
      if (formData.email.toLowerCase() !== 'jeevanjyotigochhayatjitu@gmail.com') {
        setError('Only the authorized email is permitted to register as Admin.');
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== 'Jeevan@2005') {
        setError('Invalid Admin Secret Password. Registration denied.');
        setIsSubmitting(false);
        return;
      }
    }

    const name = `${formData.firstName} ${formData.lastName}`.trim();
    const data = {
      name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      role: role.toUpperCase(),
      serviceId: role === 'provider' && serviceId ? parseInt(serviceId) : null,
      experience: role === 'provider' ? parseInt(formData.experience) || 0 : 0,
      responseTime: role === 'provider' ? formData.responseTime || 'Fast (under 1hr)' : null
    };

    const result = await register(data);
    if (result.success) {
      if (data.role === 'ADMIN') navigate('/');
      else if (data.role === 'PROVIDER') navigate('/provider/dashboard');
      else {
        const from = location.state?.from || '/';
        navigate(from);
      }
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-[#4B5563] focus:outline-none transition-all text-sm font-medium";
  const inputStyle = {
    background: '#1A1F28',
    border: '1px solid rgba(255,255,255,0.08)',
  };
  const inputFocus = (e) => {
    e.target.style.border = '1px solid #F4B400';
    e.target.style.boxShadow = '0 0 0 3px rgba(244,180,0,0.12)';
  };
  const inputBlur = (e) => {
    e.target.style.border = '1px solid rgba(255,255,255,0.08)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4"
      style={{ background: '#000000' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg"
      >
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-2xl"
          style={{
            background: '#14181F',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F4B400 0%, #FFC928 100%)' }}
            >
              <MapPin className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
              Join Panchayat
            </h1>
            <p className="text-sm text-[#9099A8]">
              Create your account and get started today
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            {ROLE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className="relative flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all text-center"
                style={role === value ? {
                  borderColor: '#F4B400',
                  background: 'rgba(244,180,0,0.08)',
                  color: '#F4B400',
                } : {
                  borderColor: 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#9099A8',
                }}
              >
                <Icon className="w-5 h-5 mb-1 shrink-0" />
                <span className="text-xs font-bold truncate w-full text-center">{label}</span>
                <span className={cn('text-[10px] mt-0.5 hidden sm:block truncate', role === value ? 'text-[#F4B400]/70' : 'text-[#9099A8]')}>
                  {desc}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div
                className="p-3.5 rounded-xl text-sm text-center font-semibold"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}
              >
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                  <input type="text" name="firstName" required placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                  <input type="text" name="lastName" required placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">
                {role === 'admin' ? 'Admin Secret Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                <input type="password" name="password" required placeholder={role === 'admin' ? 'Enter Admin Secret' : 'Create Password'} value={formData.password} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Admin notice */}
            {role === 'admin' && (
              <div
                className="p-3.5 rounded-xl text-xs text-center leading-relaxed font-semibold"
                style={{ background: 'rgba(244,180,0,0.06)', border: '1px solid rgba(244,180,0,0.2)', color: '#F4B400' }}
              >
                ⚠️ Admin registration requires the unique Admin Secret Password.
              </div>
            )}

            {/* Provider extra fields */}
            <AnimatePresence mode="popLayout">
              {role === 'provider' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">License / ID</label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                      <input type="text" name="licenseId" required={role === 'provider'} placeholder="Professional License / ID" value={formData.licenseId} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Service Area</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                      <select
                        name="serviceId"
                        required={role === 'provider'}
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className="w-full rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none transition-all text-sm font-medium cursor-pointer"
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      >
                        <option value="" disabled style={{ color: '#4B5563', background: '#14181F' }}>Select Service Area</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id} style={{ background: '#14181F' }}>{service.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Years of Experience</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                        <input
                          type="number"
                          name="experience"
                          min="0"
                          max="50"
                          required={role === 'provider'}
                          placeholder="e.g. 3"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className={inputClass}
                          style={inputStyle}
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#9099A8] mb-1.5 uppercase tracking-widest">Response Time</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9099A8]" />
                        <select
                          name="responseTime"
                          required={role === 'provider'}
                          value={formData.responseTime}
                          onChange={handleInputChange}
                          className="w-full rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none transition-all text-sm font-medium cursor-pointer"
                          style={inputStyle}
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                        >
                          <option value="" disabled style={{ background: '#14181F' }}>Select response time</option>
                          <option value="Within 30 minutes" style={{ background: '#14181F' }}>Within 30 minutes</option>
                          <option value="Within 1 hour" style={{ background: '#14181F' }}>Within 1 hour</option>
                          <option value="Within 2 hours" style={{ background: '#14181F' }}>Within 2 hours</option>
                          <option value="Same day" style={{ background: '#14181F' }}>Same day</option>
                          <option value="Next day" style={{ background: '#14181F' }}>Next day</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <GlowButton
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
              className="py-3.5 text-sm mt-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
              ) : (
                'Create Account'
              )}
            </GlowButton>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-xs text-[#9099A8]">Already have an account?</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <Link
            to="/login"
            state={location.state}
            className="block w-full text-center py-3 rounded-xl text-sm font-bold text-[#9099A8] hover:text-[#F4B400] transition-all border"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

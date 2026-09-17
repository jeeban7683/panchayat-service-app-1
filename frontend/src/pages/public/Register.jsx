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

  const inputClass = "w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all text-sm font-medium bg-white";
  const inputStyle = {
    border: '1.5px solid rgba(139, 92, 246, 0.12)',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.04)',
  };
  const inputFocus = (e) => {
    e.target.style.borderColor = '#8B5CF6';
    e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.18)';
  };
  const inputBlur = (e) => {
    e.target.style.borderColor = 'rgba(139,92,246,0.12)';
    e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.04)';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-16 px-4 bg-[#F5F3FF]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg"
      >
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(99,102,241,0.08)] bg-white border border-purple-50"
        >

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex justify-center items-center w-14 h-14 rounded-2xl mb-4 shadow-md"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
            >
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
              Join Panchayat
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Create your account and get started today
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2.5 mb-8">
            {ROLE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className="relative flex flex-col items-center py-3.5 px-2 rounded-2xl border-2 transition-all text-center"
                style={role === value ? {
                  borderColor: '#8B5CF6',
                  background: '#F3F0FF',
                  color: '#8B5CF6',
                  boxShadow: '0 4px 14px rgba(139,92,246,0.1)',
                } : {
                  borderColor: 'rgba(139,92,246,0.12)',
                  background: '#FFFFFF',
                  color: '#6B7280',
                }}
              >
                <Icon className="w-5 h-5 mb-1 shrink-0" />
                <span className="text-xs font-bold truncate w-full text-center">{label}</span>
                <span className={cn('text-[10px] mt-0.5 hidden sm:block truncate font-medium', role === value ? 'text-[#8B5CF6]' : 'text-gray-400')}>
                  {desc}
                </span>
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div
                className="p-3.5 rounded-2xl text-sm text-center font-semibold bg-red-50 border border-red-200 text-red-600"
              >
                {error}
              </div>
            )}

            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                  <input type="text" name="firstName" required placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                  <input type="text" name="lastName" required placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                {role === 'admin' ? 'Admin Secret Password' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                <input type="password" name="password" required placeholder={role === 'admin' ? 'Enter Admin Secret' : 'Create Password'} value={formData.password} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
              </div>
            </div>

            {/* Admin notice */}
            {role === 'admin' && (
              <div
                className="p-3.5 rounded-2xl text-xs text-center leading-relaxed font-semibold bg-purple-50 border border-purple-100 text-[#8B5CF6]"
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
                  className="space-y-4 overflow-hidden pt-1"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">License / ID</label>
                    <div className="relative">
                      <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                      <input type="text" name="licenseId" required={role === 'provider'} placeholder="Professional License / ID" value={formData.licenseId} onChange={handleInputChange} className={inputClass} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Service Area</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                      <select
                        name="serviceId"
                        required={role === 'provider'}
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className="w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 focus:outline-none transition-all text-sm font-medium cursor-pointer bg-white"
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      >
                        <option value="" disabled className="text-gray-400 bg-white">Select Service Area</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id} className="bg-white text-gray-900">{service.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Years of Experience</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
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
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Response Time</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                        <select
                          name="responseTime"
                          required={role === 'provider'}
                          value={formData.responseTime}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl py-3 pl-11 pr-4 text-gray-900 focus:outline-none transition-all text-sm font-medium cursor-pointer bg-white"
                          style={inputStyle}
                          onFocus={inputFocus}
                          onBlur={inputBlur}
                        >
                          <option value="" disabled className="bg-white text-gray-400">Select response time</option>
                          <option value="Within 30 minutes" className="bg-white text-gray-900">Within 30 minutes</option>
                          <option value="Within 1 hour" className="bg-white text-gray-900">Within 1 hour</option>
                          <option value="Within 2 hours" className="bg-white text-gray-900">Within 2 hours</option>
                          <option value="Same day" className="bg-white text-gray-900">Same day</option>
                          <option value="Next day" className="bg-white text-gray-900">Next day</option>
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
            <div className="flex-1 h-px bg-purple-50" />
            <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
            <div className="flex-1 h-px bg-purple-50" />
          </div>

          <Link
            to="/login"
            state={location.state}
            className="block w-full text-center py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-[#8B5CF6] hover:bg-purple-50/50 transition-all border border-purple-100 bg-white"
          >
            Sign In Instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import GlowButton from '../../components/ui/GlowButton';
import { User, Mail, Lock, Shield, UserCircle, Briefcase, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    licenseId: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      ...formData,
      role: role.toUpperCase()
    };

    const result = await register(payload);
    
    if (result.success) {
      if (payload.role === 'ADMIN') navigate('/admin/dashboard');
      else if (payload.role === 'PROVIDER') navigate('/provider/dashboard');
      else navigate('/user/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden items-center justify-center pt-24 pb-12 bg-slate-900">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10 px-4"
      >
        <div className="bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-2 tracking-tight">Join Panchayat</h1>
            <p className="text-slate-400">Experience the next-gen marketplace</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-900 p-1 rounded-2xl border border-slate-700 shadow-inner">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={cn(
                "relative py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors z-10",
                role === 'user' ? "text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {role === 'user' && (
                <motion.div layoutId="role-pill" className="absolute inset-0 bg-slate-700 rounded-xl shadow-lg border border-slate-600 z-[-1]" />
              )}
              <UserCircle className="w-4 h-4" /> Client
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={cn(
                "relative py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors z-10",
                role === 'provider' ? "text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {role === 'provider' && (
                <motion.div layoutId="role-pill" className="absolute inset-0 bg-slate-700 rounded-xl shadow-lg border border-slate-600 z-[-1]" />
              )}
              <Briefcase className="w-4 h-4" /> Provider
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  name="firstName"
                  required
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  name="lastName"
                  required
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="email" 
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="password" 
                name="password"
                required
                placeholder="Create Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {role === 'provider' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    name="licenseId"
                    required={role === 'provider'}
                    placeholder="Professional License / ID"
                    value={formData.licenseId}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <GlowButton 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isSubmitting}
              className="py-3.5 mt-6 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </GlowButton>
          </form>

          <p className="text-center text-slate-400 mt-8 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-semibold hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

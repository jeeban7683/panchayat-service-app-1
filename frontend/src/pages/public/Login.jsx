import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import GlowButton from '../../components/ui/GlowButton';
import { Mail, Lock, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect based on role
      const role = result.user.role;
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'PROVIDER') navigate('/provider/dashboard');
      else navigate('/user/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden items-center justify-center pt-16 bg-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <div className="bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400">Enter your details to access your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-5 h-5 rounded border border-slate-600 bg-slate-900 group-hover:border-blue-400 transition-colors flex items-center justify-center">
                  <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer peer" />
                  <div className="w-3 h-3 bg-blue-500 rounded-[2px] opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>

            <GlowButton 
              type="submit" 
              variant="primary" 
              fullWidth 
              disabled={isSubmitting}
              className="py-3.5 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </GlowButton>
          </form>

          <p className="text-center text-slate-400 mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:text-blue-400 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

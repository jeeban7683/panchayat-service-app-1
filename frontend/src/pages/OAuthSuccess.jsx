import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    // Log the token temporarily for debugging (Requirement 14)
    console.log("Google JWT:", token);

    if (!token) {
      setError("Google Login Failed: Token missing from redirect URL.");
      return;
    }

    const verifyAndFetch = async () => {
      try {
        // Store token in localStorage (Requirement 3)
        localStorage.setItem("token", token);

        // Fetch logged-in user (Requirement 4)
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Log response.data temporarily for debugging (Requirement 14)
        console.log("Logged User:", response.data);

        const userData = response.data;
        if (!userData || !userData.role) {
          throw new Error("Invalid user data or role missing.");
        }

        // Store user in localStorage (Requirement 4)
        localStorage.setItem("user", JSON.stringify(userData));

        // Save auth data to trigger context update and navigate in next tick
        setAuthData({ token, userData });
      } catch (err) {
        console.error("OAuth verification error:", err);
        setError("Google Login Failed");
        
        // Clean up any partially stored values
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    verifyAndFetch();
  }, [searchParams]);

  useEffect(() => {
    if (authData) {
      const timer = setTimeout(() => {
        // Update Auth Context automatically (Requirement 9)
        loginWithToken(authData.token, authData.userData);

        // Redirect according to role (Requirement 5)
        const role = authData.userData.role;
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'PROVIDER') {
          navigate('/provider/dashboard', { replace: true });
        } else if (role === 'USER') {
          navigate('/user/dashboard', { replace: true });
        } else {
          // fallback to landing
          navigate('/user/dashboard', { replace: true });
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [authData, loginWithToken, navigate]);

  // Error redirect countdown
  useEffect(() => {
    if (error) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/login', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [error, navigate]);

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center py-16 px-4" 
        
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-2xl text-center border"
            style={{
              background: '#FFFFFF',
              borderColor: 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)' }}
              >
                <AlertTriangle className="w-8 h-8 text-[#F87171]" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">
                Google Login Failed
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {error}
              </p>
              <div className="text-xs text-gray-500">
                Redirecting you to the login page in <span className="text-[#8B5CF6] font-bold">{countdown}</span> seconds...
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      
    >
      <div className="text-center flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#8B5CF6] animate-spin" />
        <h2 className="text-xl font-bold text-gray-900 tracking-wide">Signing you in...</h2>
        <p className="text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  );
}

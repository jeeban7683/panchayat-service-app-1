import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import ProviderPending from './ProviderPending';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3FF' }}>
        <Loader2 className="w-10 h-10 text-[#F4B400] animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Block unverified providers — show pending screen instead of redirecting to login
  if (user.role === 'PROVIDER') {
    // Check all possible field names the backend might use
    const isVerified =
      user.provider?.is_verified ??
      user.provider?.isVerified ??
      user.provider?.verified ??
      user.is_verified ??
      user.isVerified ??
      user.verified;

    // Only block if explicitly false (not null/undefined — those mean "unknown", allow through)
    if (isVerified === false) {
      return <ProviderPending />;
    }
  }

  return <Outlet />;
};

export default RoleBasedRoute;

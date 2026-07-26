import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import Sidebar from '../components/shared/Sidebar';
import Footer from '../components/shared/Footer';

// Public Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Services from '../pages/public/Services';
import ProviderListing from '../pages/public/ProviderListing';
import ProviderDetails from '../pages/public/ProviderDetails';
import ServiceProviders from '../pages/public/ServiceProviders';
import NotFound from '../pages/public/NotFound';
import ForgotPassword from '../pages/public/ForgotPassword';
import VerifyOtp from '../pages/public/VerifyOtp';
import ResetPassword from '../pages/public/ResetPassword';
import OAuthSuccess from '../pages/OAuthSuccess';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import BookingHistory from '../pages/user/BookingHistory';
import BookingDetails from '../pages/user/BookingDetails';
import UserReviews from '../pages/user/UserReviews';
import UserSettings from '../pages/user/UserSettings';

// Provider Pages
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ProviderJobs from '../pages/provider/ProviderJobs';
import ProviderEarnings from '../pages/provider/ProviderEarnings';
import ProviderReviews from '../pages/provider/ProviderReviews';
import ProviderProfile from '../pages/provider/ProviderProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProviders from '../pages/admin/AdminProviders';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminReviews from '../pages/admin/AdminReviews';
import AdminAnalytics from '../pages/admin/AdminAnalytics';

// Chat Pages
import ChatPage from '../pages/chat/ChatPage';

// Custom Route Guards
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';

// Smart chat redirector — routes user to role-based chat path
const ChatRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <Loader2 className="w-10 h-10 text-[#F4B400] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  const roleMap = { USER: '/user/chat', PROVIDER: '/provider/chat', ADMIN: '/admin/chat' };
  const chatBase = roleMap[user.role] || '/user/chat';
  return <Navigate to={`${chatBase}${location.search}`} replace />;
};

// Smart redirector for generic dashboard endpoint
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const roleMap = { ADMIN: '/admin/dashboard', PROVIDER: '/provider/dashboard', USER: '/user/dashboard' };
  return <Navigate to={roleMap[user.role] || '/user/dashboard'} replace />;
};

// Smart redirector for generic bookings endpoint
const BookingsRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const roleMap = { ADMIN: '/admin/bookings', PROVIDER: '/provider/jobs', USER: '/user/bookings' };
  return <Navigate to={roleMap[user.role] || '/user/bookings'} replace />;
};

// Smart redirector for generic profile endpoint
const ProfileRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const roleMap = { ADMIN: '/admin/dashboard', PROVIDER: '/provider/profile', USER: '/user/settings' };
  return <Navigate to={roleMap[user.role] || '/user/settings'} replace />;
};

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col" style={{ background: '#000000' }}>
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <div className="relative z-10">
      <Footer />
    </div>
  </div>
);

const DashboardLayout = ({ role }) => (
  <div className="min-h-screen flex" style={{ background: '#000000' }}>
    <Sidebar role={role} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 pt-16">
        <Outlet />
      </main>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceName/providers" element={<ServiceProviders />} />
          <Route path="/providers" element={<ProviderListing />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />

          {/* PASSWORD RECOVERY ROUTES */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* SMART REDIRECTS (PROTECTED) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatRedirect />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/bookings" element={<BookingsRedirect />} />
          <Route path="/profile" element={<ProfileRedirect />} />
        </Route>

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={['USER']} />}>
            <Route path="/user" element={<DashboardLayout role="USER" />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="bookings" element={<BookingHistory />} />
              <Route path="bookings/:id" element={<BookingDetails />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="reviews" element={<UserReviews />} />
              <Route path="settings" element={<UserSettings />} />
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        {/* PROVIDER ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={['PROVIDER']} />}>
            <Route path="/provider" element={<DashboardLayout role="PROVIDER" />}>
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="jobs" element={<ProviderJobs />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="earnings" element={<ProviderEarnings />} />
              <Route path="reviews" element={<ProviderReviews />} />
              <Route path="profile" element={<ProviderProfile />} />
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

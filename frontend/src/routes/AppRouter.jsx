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
import NotFound from '../pages/public/NotFound';

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

const PublicLayout = () => (
  <div className="min-h-screen bg-slate-900 flex flex-col">
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
  <div className="min-h-screen bg-slate-900 flex">
    <Sidebar role={role} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">
        <Outlet />
      </main>
    </div>
  </div>
);

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Temporarily allowed for testing
  return <Outlet />;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers" element={<ProviderListing />} />
          <Route path="/providers/:id" element={<ProviderDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/user" element={<DashboardLayout role="USER" />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="bookings" element={<BookingHistory />} />
            <Route path="bookings/:id" element={<BookingDetails />} />
            <Route path="reviews" element={<UserReviews />} />
            <Route path="settings" element={<UserSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* PROVIDER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
          <Route path="/provider" element={<DashboardLayout role="PROVIDER" />}>
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="jobs" element={<ProviderJobs />} />
            <Route path="earnings" element={<ProviderEarnings />} />
            <Route path="reviews" element={<ProviderReviews />} />
            <Route path="profile" element={<ProviderProfile />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<DashboardLayout role="ADMIN" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="providers" element={<AdminProviders />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

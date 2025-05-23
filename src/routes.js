// src/routes.js
import { lazy } from 'react';

// Lazy load components for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/404'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const EmailConfirmed = lazy(() => import('./pages/auth/EmailConfirmed'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword')); // NEW: Added reset password route
const Profile = lazy(() => import('./pages/auth/Profile'));

// Facility owner pages (to be created)
const FacilityDashboard = lazy(() => import('./pages/facility/Dashboard'));
const FacilitySettings = lazy(() => import('./pages/facility/Settings'));
const BookingManagement = lazy(() => import('./pages/facility/BookingManagement'));

// Player pages (to be created)
const PlayerDashboard = lazy(() => import('./pages/player/Dashboard'));
const Discover = lazy(() => import('./pages/player/Discover'));
const ManageBookings = lazy(() => import('./pages/player/ManageBookings'));
const PlayerSettings = lazy(() => import('./pages/player/Settings'));

export const routes = {
  // Public routes
  public: [
    { path: '/', element: Landing },
    { path: '/home', element: Home },
    { path: '/login', element: Login },
    { path: '/register', element: Register },
    { path: '/auth/verify-email', element: VerifyEmail },
    { path: '/auth/email-confirmed', element: EmailConfirmed },
    { path: '/auth/forgot-password', element: ForgotPassword },
    { path: '/auth/reset-password', element: ResetPassword }, // NEW: Added reset password route
    { path: '/profile', element: Profile },
  ],

  // Facility owner routes
  facilityOwner: [
    { path: '/facility/dashboard', element: FacilityDashboard },
    { path: '/facility/settings', element: FacilitySettings },
    { path: '/facility/bookings', element: BookingManagement },
  ],

  // Player routes
  player: [
    { path: '/player/dashboard', element: PlayerDashboard },
    { path: '/player/discover', element: Discover },
    { path: '/player/bookings', element: ManageBookings },
    { path: '/player/settings', element: PlayerSettings },
  ],

  // Catch all
  notFound: { path: '*', element: NotFound },
};

// src/components/layout/Navbar.jsx (updated)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate away even if logout fails
      navigate('/');
    }
  };

  const renderAuthenticatedNav = () => {
    if (user?.role === 'facility_owner') {
      return (
        <>
          <Link to="/facility/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/facility/bookings" className="nav-link">
            Bookings
          </Link>
          <Link to="/facility/settings" className="nav-link">
            Settings
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </>
      );
    } else if (user?.role === 'player') {
      return (
        <>
          <Link to="/player/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/player/discover" className="nav-link">
            Discover
          </Link>
          <Link to="/player/bookings" className="nav-link">
            My Bookings
          </Link>
          <Link to="/player/settings" className="nav-link">
            Settings
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Sports Platform
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {renderAuthenticatedNav()}
                <span className="text-sm text-gray-600">
                  Welcome, {user.full_name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {user ? (
                <>
                  {renderAuthenticatedNav()}
                  <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block nav-link">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button className="w-full mt-2">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MainLayout, Container } from '../../components/layout';
import { Form, Input, Button, Alert } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // Get success message from location state (e.g., from password reset)
  const successMessage = location.state?.message;

  // Redirect if user is already logged in
  if (user) {
    const redirectPath =
      user.role === 'facility_owner' ? '/facility/dashboard' : '/player/dashboard';
    navigate(redirectPath, { replace: true });
    return null;
  }

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await login(formData.email, formData.password);

      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Handle remember me functionality
      if (formData.rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      }

      // Redirect to intended destination or appropriate dashboard
      let redirectPath;
      if (from) {
        redirectPath = from;
      } else {
        // Will be determined by the auth context when user data loads
        // For now, just let the auth context handle the redirect
        return;
      }

      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      // Handle specific error types
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container className="py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Show success message if coming from password reset or other flow */}
          {successMessage && <Alert type="success" message={successMessage} className="mb-6" />}

          {error && <Alert type="error" message={error} className="mb-6" />}

          <Form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>

              <Link
                to="/auth/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}

export default Login;

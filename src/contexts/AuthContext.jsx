// src/contexts/AuthContext.jsx (Enhanced)
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        // Fetch user profile data including role
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        setUser(profile || data.session.user);
      }

      setLoading(false);

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          // Fetch user profile data
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(profile || session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    };

    getSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, options = {}) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    setLoading(false);

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) throw error;
  };

  const resetPassword = async email => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
  };

  const updatePassword = async newPassword => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  };

  const resendVerification = async email => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });

    if (error) throw error;
  };

  const value = {
    user,
    loading,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

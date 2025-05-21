import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Placeholder for authentication functions
  const login = async (email, password) => {
    // Will implement with Supabase
    console.log('Login:', email, password);
  };

  const logout = async () => {
    // Will implement with Supabase
    console.log('Logout');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

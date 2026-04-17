import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const USERS = {
  admin: {
    id: 1,
    email: 'admin@videotech.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  customer: {
    id: 2,
    email: 'customer@videotech.com',
    password: 'customer123',
    name: 'Customer User',
    role: 'customer',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundUser = Object.values(USERS).find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return userWithoutPassword;
      } else {
        setError('Invalid email or password');
        return null;
      }
    } catch {
      setError('Login failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
    isCustomer,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
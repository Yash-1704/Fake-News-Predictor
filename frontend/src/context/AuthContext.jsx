import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateEmailOptIn } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function login(email, password) {
    await loginUser(email, password);
    return refreshUser();
  }

  async function register(email, password) {
    await registerUser(email, password);
    return refreshUser();
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  async function setEmailOptIn(emailOptIn) {
    const updatedUser = await updateEmailOptIn(emailOptIn);
    setUser((current) => ({ ...(current || {}), ...updatedUser }));
    return updatedUser;
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, setEmailOptIn }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

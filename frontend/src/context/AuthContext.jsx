import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { getCurrentUser, loginUser, logoutUser, registerUser, updateEmailOptIn, updateProfile } from '../api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  async function login(email, password) {
    await loginUser(email, password);
    return refreshUser();
  }

  async function register(email, password, profile) {
    await registerUser(email, password, profile);
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

  async function saveProfile(profile) {
    const updatedUser = await updateProfile(profile);
    setUser((current) => ({ ...(current || {}), ...updatedUser }));
    return updatedUser;
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser, setEmailOptIn, saveProfile }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

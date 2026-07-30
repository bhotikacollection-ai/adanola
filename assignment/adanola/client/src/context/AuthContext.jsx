import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'adanola_token';
const WISH_KEY = 'adanola_wishlist_local';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localWishlist, setLocalWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(localWishlist));
  }, [localWishlist]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const isWishlisted = useCallback(
    (productId) => {
      if (user?.wishlist) {
        return user.wishlist.some((id) => String(id) === String(productId) || String(id?._id) === String(productId));
      }
      return localWishlist.includes(String(productId));
    },
    [user, localWishlist]
  );

  const toggleWishlistLocal = useCallback((productId) => {
    const id = String(productId);
    setLocalWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isWishlisted,
      toggleWishlistLocal,
      localWishlist,
      setUser,
    }),
    [user, loading, login, register, logout, isWishlisted, toggleWishlistLocal, localWishlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

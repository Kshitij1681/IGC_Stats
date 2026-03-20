import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ignou_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('ignou_token');
      if (!savedToken) { setLoading(false); return; }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setToken(savedToken);
        } else {
          localStorage.removeItem('ignou_token');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('ignou_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('ignou_token', data.token);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ignou_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

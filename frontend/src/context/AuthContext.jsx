import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('daa_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return {
      username: 'admin',
      name: 'Dr. Sarah Connor',
      role: 'Chief Academic Evaluator (DAA Lab)',
      institution: 'Department of Computer Science & Engineering'
    };
  });

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const authUser = {
        username: 'admin',
        name: 'Dr. Sarah Connor',
        role: 'Chief Academic Evaluator (DAA Lab)',
        institution: 'Department of Computer Science & Engineering'
      };
      setUser(authUser);
      localStorage.setItem('daa_user', JSON.stringify(authUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Use admin / admin123' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('daa_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

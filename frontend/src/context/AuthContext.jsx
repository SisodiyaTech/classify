import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('classify_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockUsers[0]; // Priya Sharma by default
      }
    }
    return mockUsers[0];
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('classify_token') || 'demo-jwt-token-active';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('classify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('classify_user');
      localStorage.removeItem('classify_token');
    }
  }, [user]);

  // Attempt to sync user with backend on start
  useEffect(() => {
    const fetchMe = async () => {
      if (token && token !== 'demo-jwt-token-active') {
        try {
          const res = await authService.getCurrentUser();
          if (res?.user) {
            setUser(res.user);
          }
        } catch (err) {
          // Keep local state if offline
        }
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password, desiredRole) => {
    try {
      const res = await authService.login({ email, password });
      if (res?.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn('[Auth] Live API login skipped, using demo fallback:', err.message);
    }

    // Seamless Demo Fallback
    let matchedUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!matchedUser) {
      if (desiredRole === 'instructor') {
        matchedUser = mockUsers[1];
      } else if (desiredRole === 'admin') {
        matchedUser = mockUsers[4];
      } else {
        matchedUser = mockUsers[0];
      }
    }
    setUser(matchedUser);
    setToken('demo-jwt-token-active');
    return { success: true, user: matchedUser };
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
  };

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      if (res?.user) {
        setUser(res.user);
        if (res.token) setToken(res.token);
        return { success: true, user: res.user };
      }
    } catch (err) {
      console.warn('[Auth] Live API register skipped, using fallback:', err.message);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'student',
      avatar:
        data.role === 'instructor'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      headline:
        data.role === 'instructor'
          ? 'Aspiring Instructor'
          : 'Enthusiastic Learner',
      bio: data.bio || '',
      location: 'India',
      joinedDate: new Date().toISOString().split('T')[0],
      verificationStatus: data.role === 'instructor' ? 'Not Submitted' : undefined,
      skills: data.skills
        ? typeof data.skills === 'string'
          ? data.skills.split(',').map((s) => s.trim())
          : data.skills
        : [],
      languages: ['English', 'Hindi'],
      phone: data.phone || '+91 90000 00000',
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const switchDemoRole = (roleType) => {
    if (roleType === 'student') {
      setUser(mockUsers[0]); // Priya Sharma
      setToken('demo-token-student');
    } else if (roleType === 'instructor') {
      setUser(mockUsers[1]); // Dr. Ananya Roy (Approved)
      setToken('demo-token-instructor');
    } else if (roleType === 'instructor-pending') {
      setUser(mockUsers[2]); // Sunita Deshmukh (Pending Review)
      setToken('demo-token-instructor-pending');
    } else if (roleType === 'admin') {
      setUser(mockUsers[4]); // Arjun Mehta
      setToken('demo-token-admin');
    } else if (roleType === 'guest') {
      setUser(null);
      setToken(null);
    }
  };

  const updateUser = async (updatedFields) => {
    try {
      const res = await authService.updateProfile(updatedFields);
      if (res?.user) {
        setUser(res.user);
        return;
      }
    } catch (err) {
      // fallback
    }

    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('classify_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        token,
        login,
        logout,
        register,
        switchDemoRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

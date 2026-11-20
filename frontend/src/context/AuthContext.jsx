import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

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

  useEffect(() => {
    if (user) {
      localStorage.setItem('classify_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('classify_user');
    }
  }, [user]);

  const login = (email, password, desiredRole) => {
    let matchedUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
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
    return { success: true, user: matchedUser };
  };

  const logout = () => {
    setUser(null);
  };

  const register = (data) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role || 'student',
      avatar: data.role === 'instructor' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      headline: data.role === 'instructor' ? 'Aspiring Instructor' : 'Enthusiastic Learner',
      bio: data.bio || '',
      location: 'India',
      joinedDate: new Date().toISOString().split('T')[0],
      verificationStatus: data.role === 'instructor' ? 'Not Submitted' : undefined,
      skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
      languages: ['English', 'Hindi'],
      phone: data.phone || '+91 90000 00000'
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const switchDemoRole = (roleType) => {
    if (roleType === 'student') {
      setUser(mockUsers[0]); // Priya Sharma
    } else if (roleType === 'instructor') {
      setUser(mockUsers[1]); // Dr. Ananya Roy (Approved)
    } else if (roleType === 'instructor-pending') {
      setUser(mockUsers[2]); // Sunita Deshmukh (Pending Review)
    } else if (roleType === 'admin') {
      setUser(mockUsers[4]); // Arjun Mehta
    } else if (roleType === 'guest') {
      setUser(null);
    }
  };

  const updateUser = (updatedFields) => {
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
        login,
        logout,
        register,
        switchDemoRole,
        updateUser
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

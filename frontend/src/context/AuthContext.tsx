import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User;
  switchRole: (role: UserRole) => void;
  login: (email: string) => void;
  logout: () => void;
}

const ADMIN_USER: User = {
  id: 1,
  email: 'admin@ecoroute.ai',
  full_name: 'Dr. K. Vijay (Greater Chennai Corp)',
  role: 'Municipal Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
};

const DRIVER_USER: User = {
  id: 2,
  email: 'driver@ecoroute.ai',
  full_name: 'R. Murugan (Senior Driver)',
  role: 'Collection Driver',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(ADMIN_USER);

  const switchRole = (role: UserRole) => {
    if (role === 'Municipal Admin') {
      setUser(ADMIN_USER);
    } else {
      setUser(DRIVER_USER);
    }
  };

  const login = (email: string) => {
    if (email.includes('driver')) {
      setUser(DRIVER_USER);
    } else {
      setUser(ADMIN_USER);
    }
  };

  const logout = () => {
    setUser(ADMIN_USER);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole, login, logout }}>
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

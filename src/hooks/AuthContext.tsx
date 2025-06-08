import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../AxiosInstance'; // 실제 API 인스턴스로 교체하세요

interface User {
  name: string;
  nickName: string;
  point: number;
  address: string;
  number: string;
  areaNumber: string | null;
  email: string;
  socialProvider: string | null;
  img: string | null;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (status: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const isLogin = localStorage.getItem('LoginStatus');
    if (isLogin && !user) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/social/user');
      setUser(response.data.data); // response.data.data가 실제 유저 정보
    } catch (error) {
      console.error('⚠️ 유저 정보 가져오기 실패:', error);
      setUser(null);
    }
  };

  const login = (status: string) => {
    localStorage.setItem('LoginStatus', status);
    setIsLoggedIn(true);
    fetchUserInfo();
  };

  const logout = () => {
    localStorage.removeItem('LoginStatus');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

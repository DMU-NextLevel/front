import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../AxiosInstance'; // 실제 API 인스턴스로 바꿔주세요

// 유저 타입 정의
export interface User {
  name?: string;
  nickName?: string;
  point?: number;
  address?: string;
  number?: string;
  areaNumber?: string | null;
  email?: string;
  socialProvider?: string | null;
  img?: string | null;
}

// 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (status: string, userData?: User) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User) => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const status = localStorage.getItem('LoginStatus');
    if (status) {
      setIsLoggedIn(true);

      const saved = localStorage.getItem('UserData');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // 저장된 유저 데이터가 없으면 API 호출
        api.get('/social/user')
          .then(res => {
            if (res.data.message === 'success') {
              setUser(res.data.data);
              localStorage.setItem('UserData', JSON.stringify(res.data.data));
            }
          })
          .catch(err => {
            console.error('유저 정보 불러오기 실패:', err);
          });
      }
    }
  }, []);

  const login = (status: string, userData?: User) => {
    localStorage.setItem('LoginStatus', status);
    setIsLoggedIn(true);

    if (userData) {
      setUser(userData);
      localStorage.setItem('UserData', JSON.stringify(userData));
    }
  };

  const logout = () => {
    localStorage.removeItem('LoginStatus');
    localStorage.removeItem('UserData');
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

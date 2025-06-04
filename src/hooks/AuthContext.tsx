import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 인증 Context의 타입을 정의합니다.
interface AuthContextType {
  isLoggedIn: boolean;
  login: (status:string) => void;
  logout: () => void;
}

// 기본값으로 Context를 생성합니다.
// Context의 초기값은 실제 사용될 값과 형태가 일치해야 하며,
// 일반적으로 Provider가 렌더링되기 전에는 사용되지 않으므로 null 또는 undefined를 포함할 수 있습니다.
// 여기서는 사용될 함수의 형태만 맞추고, 실제 로직은 Provider에서 구현합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider 컴포넌트를 생성합니다.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 로그인 상태를 관리하는 state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 컴포넌트가 마운트될 때 localStorage에서 refresh 토큰을 확인하여 로그인 상태를 설정합니다.
  useEffect(() => {
    const isLogin = localStorage.getItem('LoginStatus')
		if (isLogin) {
			// refresh 토큰이 존재하면 로그인 상태로 설정합니다.
			// 여기서는 간단히 존재 여부만 확인하지만, 실제로는 토큰 유효성 검사 로직이 필요할 수 있습니다.
			setIsLoggedIn(true)
		}
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행되도록 합니다.

  // 로그인 처리 함수: 토큰을 localStorage에 저장하고 isLoggedIn 상태를 true로 설정합니다.
  const login = (status: string) => {
		localStorage.setItem('LoginStatus', status)
		setIsLoggedIn(true)
	}

	// 로그아웃 처리 함수: localStorage에서 토큰을 제거하고 isLoggedIn 상태를 false로 설정합니다.
	const logout = () => {
		localStorage.removeItem('LoginStatus')
		setIsLoggedIn(false)
	}

  // Context.Provider를 사용하여 하위 컴포넌트에 상태와 함수를 제공합니다.
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context 값을 쉽게 사용하기 위한 커스텀 훅을 생성합니다.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // AuthProvider 내에서 useAuth 훅을 사용하지 않으면 에러를 발생시킵니다.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
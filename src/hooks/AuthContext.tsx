import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '../AxiosInstance'; // 실제 API 인스턴스로 바꿔주세요

// 유저 타입 정의
export interface User {
	id?: number
	name?: string
	nickName?: string
	point?: number
	address?: string
	number?: string
	areaNumber?: string | null
	email?: string
	socialProvider?: string | null
	img?: {
		id: number
		uri: string
	} | null
}

// 컨텍스트 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (status: string, userData?: User) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User) => void;
  refreshAuth: () => void;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

	const refreshAuth = () => {
		// 로그인 여부와 무관하게 항상 유저 정보 요청
		api
			.get('/public/login/token')
			.then((res) => {
				const tokenStatus = res.data.data

				if (tokenStatus === 'no login') {
					setUser(null)
					setIsLoggedIn(false)
					return
				}

				// SOCIAL 로그인인 경우 추가 정보 입력 페이지로 리다이렉트
				// 단, 이미 추가 정보 입력 페이지에 있다면 리다이렉트하지 않음
				if (tokenStatus === 'SOCIAL') {
					setIsLoggedIn(true)

					const currentPath = window.location.pathname
					if (currentPath !== '/additional-info') {
						window.location.href = '/additional-info'
					} else {
					}
				}

				setIsLoggedIn(true)
				api
					.get('/social/user', { withCredentials: true })
					.then((res) => {
						if (res.data.message === 'success') {
							setUser(res.data.data)
						}
					})
					.catch((err) => {})
			})
			.catch(() => {
				setUser(null)
				setIsLoggedIn(false)
			})
	}

	useEffect(() => {
		refreshAuth()
	}, [])

	const login = (status: string, userData?: User) => {
		setIsLoggedIn(true)

		if (userData) {
			setUser(userData)
			localStorage.setItem('UserData', JSON.stringify(userData))
		}
	}

	const logout = async () => {
		try {
			// 서버에 로그아웃 요청 (withCredentials로 쿠키 포함)
			await api.post('/social/user/logout', {}, { withCredentials: true })
		} catch (err) {
			console.error('서버 로그아웃 실패:', err)
			// 서버 로그아웃이 실패해도 클라이언트 측에서는 로그아웃 처리
			// 네트워크 오류나 서버 문제로 인한 실패는 무시하고 로컬 정리 진행
		} finally {
			// 로컬 상태 및 저장값 정리 (서버 응답과 무관하게 실행)
			localStorage.removeItem('LoginStatus')
			localStorage.removeItem('UserData')
			localStorage.removeItem('accessToken')

			// 쿠키 삭제 (여러 방법으로 확실하게 삭제)
			document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
			document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';'
			document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname + ';'

			// 상태 업데이트
			setIsLoggedIn(false)
			setUser(null)
		}
	}

	return <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser, refreshAuth }}>{children}</AuthContext.Provider>
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

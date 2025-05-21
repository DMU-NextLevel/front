import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { HeaderMain, HeaderSub } from './components/layout/Header'
import Footer from './components/layout/Footer'
import IDFindPage from './pages/IDFindPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import A from './pages/a';
import MyPage from './pages/MyPage';
import MainPage from './pages/MainPage'
import FundingPage from './pages/FundingPage'
import Search from './pages/Search';
import { AuthProvider } from './hooks/AuthContext'
import ScrollToTop from './hooks/ScrollToTop';
import SocialLogin from './pages/SocialLogin';

function App() {
	return (
		<Router>
			<ScrollToTop />
			<AppWrapper />
		</Router>
	)
}

const AppWrapper = () => {
	const [loginType, setLoginType] = useState<string>('')
	const location = useLocation()
	const hideLayout = ['/login', '/signup', '/kakao/callback', '/naver/callback', '/google/callback']
	const mainPage = ['/']
	return (
		<AuthProvider>
			{!hideLayout.includes(location.pathname) ? mainPage.includes(location.pathname) ? <HeaderMain /> : <HeaderSub /> : null}
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/login' element={<Login setLoginType={setLoginType} />}  />
				<Route path='/signup' element={<Signup />} />
				<Route path='/idfind' element={<IDFindPage />} />
				<Route path='/mypage' element={<MyPage />} />
				<Route path='/funding' element={<FundingPage />} />
				<Route path='/search' element={<Search />} />
				<Route path={`/${loginType}/callback/`} element={<SocialLogin loginType={loginType}/>} />
			</Routes>
			{!hideLayout.includes(location.pathname) && <Footer />}
		</AuthProvider>
	)
}

export default App;

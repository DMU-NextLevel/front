import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { HeaderMain, HeaderSub } from './components/layout/Header'
import Footer from './components/layout/Footer'
import IDFindPage from './pages/IDFindPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MyPage from './pages/MyPage'
import MainPage from './pages/MainPage'
import FundingPage from './pages/FundingPage'
import Search from './pages/Search'
import ProjectCreatePage from './pages/ProjectCreatePage'
import ProjectInfoPage from './pages/ProjectInfoPage'
import ProjectMediaPage from './pages/ProjectMediaPage'
import ProjectIntroductionPage from './pages/ProjectIntroductionPage'
import { AuthProvider } from './hooks/AuthContext'
import ScrollToTop from './hooks/ScrollToTop'
import NoticeBoard from './pages/NoticeBoard'
import NoticeDetail from './pages/NoticeDetail'
import NoticeWrite from './pages/NoticeWrite'
import NoticeEdit from './pages/NoticeEdit'
import ProfileHeader from './pages/ProfileHeader'
import Creater from './pages/Creater'
import { PopupPaymentPage } from './components/UI/TossPayments'
import { SuccessPage } from './components/UI/TossPayments'
import { FailPage } from './components/UI/TossPayments'
import SocialLogin from './pages/SocialLogin'

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
	const hideLayout = ['/login', '/signup', '/popup-payment', '/popup-payment-success', '/kakao/callback', '/naver/callback', '/google/callback']
	const mainPage = ['/']
	return (
		<AuthProvider>
			{!hideLayout.includes(location.pathname) ? mainPage.includes(location.pathname) ? <HeaderMain /> : <HeaderSub /> : null}
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/login' element={<Login setLoginType={setLoginType} />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/idfind' element={<IDFindPage />} />
				<Route path='/mypage' element={<MyPage />} />
				<Route path='/project/:no' element={<FundingPage />} />
				<Route path='/search' element={<Search />} />
				<Route path='/project/create' element={<ProjectCreatePage />} />
				<Route path='/project/info' element={<ProjectInfoPage />} />
				<Route path='/project/introduction' element={<ProjectIntroductionPage />} />
				<Route path='/project/media' element={<ProjectMediaPage />} />
				<Route path='/creater' element={<Creater />} />
				<Route path='/popup-payment' element={<PopupPaymentPage />} />
				<Route path='/popup-payment-success' element={<SuccessPage />} />
				<Route path='/fail' element={<FailPage />} />
				<Route path='/notice' element={<NoticeBoard />} />
				<Route path='/notice/:id' element={<NoticeDetail />} />
				<Route path='/notice/write' element={<NoticeWrite />} />
				<Route path='/notice/edit/:id' element={<NoticeEdit />} />
				<Route path='/profile' element={<ProfileHeader />} />
				<Route path={`/google/callback`} element={<SocialLogin loginType={'google'} />} />
				<Route path={`/kakao/callback`} element={<SocialLogin loginType={'kakao'} />} />
				<Route path={`/naver/callback`} element={<SocialLogin loginType={'naver'} />} />
			</Routes>
			{!hideLayout.includes(location.pathname) && <Footer />}
		</AuthProvider>
	)
}

export default App

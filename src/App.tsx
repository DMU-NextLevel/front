import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { HeaderMain } from './components/layout/Header'
import Footer from './components/layout/Footer'
import IDFindPage from './pages/IDFindPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MyPage from './pages/MyPage/MyPage'
import MainPage from './pages/MainPage'
import FundingPage from './pages/FundingPage'
import Search from './pages/Search'
import ProjectCreatePage from './pages/ProjectCreatePage'
import ProjectInfoPage from './pages/ProjectInfoPage'
import ProjectMediaPage from './pages/ProjectMediaPage'
import ProjectIntroductionPage from './pages/ProjectIntroductionPage'
import { AuthProvider } from './hooks/AuthContext'
import ScrollToTop from './hooks/ScrollToTop'
import NoticeWrite from './pages/NoticeWrite'
import NoticeEdit from './pages/NoticeEdit'
import ProfileHeader from './pages/ProfileHeader'
import Creater from './pages/Creater'
import { PopupPaymentPage } from './components/UI/TossPayments'
import { SuccessPage } from './components/UI/TossPayments'
import { FailPage } from './components/UI/TossPayments'
import SocialLogin from './pages/SocialLogin'
import SupportNotice from './pages/Support/SupportNotice'
import SupportFAQ from './pages/Support/SupportFAQ'
import SupportInquiry from './pages/Support/SupportInquiry'
import SupportNoticeDetail from './pages/Support/SupportNoticeDetail'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminPage from './pages/Admin/AdminPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminProjects from './pages/Admin/AdminProjects'
import AdminNotices from './pages/Admin/AdminNotices'
import SocialPage from './pages/SocialPage'

// AOS 초기화
declare global {
	interface Window {
		AOS: any
	}
}

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
	const hideLayout = ['/login', '/signup', '/popup-payment', '/popup-payment-success', '/kakao/callback', '/naver/callback', '/google/callback', '/creater', '/admin']

	// AOS 초기화
	useEffect(() => {
		if (window.AOS) {
			window.AOS.init({
				duration: 800,
				easing: 'ease-out-cubic',
				once: false,  // 매번 실행되도록 변경
				offset: 50,
				disable: false, // 모든 디바이스에서 활성화
				startEvent: 'DOMContentLoaded',
				useClassNames: false,
				disableMutationObserver: false,
				debounceDelay: 50,
				throttleDelay: 99
			})
		}
	}, [])

	// 라우트 변경시마다 AOS 새로고침 - 더 강력한 방법
	useEffect(() => {
		const timer = setTimeout(() => {
			if (window.AOS) {
				window.AOS.refreshHard(); // 완전 재초기화
				setTimeout(() => {
					window.AOS.refresh(); // 한번 더 refresh
				}, 100);
			}
		}, 50);

		return () => clearTimeout(timer);
}, [location.pathname])

const pattern = ['/admin', '/social']

const shouldHideLayout = hideLayout.includes(location.pathname) || pattern.some((pattern) => location.pathname.startsWith(pattern))

return (
	<AuthProvider>
		{!shouldHideLayout && <HeaderMain />}
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
				<Route path='/notice/write' element={<NoticeWrite />} />
				<Route path='/notice/edit/:id' element={<NoticeEdit />} />
				<Route path='/profile' element={<ProfileHeader />} />
				<Route path={`/google/callback`} element={<SocialLogin loginType={'google'} />} />
				<Route path={`/kakao/callback`} element={<SocialLogin loginType={'kakao'} />} />
				<Route path={`/naver/callback`} element={<SocialLogin loginType={'naver'} />} />
				<Route path='/support/notice' element={<SupportNotice />} />
				<Route path='/support/notice/:id' element={<SupportNoticeDetail />} />
				<Route path='/support/faq' element={<SupportFAQ />} />
				<Route path='/support/inquiry' element={<SupportInquiry />} />
				<Route path='/admin' element={<AdminLayout />}>
				<Route index element={<AdminPage />} />
					<Route path='dashboard' element={<AdminDashboard />} />
					<Route path='users' element={<AdminUsers />} />
					<Route path='projects' element={<AdminProjects />} />
					<Route path='notices' element={<AdminNotices />} />
				</Route>
				<Route path='/social/:id' element={<SocialPage />} />
			</Routes>
			{!shouldHideLayout && <Footer />}
		</AuthProvider>
	)
}

export default App

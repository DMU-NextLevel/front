import React from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { HeaderMain, HeaderSub } from './components/layout/Header'
import Footer from './components/layout/Footer'
import IDFindPage from './pages/IDFindPage';
import Signup from './pages/Signup';
import Login from './pages/Login'
import MyPage from './pages/MyPage';
import MainPage from './pages/MainPage'
import FundingPage from './pages/FundingPage'
import Search from './pages/Search';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ProjectInfoPage from './pages/ProjectInfoPage';
import ProjectMediaPage from './pages/ProjectMediaPage';
import ProjectIntroductionPage from './pages/ProjectIntroductionPage';
import { AuthProvider } from './hooks/AuthContext'
import ScrollToTop from './hooks/ScrollToTop';
import Creater from './pages/Creater';
import { FailPage, PopupPaymentPage, SuccessPage } from './components/UI/TossPayments'

function App() {
	return (
		<Router>
			<ScrollToTop />
			<AppWrapper />
		</Router>
	)
}

const AppWrapper = () => {
	const location = useLocation()
	const hideLayout = ['/login', '/signup','/popup-payment', '/popup-payment-success']
	const mainPage = ['/']
	return (
		<AuthProvider>
			{!hideLayout.includes(location.pathname) ? mainPage.includes(location.pathname) ? <HeaderMain /> : <HeaderSub /> : null}
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />
				<Route path='/idfind' element={<IDFindPage />} />
				<Route path='/mypage' element={<MyPage />} />
				<Route path='/funding/:no' element={<FundingPage />} />
				<Route path='/search' element={<Search />} />
				<Route path='/project/create' element={<ProjectCreatePage />} />
				<Route path='/projectinfo' element={<ProjectInfoPage />} />
				<Route path='/project/introduction' element={<ProjectIntroductionPage />} />
				<Route path='/project/media' element={<ProjectMediaPage />} />
				<Route path='/creater' element={<Creater />} />
				<Route path='/popup-payment' element={<PopupPaymentPage />} />
				<Route path='/popup-payment-success' element={<SuccessPage />} />
				<Route path='/fail' element={<FailPage />} />
			</Routes>
			{!hideLayout.includes(location.pathname) && <Footer />}
		</AuthProvider>
	)
}

export default App;

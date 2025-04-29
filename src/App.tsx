import React from 'react'
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
import { AuthProvider } from './hooks/AuthContext'

function App() {
	return (
		<Router>
			<AppWrapper />
		</Router>
	)
}

const AppWrapper = () => {
	const location = useLocation()
	const hideLayout = ['/login', '/signup']
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
				<Route path='/funding' element={<FundingPage />} />
			</Routes>
			{!hideLayout.includes(location.pathname) && <Footer />}
		</AuthProvider>
	)
}

export default App;

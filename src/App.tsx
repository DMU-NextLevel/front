import React from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import MainPage from './pages/MainPage'
import { HeaderMain, HeaderSub } from './components/layout/Header'
import Footer from './components/layout/Footer'

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
		<>
			{!hideLayout.includes(location.pathname) ? mainPage.includes(location.pathname) ? <HeaderMain /> : <HeaderSub /> : null}
			<Routes>
				<Route path='/' element={<MainPage />} />
			</Routes>
			{!hideLayout.includes(location.pathname) && <Footer />}
		</>
	)
}

export default App

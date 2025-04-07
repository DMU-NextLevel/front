import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import { HeaderMain, HeaderSub } from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {
	return (
		<Router>
			<HeaderMain />
			<Routes>
				<Route path='/' element={<MainPage />} />
			</Routes>
			<Footer />
		</Router>
	)
}

export default App

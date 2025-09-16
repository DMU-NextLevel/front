import React, { useState } from 'react'

const FollowProjectBanner = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	const handleLogin = () => {
		setIsLoggedIn(true)
	}

	return (
		<div className='mt-10 mx-auto text-left bg-gradient-to-r from-purple-400 to-blue-400 bg-cover bg-center'>
			<div className='flex flex-col items-center'>
				<h2
					className='text-3xl font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 py-3 px-6 rounded-xl mb-4 cursor-pointer select-none transition-opacity duration-300 hover:opacity-85'
					onClick={handleLogin}>
					{isLoggedIn ? '팔로워 / 위더 프로젝트 보기' : 'WithU 로그인 후 보기'}
				</h2>
			</div>
		</div>
	)
}

export default FollowProjectBanner

import React, { useState } from 'react'

const ProfileHeader: React.FC = () => {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<header className='w-full h-15 bg-gray-50 flex justify-end items-center px-10 relative'>
			<div className='relative inline-block' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
				<img src='https://placehold.co/100x100?text=User' alt='사용자 프로필' className='w-9 h-9 rounded-full cursor-pointer' />
				<div
					className={`absolute top-12 right-0 w-70 bg-white rounded-lg shadow-lg p-5 z-[100] transition-all duration-300 ease ${
						isHovered ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2.5 pointer-events-none'
					}`}>
					<div className='bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg rounded-b-none py-5 text-center text-white'>
						<i className='fas fa-volume-up text-lg float-right' />
						<img src='https://placehold.co/100x100?text=User' alt='프로필' className='w-15 h-15 rounded-full mt-2.5' />
						<div className='font-bold text-lg mt-2.5'>위하고 사원</div>
					</div>
					<div className='text-sm text-gray-700 mt-2.5'>wehago@wehago.net</div>
					<div className='text-xs text-gray-500 mb-4'>더존비즈온 &gt; DBP본부</div>
					<div className='flex justify-around mt-3'>
						<div className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
							<i className='fas fa-user text-lg mb-1'></i>
							개인설정
						</div>
						<div className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
							<i className='fas fa-th text-lg mb-1'></i>
							위젯설정
						</div>
						<div className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
							<i className='fas fa-building text-lg mb-1'></i>
							회사설정
						</div>
						<div className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
							<i className='fas fa-cog text-lg mb-1'></i>
							배경설정
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default ProfileHeader

import React, { useState, useRef, useEffect } from 'react'
import LogoImage from '../../assets/images/withuLogo.png'
import CategoryImage from '../../assets/images/category.png'
import UserImage from '../../assets/images/default_profile.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/AuthContext'
import { useUserRole } from '../../hooks/useUserRole'

// 링크 설정 객체
const searchLinks = {
	RECOMMEND: '/search?order=RECOMMEND',
	NEW: '/search?order=NEW',
	EXPIRED: '/search?order=EXPIRED',
	COMPLETED: '/search?order=COMPLETED',
}

// 링크 생성 함수
const createSearchLink = (type: keyof typeof searchLinks) => {
	return searchLinks[type]
}

const categories = [
	{ label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
	{ label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
	{ label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
	{ label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
	{ label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
	{ label: '게임', icon: 'bi bi-controller', tag: '6' },
	{ label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
	{ label: '반려동물', icon: 'bi bi-star', tag: '8' },
	{ label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
	{ label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
]

export const HeaderMain: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const [menuHeight, setMenuHeight] = useState(0)
	const [showNotification, setShowNotification] = useState(false)
	const [keyword, setKeyword] = useState('')
	const [isHovered, setIsHovered] = useState(false)
	const navigate = useNavigate()
	const { isLoggedIn, logout, user } = useAuth()
	const { role, loading } = useUserRole()
	const headerRef = useRef<HTMLDivElement>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const notificationRef = useRef<HTMLDivElement>(null)

	// 검색 제출 핸들러
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (keyword.trim()) {
			window.location.href = `/search?search=${encodeURIComponent(keyword.trim())}`
		}
	}

	// 로그아웃 핸들러
	const handleLogout = () => {
		logout()
		window.location.href = '/login'
	}

	// 알림 토글
	const toggleNotification = () => {
		setShowNotification((prev) => !prev)
	}

	// 애플 스타일 호버 핸들러
	const handleMenuEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		setIsMenuOpen(true)
	}

	const handleMenuLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsMenuOpen(false)
		}, 100)
	}

	const handleMegaMenuEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
	}

	const handleMegaMenuLeave = () => {
		setIsMenuOpen(false)
	}

	// 헤더 높이 계산
	useEffect(() => {
		if (headerRef.current) {
			const height = headerRef.current.offsetHeight
			setMenuHeight(height)
		}
	}, [])

	// Apple 스타일 스크롤 처리 - 스크롤 시 메뉴 즉시 닫기
	useEffect(() => {
		const handleScroll = () => {
			if (isMenuOpen) {
				setIsMenuOpen(false)
				if (timeoutRef.current) clearTimeout(timeoutRef.current)
			}
			if (isMobileMenuOpen) {
				setIsMobileMenuOpen(false)
			}
		}

		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [isMenuOpen, isMobileMenuOpen])

	// 알림 외부 클릭 처리
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
				setShowNotification(false)
			}
		}

		if (showNotification) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showNotification])

	return (
		<div className='relative'>
			{/* 헤더 */}
			<header 
				ref={headerRef}
				className='w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 fixed top-0 left-0 right-0 z-50'
			>
				<div className='px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]'>
					<div className='flex items-center h-14'>
						{/* 왼쪽: 로고 */}
						<img 
							src={LogoImage} 
							alt='logo' 
							onClick={() => navigate('/')}
							className='w-[120px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity' 
						/>

						{/* 데스크톱: 네비게이션 메뉴 - 로고 바로 옆에 */}
						<nav className='hidden lg:flex items-center ml-8 space-x-8'>
							{/* 메뉴 버튼 */}
							<div
								className='relative group'
								onMouseEnter={handleMenuEnter}
								onMouseLeave={handleMenuLeave}
							>
								<div className='flex items-center space-x-1 text-gray-900 hover:text-gray-600 transition-colors cursor-pointer py-2'>
									<img src={CategoryImage} alt='' className='w-4 h-4' />
									<span className='text-sm font-medium'>메뉴</span>
								</div>
							</div>

							{/* 다른 메뉴 아이템들 */}
							<a href={createSearchLink('RECOMMEND')} className='text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors'>
								인기
							</a>
							<a href={createSearchLink('NEW')} className='text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors'>
								신규
							</a>
							<a href={createSearchLink('EXPIRED')} className='text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors'>
								마감임박
							</a>
							
						
						{/* 프로젝트 시작 버튼 - 마감임박 우측에 배치 */}
						<button
							onClick={() => navigate('/creater')}
							className='bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors'
						>
							프로젝트 시작
						</button>
					</nav>						{/* 오른쪽 영역 */}
						<div className='ml-auto flex items-center space-x-4'>
							{/* 검색창 - 데스크톱에서만 표시 */}
							<form
								onSubmit={handleSubmit}
								className='hidden lg:flex w-[200px] xl:w-[250px] h-10 bg-white/80 items-center rounded-[50px] border border-gray-300/50 px-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:border-gray-400/50 focus-within:border-blue-400/50'>
								<input
									type='text'
									placeholder='검색어를 입력하세요'
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									className='bg-transparent border-none h-[35px] w-[90%] text-[15px] text-gray-800 pl-2 transition-colors duration-300 focus:outline-none placeholder:text-gray-500'
								/>
								<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent transition-all duration-300 hover:scale-110'>
									<i className='bi bi-search'></i>
								</button>
							</form>

							{/* 데스크톱: 사용자 버튼들 */}
							<div className='hidden lg:flex items-center space-x-4'>
						{!isLoggedIn ? (
							<>
								<button
									onClick={() => navigate('/login')}
									className='text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors'
								>
									로그인
								</button>
								<button
									onClick={() => navigate('/signup')}
									className='bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-colors'
								>
									회원가입
								</button>
							</>
						) : (
							<>
								{/* 알림 */}
								<div className='relative'>
									<div onClick={toggleNotification}>
										<i
											className={`text-xl text-gray-600 transition-all duration-300 cursor-pointer hover:text-gray-800 hover:scale-110 ${
												showNotification ? 'bi bi-bell-fill' : 'bi bi-bell'
											}`}></i>
									</div>
									{showNotification && (
										<div ref={notificationRef} className='absolute top-full right-0 mt-2 w-[250px] h-[300px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-5 z-[100]'>
											<div className='text-center text-gray-500 mt-20'>새 알림이 없습니다</div>
										</div>
									)}
								</div>

								{/* 프로필 */}
								<div className='relative inline-block' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
									<img
										src={user?.img || UserImage}
										alt='profile'
										onClick={() => navigate('/mypage')}
										className='w-8 h-8 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 border-2 border-gray-200'
									/>
									<div
										className={`absolute top-[35px] right-0 w-[280px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-5 z-[100] transition-all duration-[0.25s] ${
											isHovered ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2.5 pointer-events-none'
										}`}>
										<div className='bg-gradient-to-r from-[#5e60ce] to-[#4361ee] rounded-xl p-5 text-center text-white'>
											<img src={user?.img || UserImage} alt='프로필' className='w-[60px] h-[60px] rounded-full mx-auto mb-3 border-2 border-white/20' />
											<div className='font-bold text-[17px]'>{user?.nickName || '익명'}</div>
										</div>
										<div className='text-sm text-gray-700 mt-3 px-2'>{user?.email}</div>
										<div className='text-[13px] text-gray-500 mb-4 px-2'>{role == 'ADMIN' ? '관리자' : '일반 사용자'}</div>
										<div className='flex justify-around mt-4 pt-3 border-t border-gray-100'>
											<div onClick={() => navigate('/mypage')} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors'>
												<i className='bi bi-person text-lg mb-1'></i>
												마이페이지
											</div>
											<div onClick={handleLogout} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors'>
												<i className='bi bi-box-arrow-right text-lg mb-1'></i>
												로그아웃
											</div>
											<div onClick={() => navigate('/mypage')} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors'>
												<i className='bi bi-gear text-lg mb-1'></i>
												내정보 변경
											</div>
										</div>
									</div>
								</div>
							</>
						)}
							</div>

							{/* 모바일: 햄버거 메뉴 버튼 */}
							<button 
								className='lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors'
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								<i className={`text-xl ${isMobileMenuOpen ? 'bi bi-x' : 'bi bi-list'}`}></i>
							</button>
						</div>
					</div>
				</div>
			</header>
			
			{/* 헤더 높이만큼 여백 추가 */}
			<div className='h-14'></div>

			{/* 모바일 메뉴 */}
			<div className={`lg:hidden fixed left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-40 ${
				isMobileMenuOpen 
					? 'opacity-100 visible transform translate-y-0 transition-all duration-200 ease-out' 
					: 'opacity-0 invisible transform -translate-y-2 transition-all duration-150 ease-in pointer-events-none'
			}`}
			style={{ top: '56px', maxHeight: 'calc(100vh - 56px)' }}>
				<div className='px-4 py-4 overflow-y-auto max-h-[calc(100vh-112px)]'>
					{/* 검색창 */}
					<form onSubmit={handleSubmit} className='flex w-full h-10 bg-white/80 items-center rounded-[50px] border border-gray-300/50 px-3 backdrop-blur-sm mb-6'>
						<input
							type='text'
							placeholder='검색어를 입력하세요'
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							className='bg-transparent border-none h-[35px] w-[90%] text-[15px] text-gray-800 pl-2 focus:outline-none placeholder:text-gray-500'
						/>
						<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent'>
							<i className='bi bi-search'></i>
						</button>
					</form>

					{/* 메뉴 링크들 */}
					<div className='space-y-4'>
						{/* 빠른 실행 */}
						<div>
							<h4 className='text-sm font-semibold text-gray-900 mb-3'>빠른 실행</h4>
							<div className='space-y-2'>
								<button
									onClick={() => {
										navigate('/creater')
										setIsMobileMenuOpen(false)
									}}
									className='flex items-center space-x-3 w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
								>
									<i className='bi bi-plus-circle text-blue-600 text-lg'></i>
									<span className='text-sm font-medium text-gray-900'>프로젝트 시작</span>
								</button>
								<button 
									onClick={() => setIsMobileMenuOpen(false)}
									className='flex items-center space-x-3 w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors'
								>
									<i className='bi bi-bookmark text-blue-600 text-lg'></i>
									<span className='text-sm font-medium text-gray-900'>팔로우 프로젝트</span>
								</button>
							</div>
						</div>

						{/* 프로젝트 메뉴 */}
						<div>
							<h4 className='text-sm font-semibold text-gray-900 mb-3'>프로젝트</h4>
							<div className='space-y-2'>
								<a 
									href={createSearchLink('RECOMMEND')} 
									className='block text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									인기 프로젝트
								</a>
								<a 
									href={createSearchLink('NEW')} 
									className='block text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									신규 프로젝트
								</a>
								<a 
									href={createSearchLink('EXPIRED')} 
									className='block text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									마감 임박 프로젝트
								</a>
								<a 
									href={createSearchLink('COMPLETED')} 
									className='block text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
									onClick={() => setIsMobileMenuOpen(false)}
								>
									완료된 프로젝트
								</a>
							</div>
						</div>

						{/* 카테고리 */}
						<div>
							<h4 className='text-sm font-semibold text-gray-900 mb-3'>카테고리</h4>
							<div className='grid grid-cols-2 gap-2'>
								{categories.map((cat) => (
									<button
										key={cat.tag}
										onClick={() => {
											navigate(`/search?tag=${cat.tag}`)
											setIsMobileMenuOpen(false)
										}}
										className='flex items-center space-x-2 text-left py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors'
									>
										<i className={`${cat.icon} text-sm text-blue-600`}></i>
										<span className='text-sm text-gray-700'>{cat.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* 도구 & 서비스 */}
						<div>
							<h4 className='text-sm font-semibold text-gray-900 mb-3'>도구 & 서비스</h4>
							<div className='space-y-2'>
								<button 
									onClick={() => {
										navigate('/support/notice')
										setIsMobileMenuOpen(false)
									}}
									className='block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
								>
									공지사항
								</button>
								<button 
									onClick={() => {
										navigate('/support/faq')
										setIsMobileMenuOpen(false)
									}}
									className='block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
								>
									FAQ
								</button>
								{isLoggedIn && (
									<button 
										onClick={() => {
											navigate('/mypage')
											setIsMobileMenuOpen(false)
										}}
										className='block w-full text-left text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50'
									>
										마이페이지
									</button>
								)}
							</div>
						</div>
					</div>

					{/* 사용자 버튼들 - 하단 고정 */}
					<div className='sticky bottom-0 bg-white/95 backdrop-blur-xl pt-4 border-t border-gray-200/50 mt-6'>
						{!isLoggedIn ? (
							<div className='space-y-2'>
								<button
									onClick={() => {
										navigate('/login')
										setIsMobileMenuOpen(false)
									}}
									className='w-full text-center py-3 text-gray-900 hover:text-gray-600 transition-colors border border-gray-300 rounded-lg'
								>
									로그인
								</button>
								<button
									onClick={() => {
										navigate('/signup')
										setIsMobileMenuOpen(false)
									}}
									className='w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors'
								>
									회원가입
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-4 p-3 bg-gray-50 rounded-lg'>
								<img
									src={user?.img || UserImage}
									alt='profile'
									onClick={() => {
										navigate('/mypage')
										setIsMobileMenuOpen(false)
									}}
									className='w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-200'
								/>
								<div className='flex-1'>
									<div className='font-medium text-gray-900'>{user?.nickName || '익명'}</div>
									<div className='text-sm text-gray-500'>{role == 'ADMIN' ? '관리자' : '일반 사용자'}</div>
								</div>
								<button 
									onClick={() => {
										handleLogout()
										setIsMobileMenuOpen(false)
									}} 
									className='text-gray-500 hover:text-gray-700 transition-colors p-2'
								>
									<i className='bi bi-box-arrow-right text-lg'></i>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 모바일 메뉴 배경 오버레이 */}
			<div 
				className={`lg:hidden fixed inset-0 bg-black/20 z-30 ${
					isMobileMenuOpen 
						? 'opacity-100 visible transition-opacity duration-200 ease-out' 
						: 'opacity-0 invisible transition-opacity duration-150 ease-in'
				}`}
				onClick={() => setIsMobileMenuOpen(false)}
			/>

			{/* 애플 스타일 메가 메뉴 */}
			<div
				className={`fixed left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-40 ${
					isMenuOpen 
						? 'opacity-100 visible transform translate-y-0 transition-all duration-200 ease-out' 
						: 'opacity-0 invisible transform -translate-y-1 transition-all duration-150 ease-in pointer-events-none'
				}`}
				style={{ top: menuHeight }}
				onMouseEnter={handleMegaMenuEnter}
				onMouseLeave={handleMegaMenuLeave}
			>
				<div className='px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-8'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
						{/* 빠른 실행 */}
						<div>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4'>
								빠른 실행
							</h3>
							<div className='space-y-3'>
								<button
									onClick={() => navigate('/creater')}
									className='flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors'
								>
									<i className='bi bi-plus-circle text-blue-600 text-lg'></i>
									<span className='text-sm font-medium text-gray-900'>프로젝트 시작</span>
								</button>
								<button className='flex items-center space-x-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors'>
									<i className='bi bi-bookmark text-blue-600 text-lg'></i>
									<span className='text-sm font-medium text-gray-900'>팔로우 프로젝트</span>
								</button>
							</div>
						</div>

						{/* 카테고리 */}
						<div>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4'>
								카테고리
							</h3>
							<div className='space-y-1'>
								{categories.slice(0, 10).map((cat) => (
									<button
										key={cat.tag}
										onClick={() => navigate(`/search?tag=${cat.tag}`)}
										className='flex items-center space-x-2 w-full text-left py-0.5 hover:text-blue-600 transition-colors'
									>
										<i className={`${cat.icon} text-xs`}></i>
										<span className='text-xs'>{cat.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* 프로젝트 */}
						<div>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4'>
								프로젝트
							</h3>
							<div className='space-y-1'>
								<a href={createSearchLink('RECOMMEND')} className='block text-xs text-gray-700 hover:text-purple-600 transition-colors py-0.5'>
									인기 프로젝트 보기
								</a>
								<a href={createSearchLink('RECOMMEND')} className='block text-xs text-gray-700 hover:text-purple-600 transition-colors py-0.5'>
									추천 프로젝트
								</a>
								<a href={createSearchLink('NEW')} className='block text-xs text-gray-700 hover:text-purple-600 transition-colors py-0.5'>
									신규 프로젝트
								</a>
								<a href={createSearchLink('EXPIRED')} className='block text-xs text-gray-700 hover:text-purple-600 transition-colors py-0.5'>
									마감 임박 프로젝트
								</a>
								<a href={createSearchLink('COMPLETED')} className='block text-xs text-gray-700 hover:text-purple-600 transition-colors py-0.5'>
									완료된 프로젝트
								</a>
							</div>
						</div>

						{/* 도구 */}
						<div>
							<h3 className='text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4'>
								도구 & 서비스
							</h3>
							<div className='space-y-1'>
								<button 
									onClick={() => navigate('/support/notice')}
									className='block text-xs hover:text-blue-600 transition-colors py-0.5'
								>
									공지사항
								</button>
								<button 
									onClick={() => navigate('/support/faq')}
									className='block text-xs hover:text-blue-600 transition-colors py-0.5'
								>
									FAQ
								</button>
								<button 
									onClick={() => navigate('/mypage')}
									className='block text-xs hover:text-blue-600 transition-colors py-0.5'
								>
									마이페이지
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Apple 스타일 배경 오버레이 */}
			<div 
				className={`fixed inset-0 bg-black/5 z-30 ${
					isMenuOpen 
						? 'opacity-100 visible transition-opacity duration-200 ease-out' 
						: 'opacity-0 invisible transition-opacity duration-150 ease-in'
				}`}
				onClick={() => setIsMenuOpen(false)}
			/>
		</div>
	)
}
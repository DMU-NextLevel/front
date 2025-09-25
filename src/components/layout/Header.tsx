import React, { useEffect, useRef, useState } from 'react'
import LogoImage from '../../assets/images/withuLogo.png'
import CategoryImage from '../../assets/images/category.png'
import UserImage from '../../assets/images/default_profile.png'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/AuthContext'
import { useUserRole } from '../../hooks/useUserRole'

interface HeaderBaseProps {
	isLoggedIn: boolean
	showCategoryMenu?: boolean
	onLogoClick?: () => void
	onLoginClick?: () => void
	onProfileClick?: () => void
	onProjectCreate?: () => void
	onCategoryClick?: () => void
	showSearchBar?: boolean
	showNotification?: boolean
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

export const HeaderMain: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { isLoggedIn, logout, user } = useAuth()
	const [showNotification, setShowNotification] = useState<boolean>(false)
	const notificationRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const anchorRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()
	const [keyword, setKeyword] = useState('')
	const { role, loading } = useUserRole()
	const [isHovered, setIsHovered] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const [menuTop, setMenuTop] = useState<number>(0)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (keyword.trim()) {
			window.location.href = `/search?search=${encodeURIComponent(keyword.trim())}`
		}
	}

	const handleLogout = () => {
		logout()
		window.location.href = '/login'
	}

	const handleLogoClick = () => {
		navigate('/')
		setIsOpen(false)
	}

	const handleLoginClick = () => {
		navigate('/login')
		setIsOpen(false)
	}
	const handleSignupClick = () => {
		navigate('/signup')
		setIsOpen(false)
	}

	const handleCategoryClick = () => {
		setIsOpen(!isOpen)
	}

	const handleProfileClick = () => {
		navigate('/mypage')
	}

	const toggleNotification = () => {
		setShowNotification((prev) => !prev)
	}

	const handleProjectCreate = () => {
		navigate('/creater')
	}

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

	// Close mega menu on outside click / ESC
	useEffect(() => {
		if (!isOpen) return

		const onMouseDown = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false)
		}

		document.addEventListener('mousedown', onMouseDown)
		window.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onMouseDown)
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [isOpen])

	// Position mega menu just below the header nav row and make it full-width
	useEffect(() => {
		if (!isOpen) return
		const updateTop = () => {
			if (anchorRef.current) {
				const rect = anchorRef.current.getBoundingClientRect()
				setMenuTop(rect.bottom + window.scrollY)
			}
		}
		updateTop()
		window.addEventListener('resize', updateTop)
		window.addEventListener('scroll', updateTop, { passive: true })
		return () => {
			window.removeEventListener('resize', updateTop)
			window.removeEventListener('scroll', updateTop)
		}
	}, [isOpen])

	return (
		<div className='w-full mx-auto max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1440px] px-4 sm:px-6 md:px-8 relative'>
			<div className='flex flex-row items-center mt-4 w-full'>
				<img src={LogoImage} alt='logo' onClick={handleLogoClick} className='w-[150px] h-[35px] transition-all duration-300 cursor-pointer hover:scale-105' />
				{!isLoggedIn ? (
					<div className='hidden md:flex ml-auto items-center gap-0'>
						<div
							onClick={handleLoginClick}
							className="relative text-gray-800 text-base font-medium py-2.5 px-2.5 mx-1 border-b-2 border-transparent transition-all duration-300 cursor-pointer hover:text-purple-500 hover:scale-[1.02] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full">
							로그인
						</div>
						<div
							onClick={handleSignupClick}
							className="relative text-gray-800 text-base font-medium py-2.5 px-2.5 mx-1 border-b-2 border-transparent transition-all duration-300 cursor-pointer hover:text-purple-500 hover:scale-[1.02] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full">
							회원가입
						</div>
					</div>
				) : (
					<div className='hidden md:flex ml-auto items-center gap-[30px]'>
						<div className='relative'>
							<div onClick={toggleNotification}>
								<i
									className={`text-2xl text-gray-600 transition-all duration-300 cursor-pointer hover:text-gray-600 hover:scale-110 ${
										showNotification ? 'bi bi-bell-fill' : 'bi bi-bell'
									}`}></i>
							</div>
							{showNotification && (
								<div ref={notificationRef} className='absolute top-full right-0 mt-2.5 w-[250px] h-[300px] bg-gray-100 rounded-2xl shadow-lg p-5 z-[100]'>
									새 알림이 없습니다
								</div>
							)}
						</div>
						<div className='relative inline-block' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
							<img
								src={UserImage}
								alt='profile'
								onClick={handleProfileClick}
								className='w-[30px] h-[30px] rounded-full transition-all duration-300 cursor-pointer hover:scale-110'
							/>
							<div
								className={`absolute top-[35px] right-0 w-[280px] bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-5 z-[100] transition-all duration-[0.25s] ${
									isHovered ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2.5 pointer-events-none'
								}`}>
								<div className='bg-gradient-to-r from-[#5e60ce] to-[#4361ee] rounded-t-[10px] p-5 text-center text-white'>
									<i className='fas fa-volume-up text-lg float-right' />
									<img src={user?.img || UserImage} alt='프로필' className='w-[60px] h-[60px] rounded-full mt-2.5' />
									<div className='font-bold text-[17px] mt-2.5'>{user?.nickName || '익명'}</div>
								</div>
								<div className='text-sm text-gray-700 mt-2.5'>{user?.email}</div>
								<div className='text-[13px] text-gray-500 mb-4'>{role == 'ADMIN' ? '관리자' : '일반 사용자'}</div>
								<div className='flex justify-around mt-3'>
									<div onClick={handleProfileClick} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
										<i className='fas fa-user text-lg mb-1'></i>
										마이페이지
									</div>
									<div onClick={handleLogout} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
										<i className='fas fa-th text-lg mb-1'></i>
										로그아웃
									</div>
									<div onClick={handleProfileClick} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
										<i className='fas fa-cog text-lg mb-1'></i>
										내정보 변경
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Mobile hamburger */}
				<button
					className='ml-auto md:hidden p-2 rounded-md hover:bg-gray-100'
					onClick={() => setMobileOpen((v) => !v)}
					aria-label='메뉴 열기'>
					<i className={`bi ${mobileOpen ? 'bi-x' : 'bi-list'} text-2xl`}></i>
				</button>
			</div>
			<div ref={anchorRef} className='hidden md:flex text-xl font-bold h-20 items-center'>
				<div
					className='cursor-pointer'
					onClick={handleCategoryClick}
					role='button'
					tabIndex={0}
					aria-expanded={isOpen}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault()
							handleCategoryClick()
						}
					}}
				>
					<div className={`relative px-5 py-2.5 text-lg font-extrabold whitespace-nowrap flex items-center justify-center md:text-sm md:px-1 md:py-2 md:mx-2 ${
						isOpen ? 'text-purple-600' : 'text-gray-800'
					} after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full`}>
						<img src={CategoryImage} alt='' className='w-[18px] h-[18px] pr-[5px]' />
						메뉴
						<i className={`bi bi-chevron-down ml-2 text-base transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
					</div>
				</div>

				<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
					<a href={createSearchLink('RECOMMEND')} className='no-underline text-gray-800'>
						인기
					</a>
				</div>
				<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
					<a href={createSearchLink('NEW')} className='no-underline text-gray-800'>
						신규
					</a>
				</div>
				<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
					<a href={createSearchLink('EXPIRED')} className='no-underline text-gray-800'>
						마감임박
					</a>
				</div>
				<button
					onClick={handleProjectCreate}
					className='bg-purple-500 text-white border-none rounded-lg cursor-pointer text-base w-[150px] h-10 font-bold transition-colors duration-300 justify-between hover:bg-purple-800 md:block hidden'>
					프로젝트 시작하기
				</button>
				

				<form
					onSubmit={handleSubmit}
					className='w-[250px] h-10 bg-white flex items-center rounded-[50px] border border-gray-400 ml-auto px-3 shadow-[inset_0_0_0_2px_transparent] transition-all duration-300 hover:bg-gray-100 hover:shadow-[inset_0_0_0_2px_rgba(166,108,255,0.33)] hover:scale-[1.02] focus-within:shadow-[inset_0_0_0_2px_#a66cff] md:block hidden'>
					<input
						type='text'
						placeholder='검색어를 입력하세요'
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						className='bg-transparent border-none h-[35px] w-[90%] text-[15px] text-gray-800 pl-2 transition-colors duration-300 focus:outline-none focus:text-gray-900 placeholder:text-gray-500 placeholder:transition-opacity placeholder:duration-200'
					/>
					<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent transition-all duration-300 hover:scale-110'>
						<i className='bi bi-search'></i>
					</button>
				</form>
			</div>
			{/* Desktop mega menu (full-width fixed overlay) */}
			{isOpen && (
				<div ref={menuRef} className='fixed left-0 right-0 z-40' style={{ top: menuTop }}>
					<div className='w-screen bg-white/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5 rounded-none md:rounded-none px-6 py-6 md:px-8 md:py-8'>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
							{/* Quick actions */}
							<div>
								<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>빠른 실행</h3>
								<div className='space-y-3'>
									<div className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
										<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
											<i className='bi bi-bookmark-check text-xl'></i>
										</div>
										<div className='text-sm font-medium text-gray-800'>팔로우 프로젝트</div>
									</div>
									<div
										onClick={() => navigate('/creater')}
										className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
										<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
											<i className='bi bi-buildings text-xl'></i>
										</div>
										<div className='text-sm font-medium text-gray-800'>위더 스튜디오</div>
									</div>
									<div className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
										<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
											<i className='bi bi-box2 text-xl'></i>
										</div>
										<div className='text-sm font-medium text-gray-800'>즐겨찾기</div>
									</div>
								</div>
							</div>

							{/* Categories */}
							<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
								<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>카테고리</h3>
								<div className='grid grid-cols-2 gap-y-3 gap-x-6'>
									{categories.map((cat) => (
										<button
											key={cat.tag}
											onClick={() =>
												navigate(`/search?tag=${cat.tag}`, {
													state: cat.tag,
												})
											}
											className='group text-left flex items-center gap-2 text-sm text-gray-800 hover:text-purple-700 transition-colors'
										>
											<i className={`${cat.icon} text-base opacity-80 group-hover:opacity-100`}></i>
											<span>{cat.label}</span>
										</button>
									))}
								</div>
							</div>

							{/* Projects */}
							<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
								<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>프로젝트</h3>
								<div className='space-y-3'>
									<a href={createSearchLink('RECOMMEND')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										인기 프로젝트 보기
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href={createSearchLink('RECOMMEND')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										추천 프로젝트
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href={createSearchLink('NEW')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										신규 프로젝트
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href={createSearchLink('EXPIRED')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										마감 임박 프로젝트
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href={createSearchLink('COMPLETED')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										완료된 프로젝트
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
								</div>
							</div>

							{/* Tools */}
							<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
								<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>도구/서비스</h3>
								<div className='space-y-3'>
									<a href='/notice' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										공지사항
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href='' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										고객센터
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href='/mypage' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										마이페이지
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
									<a href='' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
										정책 & 약관
										<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Backdrop overlay */}
			{isOpen && <div className='fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30' onClick={() => setIsOpen(false)}></div>}

			{/* Mobile menu panel */}
			{mobileOpen && (
				<div className='md:hidden mt-4 border-t border-gray-200 pt-4 space-y-4'>
					<form onSubmit={handleSubmit} className='w-full h-10 bg-white flex items-center rounded-full border border-gray-300 px-3'>
						<input
							type='text'
							placeholder='검색어를 입력하세요'
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							className='bg-transparent border-none h-[35px] w-full text-[15px] text-gray-800 pl-2 focus:outline-none'
						/>
						<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent'>
							<i className='bi bi-search'></i>
						</button>
					</form>
					<div className='flex flex-col gap-3'>
						<a href={createSearchLink('RECOMMEND')} className='text-gray-800'>인기</a>
						<a href={createSearchLink('NEW')} className='text-gray-800'>신규</a>
						<a href={createSearchLink('EXPIRED')} className='text-gray-800'>마감임박</a>
					</div>
					<button onClick={handleProjectCreate} className='w-full bg-purple-500 text-white rounded-md h-10 font-bold'>프로젝트 시작하기</button>
					<br/><br/>	
				</div>
				
			)}
		</div>
	)
}

export const HeaderSub: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { isLoggedIn, logout, user } = useAuth()
	const [showNotification, setShowNotification] = useState<boolean>(false)
	const notificationRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()
	const [isHoveringCategory, setIsHoveringCategory] = useState(false)
	const [keyword, setKeyword] = useState('')
	const [isHovered, setIsHovered] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (keyword.trim()) {
			window.location.href = `/search?search=${encodeURIComponent(keyword.trim())}`
		}
	}

	const handleLogoClick = () => {
		navigate('/')
		setIsOpen(false)
	}

	const handleLogout = () => {
		logout()
		window.location.href = '/login'
	}

	const handleLoginClick = () => {
		navigate('/login')
		setIsOpen(false)
	}
	const handleSignupClick = () => {
		navigate('/signup')
		setIsOpen(false)
	}

	const handleCategoryClick = () => {
		setIsOpen(!isOpen)
	}

	const handleProjectCreate = () => {
		navigate('/project/create')
	}

	const handleProfileClick = () => {
		navigate('/mypage')
	}

	const toggleNotification = () => {
		setShowNotification((prev) => !prev)
	}

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

	// Close mega menu on outside click / ESC
	useEffect(() => {
		if (!isOpen) return
		const onMouseDown = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		document.addEventListener('mousedown', onMouseDown)
		window.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onMouseDown)
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [isOpen])

	return (
		<div>
			<div className='px-4 md:px-[15%] lg:px-[2%] xl:px-[10%] border-b border-gray-300 mb-10 relative'>
				<div className='flex text-xl font-bold h-20 items-center'>
					<img src={LogoImage} alt='logo' onClick={handleLogoClick} className='w-[150px] h-[35px] transition-all duration-300 cursor-pointer hover:scale-105' />
					<div
						className='cursor-pointer hidden md:block'
						onClick={handleCategoryClick}
						role='button'
						tabIndex={0}
						aria-expanded={isOpen}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault()
								handleCategoryClick()
							}
						}}
					>
						<div className={`relative px-5 py-2.5 text-lg font-extrabold whitespace-nowrap flex items-center justify-center md:text-sm md:px-1 md:py-2 md:mx-2 ${
							isOpen ? 'text-purple-600' : 'text-gray-800'
						} after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full`}>
							<img src={CategoryImage} alt='' className='w-[18px] h-[18px] pr-[5px]' />
							메뉴
							<i className={`bi bi-chevron-down ml-2 text-base transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
						</div>
					</div>
					<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer hidden md:flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
						<a href={createSearchLink('RECOMMEND')} className='no-underline text-gray-800'>
							인기
						</a>
					</div>
					<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer hidden md:flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
						<a href={createSearchLink('NEW')} className='no-underline text-gray-800'>
							신규
						</a>
					</div>
					<div className="relative px-5 py-2.5 text-lg font-extrabold text-gray-800 whitespace-nowrap cursor-pointer hidden md:flex items-center justify-center after:content-[''] after:absolute after:-bottom-5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[5px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full md:text-sm md:px-1 md:py-2 md:mx-2">
						<a href={createSearchLink('EXPIRED')} className='no-underline text-gray-800'>
							마감임박
						</a>
					</div>

					<button
						onClick={handleProjectCreate}
						className='bg-purple-500 text-white border-none rounded-lg cursor-pointer text-base w-[150px] h-10 font-bold transition-colors duration-300 justify-between hover:bg-purple-800 hidden md:block md:ml-auto'>
						프로젝트 시작하기
					</button>

					<div className='hidden md:flex items-center gap-4 ml-4 mr-5'>
						<form
							onSubmit={handleSubmit}
							className='w-[250px] h-10 bg-white flex items-center rounded-[50px] border border-gray-400 px-3 shadow-[inset_0_0_0_2px_transparent] transition-all duration-300 hover:bg-gray-100 hover:shadow-[inset_0_0_0_2px_rgba(166,108,255,0.33)] hover:scale-[1.02] focus-within:shadow-[inset_0_0_0_2px_#a66cff]'>
							<input
								type='text'
								placeholder='검색어를 입력하세요'
								value={keyword}
								onChange={(e) => setKeyword(e.target.value)}
								className='bg-transparent border-none h-[35px] w-[90%] text-[15px] text-gray-800 pl-2 transition-colors duration-300 focus:outline-none focus:text-gray-900 placeholder:text-gray-500 placeholder:transition-opacity placeholder:duration-200'
							/>
							<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent transition-all duration-300 hover:scale-110'>
								<i className='bi bi-search'></i>
							</button>
						</form>
						{!isLoggedIn ? (
							<div className='flex ml-auto items-center gap-0'>
								<div
									onClick={handleLoginClick}
									className="relative text-gray-800 text-base font-medium py-2.5 px-2.5 mx-1 border-b-2 border-transparent transition-all duration-300 cursor-pointer hover:text-purple-500 hover:scale-[1.02] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full">
									로그인
								</div>
								<div
									onClick={handleSignupClick}
									className="relative text-gray-800 text-base font-medium py-2.5 px-2.5 mx-1 border-b-2 border-transparent transition-all duration-300 cursor-pointer hover:text-purple-500 hover:scale-[1.02] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-purple-500 after:transition-[width] after:duration-[0.25s] hover:after:w-full">
									회원가입
								</div>
							</div>
						) : (
							<div className='flex ml-auto items-center gap-[30px]'>
								<div className='relative'>
									<div onClick={toggleNotification}>
										<i
											className={`text-2xl text-gray-600 transition-all duration-300 cursor-pointer hover:text-gray-600 hover:scale-110 ${
												showNotification ? 'bi bi-bell-fill' : 'bi bi-bell'
											}`}></i>
									</div>
									{showNotification && (
										<div ref={notificationRef} className='absolute top-full right-0 mt-2.5 w-[250px] h-[300px] bg-gray-100 rounded-2xl shadow-lg p-5 z-[100]'>
											새 알림이 없습니다
										</div>
									)}
								</div>
								<div className='relative inline-block' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
									<img
										src={UserImage}
										alt='profile'
										onClick={handleProfileClick}
										className='w-[30px] h-[30px] rounded-full transition-all duration-300 cursor-pointer hover:scale-110'
									/>
									<div
										className={`absolute top-[35px] right-0 w-[280px] bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-5 z-[100] transition-all duration-[0.25s] ${
											isHovered ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2.5 pointer-events-none'
										}`}>
										<div className='bg-gradient-to-r from-[#5e60ce] to-[#4361ee] rounded-t-[10px] p-5 text-center text-white'>
											<i className='fas fa-volume-up text-lg float-right' />
											<img src={user?.img || UserImage} alt='프로필' className='w-[60px] h-[60px] rounded-full mt-2.5' />
											<div className='font-bold text-[17px] mt-2.5'>{user?.name || '익명'}</div>
										</div>
										<div className='text-sm text-gray-700 mt-2.5'>{user?.email}</div>
										<div className='text-[13px] text-gray-500 mb-4'>{user?.socialProvider || '일반 사용자'}</div>
										<div className='flex justify-around mt-3'>
											<div onClick={handleProfileClick} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
												<i className='fas fa-user text-lg mb-1'></i>
												마이페이지
											</div>
											<div onClick={handleLogout} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
												<i className='fas fa-th text-lg mb-1'></i>
												로그아웃
											</div>
											<div onClick={handleProfileClick} className='flex flex-col items-center text-xs text-gray-600 cursor-pointer hover:text-blue-600'>
												<i className='fas fa-cog text-lg mb-1'></i>
												내정보 변경
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
					<button
						className='ml-auto md:hidden p-2 rounded-md hover:bg-gray-100'
						onClick={() => setMobileOpen((v) => !v)}
						aria-label='메뉴 열기'>
						<i className={`bi ${mobileOpen ? 'bi-x' : 'bi-list'} text-2xl`}></i>
					</button>
				</div>
				{/* Desktop mega menu (absolute overlay) */}
				{isOpen && (
					<div ref={menuRef} className='absolute left-0 right-0 top-full z-40'>
						<div className='w-full bg-white/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5 rounded-2xl px-6 py-6 md:px-8 md:py-8'>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
								{/* Quick actions */}
								<div>
									<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>빠른 실행</h3>
									<div className='space-y-3'>
										<div className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
											<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
												<i className='bi bi-bookmark-check text-xl'></i>
											</div>
											<div className='text-sm font-medium text-gray-800'>팔로우 프로젝트</div>
										</div>
										<div
											onClick={() => navigate('/creater')}
											className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
											<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
												<i className='bi bi-buildings text-xl'></i>
											</div>
											<div className='text-sm font-medium text-gray-800'>위더 스튜디오</div>
										</div>
										<div className='group flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/60 cursor-pointer transition-colors'>
											<div className='shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-white ring-1 ring-gray-200 text-gray-900'>
												<i className='bi bi-box2 text-xl'></i>
											</div>
											<div className='text-sm font-medium text-gray-800'>즐겨찾기</div>
										</div>
									</div>
								</div>

								{/* Categories */}
								<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
									<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>카테고리</h3>
									<div className='grid grid-cols-2 gap-y-3 gap-x-6'>
										{categories.map((cat) => (
											<button
												key={cat.tag}
												onClick={() =>
													navigate(`/search?tag=${cat.tag}`, {
														state: cat.tag,
													})
												}
												className='group text-left flex items-center gap-2 text-sm text-gray-800 hover:text-purple-700 transition-colors'
											>
												<i className={`${cat.icon} text-base opacity-80 group-hover:opacity-100`}></i>
												<span>{cat.label}</span>
											</button>
										))}
									</div>
								</div>

								{/* Projects */}
								<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
									<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>프로젝트</h3>
									<div className='space-y-3'>
										<a href={createSearchLink('RECOMMEND')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											인기 프로젝트 보기
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href={createSearchLink('RECOMMEND')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											추천 프로젝트
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href={createSearchLink('NEW')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											신규 프로젝트
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href={createSearchLink('EXPIRED')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											마감 임박 프로젝트
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href={createSearchLink('COMPLETED')} className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											완료된 프로젝트
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
									</div>
								</div>

								{/* Tools */}
								<div className='sm:border-l sm:border-gray-200 sm:pl-8'>
									<h3 className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4'>도구/서비스</h3>
									<div className='space-y-3'>
										<a href='' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											공지사항
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href='' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											고객센터
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href='/mypage' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											마이페이지
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
										<a href='' className='group block text-sm text-gray-800 hover:text-purple-700 transition-colors'>
											정책 & 약관
											<i className='bi bi-arrow-right-short ml-1 align-[-2px] opacity-0 group-hover:opacity-100 transition-opacity'></i>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Backdrop overlay */}
				{isOpen && <div className='fixed inset-0 bg-black/20 backdrop-blur-[1px] z-30' onClick={() => setIsOpen(false)}></div>}
			</div>

			{/* Mobile menu panel */}
			{mobileOpen && (
				<div className='md:hidden mt-4 border-t border-gray-200 pt-4 space-y-4 px-4'>
					<form onSubmit={handleSubmit} className='w-full h-10 bg-white flex items-center rounded-full border border-gray-300 px-3'>
						<input
							type='text'
							placeholder='검색어를 입력하세요'
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							className='bg-transparent border-none h-[35px] w-full text-[15px] text-gray-800 pl-2 focus:outline-none'
						/>
						<button type='submit' className='w-5 font-bold cursor-pointer border-none bg-transparent'>
							<i className='bi bi-search'></i>
						</button>
					</form>
					<div className='flex flex-col gap-3'>
						<a href={createSearchLink('RECOMMEND')} className='text-gray-800'>인기</a>
						<a href={createSearchLink('NEW')} className='text-gray-800'>신규</a>
						<a href={createSearchLink('EXPIRED')} className='text-gray-800'>마감임박</a>
					</div>
					<button onClick={handleProjectCreate} className='w-full bg-purple-500 text-white rounded-md h-10 font-bold'>프로젝트 시작하기</button>
				</div>
			)}
		</div>
	)
}

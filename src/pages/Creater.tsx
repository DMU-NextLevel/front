import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Award, Smartphone, BookOpen, PieChart, ChevronDown, Monitor, Home, Shirt, Heart, Palette, Gamepad2, PawPrint, Plane, UtensilsCrossed, Edit, BarChart3, Bell, MessageSquare, Users2, Ticket } from 'lucide-react'
import './Creater.css'

// 카테고리 데이터
const CATEGORIES = [
	{ name: '테크/가전', icon: Monitor, desc: '혁신적인 기술 제품', color: 'from-blue-500 to-cyan-500' },
	{ name: '라이프스타일', icon: Home, desc: '일상생활을 풍요롭게', color: 'from-green-500 to-emerald-500' },
	{ name: '패션/잡화', icon: Shirt, desc: '스타일리시한 패션 아이템', color: 'from-purple-500 to-pink-500' },
	{ name: '뷰티/헬스', icon: Heart, desc: '건강과 아름다움을 위해', color: 'from-rose-500 to-pink-500' },
	{ name: '취미/DIY', icon: Palette, desc: '창의적인 취미 활동', color: 'from-orange-500 to-red-500' },
	{ name: '게임', icon: Gamepad2, desc: '게이머들을 위한 프로젝트', color: 'from-indigo-500 to-purple-500' },
	{ name: '교육/키즈', icon: BookOpen, desc: '교육과 어린이 콘텐츠', color: 'from-teal-500 to-green-500' },
	{ name: '반려동물', icon: PawPrint, desc: '반려동물을 위한 제품', color: 'from-amber-500 to-orange-500' },
	{ name: '여행/레저', icon: Plane, desc: '여행과 여가 활동', color: 'from-sky-500 to-blue-500' },
	{ name: '푸드/음료', icon: UtensilsCrossed, desc: '맛있는 음식과 음료', color: 'from-red-500 to-rose-500' }
]

const Creater: React.FC = () => {
	// useRef를 사용하여 리렌더링 간 상태 유지
	const heroScrollProgressRef = useRef(0)
	const animationFrameRef = useRef<number | null>(null)
	const isHeroLockedRef = useRef(false)
	const scrollAccumulatorRef = useRef(0)
	const hasPassedHeroRef = useRef(false) // 히어로 섹션을 통과했는지 추적

	// 스티키 탭 네비게이션 관련 state
	const [currentTab, setCurrentTab] = useState<string>('')
	const [isTabsSticky, setIsTabsSticky] = useState<boolean>(false)
	const [sliderStyle, setSliderStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 })
	const tabsContainerRef = useRef<HTMLDivElement>(null)
	const tabRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})

	useEffect(() => {
		// 히어로 섹션 고정 및 스크롤 제어
		const handleWheel = (e: WheelEvent) => {
			const heroSection = document.querySelector('.hero-section') as HTMLElement
			if (!heroSection) return

			const scrollTop = window.pageYOffset
			const heroTop = heroSection.offsetTop
			const heroHeight = heroSection.offsetHeight
			const heroBottom = heroTop + heroHeight
			
			// 히어로 섹션 아래에 있는지 확인
			if (scrollTop > heroBottom) {
				hasPassedHeroRef.current = true
			}
			
			// 히어로 섹션 위에 있으면 리셋
			if (scrollTop < heroTop) {
				if (heroScrollProgressRef.current > 0) {
					heroScrollProgressRef.current = 0
					scrollAccumulatorRef.current = 0
					const scrollImages = document.querySelectorAll('.scroll-images img')
					scrollImages.forEach((img) => {
						const element = img as HTMLElement
						element.style.transform = 'translateY(0px)'
					})
				}
				hasPassedHeroRef.current = false
				return
			}

			// 히어로 섹션 영역에 있을 때
			if (scrollTop >= heroTop && scrollTop <= heroBottom) {
				// Success에서 위로 올라오는 중이면 일반 스크롤 허용
				if (hasPassedHeroRef.current && e.deltaY < 0) {
					// 최상단에 도달했는지 확인
					if (scrollTop <= heroTop + 10) {
						hasPassedHeroRef.current = false
						// progress를 최대치로 설정 (역방향 애니메이션 준비)
						if (heroScrollProgressRef.current < 2.5) {
							heroScrollProgressRef.current = 2.5
							const scrollImages = document.querySelectorAll('.scroll-images img')
							scrollImages.forEach((img) => {
								const speed = parseFloat((img as HTMLElement).dataset.speed || '1')
								const yPos = 2.5 * 400 * speed
								const element = img as HTMLElement
								element.style.transform = `translateY(${-yPos}px)`
							})
						}
					}
					return // 일반 스크롤 허용
				}

				const progress = heroScrollProgressRef.current

				// 위로 스크롤하고 progress가 0이면 일반 스크롤 허용
				if (e.deltaY < 0 && progress <= 0) {
					return
				}

				// 아래로 스크롤하고 애니메이션이 완료되었으면 일반 스크롤 허용
				if (e.deltaY > 0 && progress >= 2.5) {
					return
				}

				// 애니메이션 진행 중에는 스크롤 막기
				e.preventDefault()

				// 스크롤 누적
				scrollAccumulatorRef.current += e.deltaY

				// 일정 값 이상 누적되면 progress 조정
				const scrollThreshold = 50
				if (Math.abs(scrollAccumulatorRef.current) >= scrollThreshold) {
					const delta = scrollAccumulatorRef.current > 0 ? 0.15 : -0.15
					heroScrollProgressRef.current = Math.max(0, Math.min(2.5, progress + delta))
					scrollAccumulatorRef.current = 0

					// 이미지 애니메이션 적용
					const scrollImages = document.querySelectorAll('.scroll-images img')
					scrollImages.forEach((img) => {
						const speed = parseFloat((img as HTMLElement).dataset.speed || '1')
						const yPos = heroScrollProgressRef.current * 400 * speed
						const element = img as HTMLElement
						element.style.transform = `translateY(${-yPos}px)`
					})

					// 애니메이션 완료 시 히어로 섹션 통과
					if (heroScrollProgressRef.current >= 2.5 && e.deltaY > 0 && !isHeroLockedRef.current) {
						isHeroLockedRef.current = true
						hasPassedHeroRef.current = true
						// 다음 섹션으로 스크롤
						setTimeout(() => {
							window.scrollTo({
								top: heroBottom + 10,
								behavior: 'smooth'
							})
							setTimeout(() => {
								isHeroLockedRef.current = false
							}, 500)
						}, 200)
					}
				}
			}
		}

		// 초기 설정
		document.body.style.overflow = 'auto'
		
		// 이벤트 리스너 추가
		window.addEventListener('wheel', handleWheel, { passive: false })

		// 정리 함수
		return () => {
			window.removeEventListener('wheel', handleWheel)
			// 진행 중인 애니메이션 프레임 취소
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	// 스티키 탭 네비게이션 스크롤 핸들러
	useEffect(() => {
		const handleStickyTabScroll = () => {
			const tabsHeroSection = document.querySelector('.sticky-tabs-hero') as HTMLElement
			if (!tabsHeroSection) return

			const heroRect = tabsHeroSection.getBoundingClientRect()
			const heroBottom = heroRect.bottom
			
			// 히어로 섹션의 하단이 화면 상단에 도달하면 sticky 활성화
			if (heroBottom <= 75) {
				setIsTabsSticky(true)
			} else {
				setIsTabsSticky(false)
			}

			// 현재 보이는 섹션 찾기
			const tabHeight = isTabsSticky ? 75 : 0
			const sections = ['features', 'benefits', 'categories', 'tools', 'community']
			for (const sectionId of sections) {
				const element = document.getElementById(sectionId)
				if (element) {
					const rect = element.getBoundingClientRect()
					if (rect.top <= tabHeight + 100 && rect.bottom >= tabHeight + 100) {
						setCurrentTab(sectionId)
						break
					}
				}
			}
		}

		// 초기 실행
		handleStickyTabScroll()

		window.addEventListener('scroll', handleStickyTabScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleStickyTabScroll)
	}, [isTabsSticky])

	// 탭 슬라이더 위치 업데이트
	useEffect(() => {
		const currentTabElement = tabRefs.current[currentTab]
		if (currentTabElement && currentTab) {
			setSliderStyle({
				width: currentTabElement.offsetWidth,
				left: currentTabElement.offsetLeft
			})
		}
	}, [currentTab, isTabsSticky])

	// 탭 클릭 핸들러
	const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
		e.preventDefault()
		const element = document.getElementById(sectionId)
		if (element) {
			const elementPosition = element.getBoundingClientRect().top
			const offsetPosition = elementPosition + window.pageYOffset
			
			window.scrollTo({ 
				top: offsetPosition, 
				behavior: 'smooth' 
			})
		}
	}

	// 스크롤 애니메이션 Observer
	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1
		}

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible')
				}
			})
		}, observerOptions)

		// 애니메이션을 적용할 요소들 선택
		const animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in')
		animatedElements.forEach((el) => observer.observe(el))

		// SVG Path 애니메이션을 위한 IntersectionObserver
		const svgObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const paths = entry.target.querySelectorAll('.svg-path')
						paths.forEach((path, index) => {
							setTimeout(() => {
								path.classList.add('draw')
							}, index * 500)
						})
					}
				})
			},
			{
				threshold: 0.3,
			}
		)

		const svgSections = document.querySelectorAll('.svg-content')
		svgSections.forEach((section) => svgObserver.observe(section))

		return () => {
			animatedElements.forEach((el) => observer.unobserve(el))
			svgSections.forEach((section) => svgObserver.unobserve(section))
		}
	}, [])

	// "모든 것이 여기에" 섹션으로 스크롤하는 함수
	const scrollToSuccess = () => {
		const heroSection = document.querySelector('.hero-section') as HTMLElement
		const nextSection = document.querySelector('.sticky-tabs-hero') as HTMLElement
		if (!heroSection || !nextSection) return

		const heroTop = heroSection.offsetTop
		const heroBottom = heroTop + heroSection.offsetHeight
		const currentProgress = heroScrollProgressRef.current

		// 히어로 애니메이션이 완료되지 않았으면 먼저 완료
		if (currentProgress < 2.5) {
			const animationDuration = 1500 // 1.5초
			const startTime = Date.now()
			const startProgress = currentProgress

			const animateHero = () => {
				const elapsed = Date.now() - startTime
				const progress = Math.min(elapsed / animationDuration, 1)
				
				// easeInOutCubic 이징
				const ease = progress < 0.5
					? 4 * progress * progress * progress
					: 1 - Math.pow(-2 * progress + 2, 3) / 2

				// progress를 현재 위치에서 2.5까지 증가
				heroScrollProgressRef.current = startProgress + (2.5 - startProgress) * ease

				// 이미지 애니메이션 적용
				const scrollImages = document.querySelectorAll('.scroll-images img')
				scrollImages.forEach((img) => {
					const speed = parseFloat((img as HTMLElement).dataset.speed || '1')
					const yPos = heroScrollProgressRef.current * 400 * speed
					const element = img as HTMLElement
					element.style.transform = `translateY(${-yPos}px)`
				})

				if (progress < 1) {
					requestAnimationFrame(animateHero)
				} else {
					// 히어로 애니메이션 완료 후 다음 섹션으로 즉시 이동
					heroScrollProgressRef.current = 2.5
					hasPassedHeroRef.current = true
					
					// 딜레이 없이 바로 다음 섹션으로 스크롤
					nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
				}
			}

			requestAnimationFrame(animateHero)
		} else {
			// 이미 완료되었으면 바로 이동
			hasPassedHeroRef.current = true
			nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	return (
		<div className='min-h-screen bg-white'>
			{/* Hero Section - 텀블벅 스타일 메인 히어로 */}
			<section className='hero-section bg-black text-white min-h-screen flex flex-col relative overflow-hidden'>
				{/* 스크롤 이미지 배경 */}
				<div className='scroll-wrapper'>
					<div className='scroll-content'>
						<div className='scroll-images'>
							<img data-speed="0.8" src="https://images.unsplash.com/photo-1556856425-366d6618905d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG5lb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" alt="" />
							<img data-speed="0.9" src="https://images.unsplash.com/photo-1520271348391-049dd132bb7c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="" />
							<img data-speed="1" src="https://images.unsplash.com/photo-1609166214994-502d326bafee?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" alt="" />
							<img data-speed="1.1" src="https://images.unsplash.com/photo-1589882265634-84f7eb9a3414?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=434&q=80" alt="" />
							<img data-speed="0.9" src="https://images.unsplash.com/photo-1514689832698-319d3bcac5d5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=434&q=80" alt="" />
							<img data-speed="1.2" src="https://images.unsplash.com/photo-1535207010348-71e47296838a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="" />
							<img data-speed="0.8" src="https://images.unsplash.com/photo-1588007375246-3ee823ef4851?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fG5lb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" alt="" />
							<img data-speed="1" src="https://images.unsplash.com/photo-1571450669798-fcb4c543f6a4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fG5lb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" alt="" />
						</div>
					</div>	
				</div>
				{/* Custom Header for Creater Page */}
				<header className='pt-6 md:pt-8 px-4 md:px-8 lg:px-[10%] relative z-10'>
					<Link to='/' className='inline-block'>
						<div className='text-2xl md:text-3xl font-bold text-white hover:text-blue-400 transition-colors duration-300'>
							<span className='font-serif italic'>With</span><span className='font-sans'>U</span>
						</div>
					</Link>
				</header>

				<div className='flex items-center justify-between flex-1 px-4 md:px-8 lg:px-[10%] relative z-10'>
					<div className='flex-1 max-w-4xl'>
						<p className='text-sm md:text-lg mb-4 md:mb-6 text-gray-300 font-light tracking-wide animate-fade-in-up delay-100'>
							아이디어에서 현실로
						</p>
						<h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black mb-6 md:mb-8 leading-tight'>
							<span className='korean-title-animated funding block mb-2'>
								당신의{' '}
								<span className='text-rotator'>
									<span className='text-rotator-inner'>
										<span className='text-rotator-item'>창작</span>
										<span className='text-rotator-item'>비전</span>
										<span className='text-rotator-item'>작품</span>
										<span className='text-rotator-item'>구상</span>
									</span>
								</span>
								을
							</span>
							<span className='korean-title-animated withu block'>
								세상에 선보이세요
							</span>
						</h1>
						<p className='text-base md:text-xl text-gray-400 mb-8 md:mb-10 max-w-xl leading-relaxed animate-fade-in-up delay-500'>
							위드유와 함께라면 누구나 창작자가 될 수 있습니다.<br className='hidden sm:block' />
							지금 바로 당신의 프로젝트를 시작하세요.
						</p>
						<div className='flex flex-wrap gap-3 md:gap-4 animate-fade-in-up delay-600'>
							<Link 
								to='/project/create' 
								className='inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 md:px-10 md:py-5 rounded-full text-base md:text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105'
							>
								프로젝트 시작하기 <ArrowRight className='w-5 h-5 md:w-6 md:h-6' />
							</Link>
							<button 
								onClick={scrollToSuccess}
								className='inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-6 py-3 md:px-10 md:py-5 rounded-full text-base md:text-xl font-semibold hover:bg-white/20 transition-all duration-300'
							>
								문의하기 
							</button>
						</div>
						<p className='mt-6 md:mt-8 text-xs md:text-sm text-gray-500 animate-fade-in-up delay-700'>
							✓ 5분 만에 시작 &nbsp;&nbsp; ✓ 신용카드 불필요 &nbsp;&nbsp; ✓ 누구나
						</p>
					</div>
					<div className='flex-1 flex justify-end items-center hidden lg:flex'>
						<div className='relative scale-90 lg:scale-100 animate-fade-in-right delay-400'>
							{/* 컴퓨터 모니터 모형 */}
							<div className='w-[350px] xl:w-[400px] h-[245px] xl:h-[280px] bg-gray-900 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500'>
								{/* 모니터 화면 */}
								<div className='w-full h-full bg-white rounded-lg overflow-hidden'>
									<div className='bg-gradient-to-br from-blue-50 to-purple-50 h-full flex flex-col'>
										{/* 브라우저 상단바 */}
										<div className='bg-gray-100 px-3 py-2 flex items-center gap-2'>
											<div className='flex gap-1'>
												<div className='w-2.5 h-2.5 bg-red-500 rounded-full'></div>
												<div className='w-2.5 h-2.5 bg-yellow-500 rounded-full'></div>
												<div className='w-2.5 h-2.5 bg-green-500 rounded-full'></div>
											</div>
											<div className='flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600'>
												https://withyou.com
											</div>
										</div>
										{/* 웹사이트 내용 */}
										<div className='p-4 flex-1'>
											<div className='flex items-center justify-between mb-4'>
												<div className='text-lg font-bold'>위드유</div>
												<div className='px-2 py-1 bg-blue-500 text-white text-xs rounded'>
													로그인
												</div>
											</div>
											<div className='text-center mb-4'>
												<h2 className='text-sm font-bold text-gray-800 mb-1'>당신의 최고의<br />세상을 바꾼다</h2>
												<p className='text-xs text-gray-600'>당신만의 시작을 보여주세요.</p>
											</div>
											<div className='grid grid-cols-5 gap-1 mb-4'>
												{['컴퓨터공학', '디자인', '뷰티', '푸드', '기업'].map((category, idx) => (
													<div key={idx} className='text-center'>
														<div className='w-8 h-8 bg-white rounded-lg shadow-sm mb-1 flex items-center justify-center'>
															<div className='w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded'></div>
														</div>
														<span className='text-[9px] text-gray-600'>{category}</span>
													</div>
												))}
											</div>
											<div className='text-xs font-semibold text-gray-800 mb-2'>추천할 만한 프로젝트</div>
											<div className='grid grid-cols-3 gap-1'>
												{[1, 2, 3].map((item) => (
													<div key={item} className='bg-white rounded p-1 shadow-sm'>
														<div className='w-full h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded mb-1'></div>
														<p className='text-[8px] text-gray-600 mb-1'>구로 요가교실</p>
														<p className='text-[8px] text-blue-600 font-semibold'>응원할 뭔가들 여기서</p>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
							{/* 모니터 목 */}
							<div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gray-700'></div>
							{/* 모니터 받침대 */}
							<div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2'>
								<div className='w-24 h-3 bg-gray-600 rounded-full'></div>
							</div>
							{/* 장식 요소들 - 텀블벅 스타일의 곡선들 */}
							<div className='absolute -top-8 -left-8 w-32 h-32 border border-white/10 rounded-full animate-float'></div>
							<div className='absolute -bottom-12 -right-12 w-48 h-48 border border-white/5 rounded-full animate-float' style={{animationDelay: '1s'}}></div>
							<div className='absolute top-1/2 -right-16 w-24 h-24 border border-blue-400/20 rounded-full animate-float' style={{animationDelay: '0.5s'}}></div>
						</div>
					</div>
				</div>

				{/* 아래로 스크롤 버튼 */}
				<div className='absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 animate-fade-in-up delay-800'>
					<button
						onClick={scrollToSuccess}
						className='flex flex-col items-center gap-2 text-white hover:text-blue-400 transition-all duration-300 group'
						aria-label='아래로 스크롤'
					>
						<span className='text-xs md:text-sm font-medium opacity-80 group-hover:opacity-100'>더 알아보기</span>
						<div className='w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-400/10 animate-bounce'>
							<ChevronDown className='w-6 h-6' />
						</div>
					</button>
				</div>
			</section>

			{/* 스티키 탭 네비게이션 */}
			<section className='sticky-tabs-hero relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-center px-8'>
				{/* SVG Path 애니메이션 */}
				<div className='svg-content absolute inset-0 pointer-events-none overflow-hidden z-0'>
					<svg 
						className='absolute inset-0 w-full h-full' 
						viewBox='0 0 1920 800' 
						xmlns='http://www.w3.org/2000/svg'
						preserveAspectRatio='none'
					>
						<path 
							className='svg-path'
							d='M0,600 Q480,300 960,500 Q1440,700 1920,400'
							fill='none' 
							stroke='#059669' 
							strokeWidth='3'
							opacity='0.3'
						/>
						<path 
							className='svg-path'
							d='M0,400 Q240,100 480,400 Q720,700 960,400 Q1200,100 1440,400 Q1680,700 1920,400'
							fill='none' 
							stroke='#F59E0B' 
							strokeWidth='3'
							opacity='0.3'
						/>
						<path 
							className='svg-path'
							d='M200,650 Q600,350 1000,550 Q1400,750 1800,450'
							fill='none' 
							stroke='#0891B2' 
							strokeWidth='2'
							opacity='0.2'
						/>
					</svg>
				</div>

				<h1 className='relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 text-gray-900 scroll-fade-in'>
					창작의 시작
				</h1>
				<h3 className='relative z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-light mb-8 md:mb-12 scroll-fade-in px-4'>
					아이디어를 현실로, 위드유가 함께합니다
				</h3>
				
				{/* 핵심 가치 3개를 한 줄로 */}
				<div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto'>
					<div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30'>
							<Star className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-bold text-gray-900 mb-2'>아이디어만으로</h3>
						<p className='text-gray-600 text-sm'>
							완성품 없이도 바로 시작
						</p>
					</div>

					<div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30'>
							<Users className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-bold text-gray-900 mb-2'>함께 성장하는</h3>
						<p className='text-gray-600 text-sm'>
							커뮤니티 기반 플랫폼
						</p>
					</div>

					<div className='group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:border-pink-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30'>
							<Award className='w-8 h-8 text-white' />
						</div>
						<h3 className='text-xl font-bold text-gray-900 mb-2'>안전하고 투명한</h3>
						<p className='text-gray-600 text-sm'>
							신뢰할 수 있는 시스템
						</p>
					</div>
				</div>

				<div 
					ref={tabsContainerRef}
					className={`sticky-tabs-container relative z-10 ${isTabsSticky ? 'sticky-tabs-container--sticky' : ''}`}
				>
					<a 
						ref={(el) => { tabRefs.current['features'] = el }}
						className={`sticky-tab ${currentTab === 'features' ? 'active' : ''}`}
						href='#features'
						onClick={(e) => handleTabClick(e, 'features')}
					>
						자격 요건
					</a>
					<a 
						ref={(el) => { tabRefs.current['benefits'] = el }}
						className={`sticky-tab ${currentTab === 'benefits' ? 'active' : ''}`}
						href='#benefits'
						onClick={(e) => handleTabClick(e, 'benefits')}
					>
						장점
					</a>
					<a 
						ref={(el) => { tabRefs.current['categories'] = el }}
						className={`sticky-tab ${currentTab === 'categories' ? 'active' : ''}`}
						href='#categories'
						onClick={(e) => handleTabClick(e, 'categories')}
					>
						카테고리
					</a>
					<a 
						ref={(el) => { tabRefs.current['tools'] = el }}
						className={`sticky-tab ${currentTab === 'tools' ? 'active' : ''}`}
						href='#tools'
						onClick={(e) => handleTabClick(e, 'tools')}
					>
						도구
					</a>
					<span 
						className='sticky-tab-slider' 
						style={{ 
							width: `${sliderStyle.width}px`, 
							left: `${sliderStyle.left}px` 
						}}
					></span>
				</div>
			</section>

			{/* 자격 요건 섹션 */}
			<section id='features' className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 via-white to-purple-50 px-0 py-20 scroll-mt-24'>
				<div className='w-full max-w-full'>
					{/* 헤더 */}
					<div className='text-center mb-12 px-8 scroll-fade-in'>
						<p className='text-lg text-gray-600 mb-4 font-normal'>저도 자격이 될까요?</p>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight'>
							위드유 펀딩 서비스는
						</h2>
						<h2 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
							<span className='text-cyan-500'>개인, 개인 사업자, 법인 사업자</span>까지 누구나 이용할 수 있습니다.
						</h2>
					</div>
					
					{/* 움직이는 카테고리 - 여백 없이 화면 끝에서 끝으로 */}
					<div className='relative w-full overflow-hidden py-12'>
						<div className='flex items-center h-full animate-move-right whitespace-nowrap'>
							{[
								'프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버', '크리에이터', '1인 사업자',
								'프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버', '크리에이터', '1인 사업자',
								'프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버', '크리에이터', '1인 사업자',
								'프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버', '크리에이터', '1인 사업자'
							].map((category, index) => (
								<div
									key={index}
									className='inline-flex items-center justify-center bg-white border border-gray-200 rounded-full px-6 py-3 mx-4 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 min-w-fit hover:-translate-y-1 hover:shadow-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
								>
									{category}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

		{/* 장점 섹션 - 창작자들이 위드유를 선택하는 이유 */}
		<section id='benefits' className='min-h-screen px-8 py-20 pt-32 scroll-mt-24 relative z-0'>
			{/* 헤더 섹션 */}
			<div className='py-20 bg-purple-900 text-white relative overflow-hidden rounded-3xl mb-12 z-0 scroll-scale-in'>
				<div className='absolute inset-0 opacity-10'>
					<div className='grid grid-cols-6 gap-4 transform rotate-12 scale-150'>
						{Array.from({ length: 24 }).map((_, i) => (
							<div key={i} className='bg-white rounded-lg h-32'></div>
						))}
					</div>
				</div>
				<div className='max-w-4xl mx-auto text-center relative z-10 px-4 md:px-8'>
					<h2 className='text-2xl md:text-4xl font-bold mb-4'>창작자들이<br />위드유를 선택하는 이유</h2>
				</div>
			</div>

			{/* 장점 1 - 아이디어만 있어도 시작할 수 있는 플랫폼 */}
			<div className='max-w-7xl mx-auto mb-12 md:mb-20 px-4 md:px-8'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center'>
					<div className='scroll-fade-in-left'>
						<div className='text-4xl md:text-6xl font-light text-gray-300 mb-3 md:mb-4'>01</div>
						<h2 className='text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6'>
							아이디어만 있어도<br />
							시작할 수 있는 플랫폼
						</h2>
						<div className='space-y-3 md:space-y-4 text-sm md:text-base text-gray-600 mb-6 md:mb-8'>
							<p>완성된 제품이 없어도 괜찮습니다.</p>
							<p>아이디어와 열정만 있다면</p>
							<p>누구나 프로젝트를 시작할 수 있습니다.</p>
						</div>
					</div>
					<div className='relative scroll-fade-in-right'>
						<div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8'>
							<div className='flex items-center mb-4 md:mb-6'>
								<div className='w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold mr-3 md:mr-4'>
									💡
								</div>
								<div>
									<h3 className='text-lg md:text-xl font-bold text-gray-900'>아이디어 기반 펀딩</h3>
									<p className='text-sm md:text-base text-blue-600 font-semibold'>컨셉만으로도 시작 가능한 펀딩</p>
								</div>
							</div>
							<div className='space-y-4'>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-5 h-5 text-green-500' />
									<span className='text-gray-700'>기획서만으로 펀딩 시작</span>
								</div>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-5 h-5 text-green-500' />
									<span className='text-gray-700'>전문가 멘토링 지원</span>
								</div>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-5 h-5 text-green-500' />
									<span className='text-gray-700'>단계별 가이드 제공</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 장점 2 - 안전하고 편리한 펀딩 환경 */}
			<div className='max-w-7xl mx-auto mb-20 bg-gray-50 rounded-3xl p-12 scroll-fade-in'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					<div className='order-2 lg:order-1 scroll-fade-in-left'>
						<div className='bg-white rounded-2xl p-8 shadow-lg'>
							<div className='grid grid-cols-2 gap-4 mb-6'>
								<div className='w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center'>
									<Users className='w-12 h-12 text-blue-600' />
								</div>
								<div className='w-full h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center'>
									<TrendingUp className='w-12 h-12 text-purple-600' />
								</div>
							</div>
							<div className='mb-6'>
								<h3 className='text-xl font-bold text-gray-900 mb-2'>안전하고 투명한 펀딩</h3>
								<p className='text-blue-600 font-semibold'>신뢰할 수 있는 펀딩 플랫폼</p>
							</div>
							<div className='space-y-3'>
								<div className='flex items-center gap-3'>
									<Star className='w-5 h-5 text-yellow-500' />
									<span className='text-gray-700'>안전한 결제 시스템</span>
								</div>
								<div className='flex items-center gap-3'>
									<Star className='w-5 h-5 text-yellow-500' />
									<span className='text-gray-700'>투명한 펀딩 진행 상황</span>
								</div>
								<div className='flex items-center gap-3'>
									<Star className='w-5 h-5 text-yellow-500' />
									<span className='text-gray-700'>체계적인 프로젝트 관리</span>
								</div>
							</div>
						</div>
					</div>
					<div className='order-1 lg:order-2 scroll-fade-in-right'>
						<div className='text-6xl font-light text-gray-300 mb-4'>02</div>
						<h2 className='text-4xl font-bold text-gray-900 mb-6'>
							안전하고 편리한<br />
							펀딩 환경
						</h2>
						<div className='space-y-4 text-gray-600 mb-8'>
							<p>복잡한 절차 없이 간단하게</p>
							<p>안전하고 투명한 펀딩을 진행할 수 있습니다.</p>
							<p>창작자와 후원자 모두가 안심할 수 있는 시스템입니다.</p>
						</div>
					</div>
				</div>
			</div>

			{/* 장점 3 - 소통을 통한 프로젝트 성장 */}
			<div className='max-w-7xl mx-auto mb-20'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					<div className='scroll-fade-in-left'>
						<div className='text-6xl font-light text-gray-300 mb-4'>03</div>
						<h2 className='text-4xl font-bold text-gray-900 mb-6'>
							소통을 통한<br />
							프로젝트 성장
						</h2>
						<div className='space-y-4 text-gray-600 mb-8'>
							<p>후원자와의 활발한 소통을 통해</p>
							<p>프로젝트를 더욱 발전시켜 나갈 수 있습니다.</p>
							<p>함께 만들어가는 창작의 즐거움을 경험하세요.</p>
						</div>
						<div className='flex flex-wrap gap-3'>
							{['#창의성', '#혁신', '#품질', '#신뢰', '#소통', '#성장'].map((tag) => (
								<span key={tag} className='px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 rounded-full text-sm font-medium'>
									{tag}
								</span>
							))}
						</div>
					</div>
					<div className='relative scroll-fade-in-right'>
						<div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8'>
							<div className='grid grid-cols-2 gap-4 mb-6'>
								<div className='w-full h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg flex items-center justify-center'>
									<Users className='w-8 h-8 text-purple-700' />
								</div>
								<div className='w-full h-24 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg flex items-center justify-center'>
									<Award className='w-8 h-8 text-pink-700' />
								</div>
							</div>
							<div className='mb-6'>
								<h3 className='text-xl font-bold text-gray-900 mb-2'>다양한 소통 방식</h3>
								<p className='text-purple-600 font-semibold'>창작자와 후원자의 활발한 교류</p>
							</div>
							<div className='space-y-3 text-gray-700 text-sm leading-relaxed'>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-4 h-4 text-green-500' />
									<span>실시간 댓글과 메시지</span>
								</div>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-4 h-4 text-green-500' />
									<span>프로젝트 업데이트 알림</span>
								</div>
								<div className='flex items-center gap-3'>
									<CheckCircle className='w-4 h-4 text-green-500' />
									<span>커뮤니티 피드백 시스템</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 장점 4 - 손쉬운 시작 간편한 관리 */}
			<div className='max-w-7xl mx-auto bg-gray-50 rounded-3xl p-12'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
					<div>
						<h2 className='text-4xl font-bold text-gray-900 mb-6'>
							손쉬운 시작<br />
							간편한 관리
						</h2>
						<div className='space-y-4 text-gray-600 mb-8'>
							<p>후원자 소통은 메시지 기능으로</p>
							<p>진행 중인 마케팅은 대시보드로</p>
							<p>한눈에 확인하고 관리할 수 있습니다.</p>
						</div>
					</div>
					<div className='relative'>
						<div className='bg-white rounded-2xl p-8 shadow-lg'>
							{/* 컴퓨터 모니터 모형 */}
							<div className='bg-gray-800 rounded-t-lg p-4'>
								<div className='flex space-x-2 mb-4'>
									<div className='w-3 h-3 bg-red-500 rounded-full'></div>
									<div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
									<div className='w-3 h-3 bg-green-500 rounded-full'></div>
								</div>
								<div className='bg-white rounded p-6'>
									<div className='mb-6'>
										<div className='flex items-center justify-between mb-4'>
											<h3 className='text-lg font-bold'>후원 유입경로</h3>
											<span className='text-sm text-gray-500'>2019.08.12</span>
										</div>
										<div className='relative'>
											{/* 원형 차트 모형 */}
											<div className='w-48 h-48 mx-auto relative'>
												<div className='w-full h-full rounded-full' style={{
													background: `conic-gradient(
														from 0deg,
														#ef4444 0deg 260deg,
														#06b6d4 260deg 321deg,
														#3b82f6 321deg 360deg
													)`
												}}></div>
												<div className='absolute inset-0 flex items-center justify-center'>
													<div className='bg-white rounded-full w-24 h-24 flex items-center justify-center'>
														<div className='text-center'>
															<div className='text-lg font-bold'>72.4%</div>
															<div className='text-xs text-gray-500'>직접 유입</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className='space-y-2 text-sm'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 bg-red-500 rounded-full'></div>
												<span>일반/직접 유입</span>
											</div>
											<span className='font-semibold'>2,880,200원</span>
										</div>
										<div className='flex items-center justify-between'>
											<div className='flex items-center gap-2'>
												<div className='w-3 h-3 bg-cyan-500 rounded-full'></div>
												<span>외부/게시 유입</span>
											</div>
											<span className='font-semibold'>12,351,722원</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>			{/* 카테고리 섹션 */}
			<section id='categories' className='min-h-screen flex flex-col items-center justify-center bg-white px-4 md:px-8 py-16 md:py-20 scroll-mt-24'>
				<div className='max-w-7xl mx-auto'>
					<h2 className='text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6 text-center scroll-fade-in'>다양한 카테고리</h2>
					<p className='text-base md:text-xl text-gray-600 mb-8 md:mb-12 text-center max-w-3xl mx-auto scroll-fade-in'>
						테크부터 라이프스타일까지, 모든 분야의 창작을 지원합니다
					</p>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8'>
						{CATEGORIES.map((category, idx) => (
							<div key={idx} className='group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-8 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden scroll-scale-in'>
								{/* 배경 그라데이션 오버레이 */}
								<div className={`absolute inset-0 bg-gradient-to-br ${category.color || 'from-blue-500 to-cyan-500'} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

								{/* 아이콘 컨테이너 */}
								<div className='relative mb-3 md:mb-4'>
									<div className='w-12 h-12 md:w-16 md:h-16 mx-auto bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm'>
										<category.icon className='w-6 h-6 md:w-8 md:h-8 text-gray-600' />
									</div>
								</div>

								{/* 텍스트 컨텐츠 */}
								<div className='relative'>
									<h3 className='text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-gray-800 transition-colors'>
										{category.name}
									</h3>
									<p className='text-xs md:text-sm text-gray-500 leading-relaxed hidden md:block'>
										{category.desc}
									</p>
								</div>

								{/* 호버 효과를 위한 추가 요소 */}
								<div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 도구 섹션 */}
		<section id='tools' className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 px-4 md:px-8 py-16 md:py-20 pt-24 md:pt-32 scroll-mt-24'>
			<div className='max-w-7xl mx-auto'>
				{/* 섹션 헤더 */}
				<div className='text-center mb-8 md:mb-12 scroll-fade-in'>
					<h2 className='text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3'>
						창작자에게
					</h2>
					<h2 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4'>
						날개를 달아줄 기능
					</h2>
				</div>					{/* 기능 카드 그리드 */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
						{/* 직관적인 프로젝트 에디터 */}
						<div className='group bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
							<div className='bg-white rounded-xl p-5 mb-4 shadow-sm'>
								<div className='flex items-center justify-between mb-3'>
									<div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
										<Smartphone className='w-5 h-5 text-orange-600' />
									</div>
									<div className='w-7 h-7 bg-red-500 rounded-full flex items-center justify-center'>
										<div className='w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='h-2 bg-gray-200 rounded w-3/4'></div>
									<div className='h-2 bg-gray-200 rounded w-1/2'></div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>✏️</span>
								<h3 className='text-xl font-bold text-gray-900'>직관적인 프로젝트 에디터</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								편리한 편집 도구로 프로젝트를 쉽게 작성할 수 있습니다. 이미지나 동영상을 업로드해서 더욱더 쉽게 표현하세요.
							</p>
						</div>

						{/* 데이터 분석 대시보드 */}
						<div className='group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
							<div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
								<div className='mb-4'>
									<p className='text-xs text-gray-500 mb-2'>후원자 연령 비율</p>
								</div>
								<div className='relative w-32 h-32 mx-auto'>
									<svg viewBox='0 0 100 100' className='transform -rotate-90'>
										<circle cx='50' cy='50' r='40' fill='none' stroke='#ef4444' strokeWidth='20' strokeDasharray='75 251'></circle>
										<circle cx='50' cy='50' r='40' fill='none' stroke='#22c55e' strokeWidth='20' strokeDasharray='50 251' strokeDashoffset='-75'></circle>
										<circle cx='50' cy='50' r='40' fill='none' stroke='#3b82f6' strokeWidth='20' strokeDasharray='125 251' strokeDashoffset='-125'></circle>
									</svg>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='bg-white rounded-full w-16 h-16'></div>
									</div>
								</div>
								<div className='mt-3 space-y-1 text-xs'>
									<div className='flex items-center gap-2'>
										<div className='w-2 h-2 bg-red-500 rounded-full'></div>
										<span className='text-gray-500'>•</span>
										<span className='text-gray-500'>•</span>
									</div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>📊</span>
								<h3 className='text-xl font-bold text-gray-900'>데이터 분석 대시보드</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								전략 중요! 프로젝트의 후원자 성별, 연령 비율 등으로 창작자님의 고객층을 확인하세요.
							</p>
						</div>

						{/* 공개예정 서비스 */}
						<div className='group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'>
							<div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
								<div className='flex items-center justify-between mb-4'>
									<div className='text-xs text-gray-500'>로켓탑 프로젝트</div>
									<div className='text-xs text-gray-400'>›</div>
								</div>
								<div className='bg-red-500 rounded-lg p-4 text-white text-center'>
									<div className='text-sm mb-1'>🔔 알림 신청</div>
									<div className='text-xs font-bold'>(123명의 알림 신청받음!)</div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>🔔</span>
								<h3 className='text-xl font-bold text-gray-900'>공개예정 서비스</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								프로젝트 공개 전 알림신청 등록 수요를 미리 파악하세요.<br />
								(Run 또는 Boost 공개예시에 사용 가능)
							</p>
						</div>

						{/* 후원자 1:1 메시지 */}
						<div className='group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
							<div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
								<div className='space-y-3'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white'>
											😊
										</div>
										<div className='flex-1 bg-blue-50 rounded-2xl p-3'>
											<p className='text-xs text-gray-600'>안녕하세요 + 창작자님에게 도달했습니다!</p>
										</div>
									</div>
									<div className='flex items-center gap-3 justify-end'>
										<div className='bg-red-400 rounded-2xl px-4 py-2'>
											<p className='text-xs text-white'>← 메시지 확인하세요 →</p>
										</div>
										<div className='w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white'>
											�
										</div>
									</div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>👥</span>
								<h3 className='text-xl font-bold text-gray-900'>후원자 1:1 메시지</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								후원자분과 간편히 소통해 피드백을 받아보세요.
							</p>
						</div>

						{/* 커뮤니티 */}
						<div className='group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
							<div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
								<div className='flex items-start gap-3'>
									<div className='w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0'>
										<span className='text-sm'>👤</span>
									</div>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<span className='text-xs font-bold text-gray-900'>그릴크라는 처음</span>
											<span className='text-xs bg-red-500 text-white px-2 py-0.5 rounded'>성공전!</span>
											<span className='text-gray-400 text-xs'>⋮</span>
										</div>
										<p className='text-xs text-gray-600 mb-2'>
											도와주셔서 감사합니다! 앞으로도 좋은 컨텐츠를 만들어갈게요! 🙏🏻
										</p>
										<div className='text-xs text-gray-400'>8개의 댓글</div>
									</div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>💬</span>
								<h3 className='text-xl font-bold text-gray-900'>커뮤니티</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								이벤트를 열거나 질문 관련 공지 사항을 전달할 때 후원자와 쉽고 빠르게 소통할 수 있는 곳
							</p>
						</div>

						{/* 응원권 */}
						<div className='group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 scroll-scale-in'>
							<div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
								<div className='bg-gradient-to-r from-pink-200 to-red-200 rounded-xl p-6 relative overflow-hidden'>
									<div className='absolute top-2 right-2 text-gray-400 text-xs'>⋮ ⋮ ⋮</div>
									<div className='text-center'>
										<div className='text-3xl font-bold text-white mb-2'>3,000 원</div>
										<div className='w-16 h-1 bg-white/50 mx-auto'></div>
									</div>
								</div>
							</div>
							<div className='flex items-start gap-2 mb-2'>
								<span className='text-xl'>🎉</span>
								<h3 className='text-xl font-bold text-gray-900'>응원권</h3>
							</div>
							<p className='text-gray-600 text-sm leading-relaxed'>
								공개예정 또는 진행 중인 프로젝트의 응원권을 펼쳐하여 후원을 유도할 수 있습니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA 섹션 */}
			<section className='py-12 md:py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white'>
				<div className='max-w-4xl mx-auto text-center px-4 md:px-8 scroll-fade-in'>
					<h2 className='text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6'>
						지금 바로 시작하세요
					</h2>
					<p className='text-base md:text-xl mb-6 md:mb-8 opacity-90'>
						당신의 창의적인 아이디어를 세상과 공유하고, 함께 성장할 후원자들을 만나보세요.
					</p>
					<Link 
						to='/project/create' 
						className='inline-flex items-center gap-2 md:gap-3 bg-white text-blue-600 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
					>
						프로젝트 시작하기 <ArrowRight className='w-4 h-4 md:w-5 md:h-5' />
					</Link>
				</div>
			</section>

			{/* Footer 정보 */}
			<footer className='bg-gray-900 text-gray-400 py-6 md:py-8'>
				<div className='max-w-7xl mx-auto px-4 md:px-8 text-center'>
					<p className='text-sm'>copyright 2025 WithU Corp. all rights reserved.</p>
				</div>
			</footer>
			{/* Footer 정보 */}
			<footer className='bg-gray-900 text-gray-400 py-8'>
				<div className='max-w-7xl mx-auto px-8 text-center'>
					<p className='text-sm'>copyright 2025 WithU Corp. all rights reserved.</p>
				</div>
			</footer>
		</div>
	)
}

export default Creater

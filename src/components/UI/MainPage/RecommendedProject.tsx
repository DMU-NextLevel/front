import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import { useAuth } from '../../../hooks/AuthContext'
import noImage from '../../../assets/images/noImage.jpg'

// 스크롤바 숨김을 위한 스타일
const scrollbarHiddenStyle = {
	scrollbarWidth: 'none' as const, /* Firefox */
	msOverflowStyle: 'none' as const, /* IE and Edge */
} as React.CSSProperties

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
const baseUrl = process.env.REACT_APP_API_BASE_URL

type ProjectItem = {
  id: number
  title: string
  content?: string // 프로젝트 소개글
  titleImg: {
	id: number
	uri: string
  }
  completionRate: number
  recommendCount: number
  tags: string[]
  createdAt: string
  expired: string
  isExpired: boolean
  isRecommend: boolean
  shortDescription?: string
  description?: string
  summary?: string
  intro?: string
  isLiked?: boolean
  author?: {
    name: string
    nickName: string
  }
}

const getRemainingText = (expiredDateStr?: string, createdDateStr?: string): string | null => {
	if (!expiredDateStr || !createdDateStr) return null
	const today = new Date()
	const expired = new Date(expiredDateStr)
	const created = new Date(createdDateStr)
	const diffTime = expired.getTime() - today.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	const createdDiff = today.getTime() - created.getTime()
	const createdHours = Math.floor(createdDiff / (1000 * 60 * 60))
	if (createdHours <= 24) return 'New'
	if (diffDays < 0) return '마감'
	return `${diffDays}일 남음`
}

const RecommendedProject: React.FC = () => {
	const { isLoggedIn } = useAuth()
	const navigate = useNavigate()
	const [projects, setProjects] = useState<ProjectItem[]>([])
	const [loading, setLoading] = useState(false)
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const [canPrev, setCanPrev] = useState(false)
	const [canNext, setCanNext] = useState(true)
	const [currentSlide, setCurrentSlide] = useState(0)

	// 좋아요 토글 API 함수
	const toggleProjectLike = async (projectId: number, like: boolean) => {
		try {
			const url = `${baseUrl}/social/user/like`
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ like, projectId })
			})
			if (res.ok) {
				setProjects((prev) =>
					prev.map((p) =>
						p.id === projectId ? { ...p, isLiked: like } : p
					)
				)
			}
		} catch (err) {
			console.error('좋아요 토글 실패', err)
		}
	}

	// 좋아요 버튼 클릭 핸들러
	const handleLikeToggle = async (projectId: number, current: boolean) => {
		if (!isLoggedIn) {
			navigate('/login')
			return
		}
		await toggleProjectLike(projectId, !current)
		if (!current) {
			toast.success('위시리스트에 추가됐어요!', {
				duration: 4000,
				style: {
					animation: 'slideInRightToLeft 0.5s',
				},
			})
		} else {
			toast('위시리스트에서 제외했어요.', {
				duration: 3000,
				style: {
					animation: 'slideInRightToLeft 0.5s',
				},
			})
		}
	}

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)
				const data = await fetchProjectsFromServer({ order: 'RECOMMEND', desc: true, pageCount: 7 })
				if (Array.isArray(data)) {
					const sliced = (data as any).slice(0, 7)
					setProjects(sliced)
				}
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	// WebKit 스크롤바 숨김 스타일 추가
	useEffect(() => {
		const style = document.createElement('style')
		style.textContent = `
			.webkit-scrollbar-hidden::-webkit-scrollbar {
				display: none;
			}
		`
		document.head.appendChild(style)

		return () => {
			document.head.removeChild(style)
		}
	}, [])

	// 슬라이더 상태 업데이트 함수 (useCallback으로 메모이제이션)
	const updateSliderState = useCallback(() => {
		const el = sliderRef.current
		if (!el) return

		setCanPrev(el.scrollLeft > 0)
		setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)

		// 현재 슬라이드 인덱스 계산 (gap-4 고려)
		// robust slide width: measure distance between first two children if available
		let slideWidth = el.clientWidth
		if (el.children.length >= 2) {
			const first = el.children[0] as HTMLElement
			const second = el.children[1] as HTMLElement
			slideWidth = second.offsetLeft - first.offsetLeft
		}
		const currentIndex = Math.round(el.scrollLeft / slideWidth)
		const maxIndex = Math.max(0, el.children.length - 1)
		setCurrentSlide(Math.max(0, Math.min(currentIndex, maxIndex)))
	}, [])

	const goToSlide = (index: number) => {
		const el = sliderRef.current
		if (!el) return
		// compute slide width by measuring children offset where possible
		let slideWidth = el.clientWidth
		if (el.children.length >= 2) {
			const first = el.children[0] as HTMLElement
			const second = el.children[1] as HTMLElement
			slideWidth = second.offsetLeft - first.offsetLeft
		}
		el.scrollTo({ left: index * slideWidth, behavior: 'smooth' })
	}

	const goPrev = () => {
		const el = sliderRef.current
		if (!el) return
		let slideWidth = el.clientWidth
		if (el.children.length >= 2) {
			const first = el.children[0] as HTMLElement
			const second = el.children[1] as HTMLElement
			slideWidth = second.offsetLeft - first.offsetLeft
		}
		el.scrollBy({ left: -slideWidth, behavior: 'smooth' })
	}

	const goNext = () => {
		const el = sliderRef.current
		if (!el) return
		let slideWidth = el.clientWidth
		if (el.children.length >= 2) {
			const first = el.children[0] as HTMLElement
			const second = el.children[1] as HTMLElement
			slideWidth = second.offsetLeft - first.offsetLeft
		}
		el.scrollBy({ left: slideWidth, behavior: 'smooth' })
	}

	// 슬라이더 관련 useEffect들
	useEffect(() => {
		const el = sliderRef.current
		if (!el) return

		let ticking = false

		const update = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					updateSliderState()
					ticking = false
				})
				ticking = true
			}
		}

		const timer = setTimeout(update, 100)

		update()
		el.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)

		return () => {
			clearTimeout(timer)
			el.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [updateSliderState])

	return (
		<section className='py-5 px-4 sm:px-6 md:px-8 lg:px-[15%]' data-aos='fade-up' data-aos-once='true'>
			<div className='flex items-end justify-between mb-4'>
				<div>
					<h2 className='text-lg sm:text-xl md:text-2xl font-bold'>추천 프로젝트</h2>
					<p className='mt-1 text-xs sm:text-sm text-gray-500'>인기 있고 추천하는 프로젝트</p>
				</div>
				<a href='/search?order=RECOMMEND' className='text-xs sm:text-sm text-purple-600 hover:underline'>더 보기</a>
			</div>

			{loading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6 lg:gap-10'>
					<div className='md:col-span-1 lg:col-span-5 h-64 sm:h-80 md:h-96 rounded-2xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
					<div className='md:col-span-1 lg:col-span-5 space-y-3 sm:space-y-4'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='h-20 sm:h-24 rounded-xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
						))}
					</div>
				</div>
			)}

			{!loading && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 md:gap-6 lg:gap-10'>
					{/* 좌측: 슬라이더로 4개 아이템 */}
					<div className='md:col-span-1 lg:col-span-5 relative'>
						{/* 좌측 슬라이더 컨테이너 */}
						<div
							ref={sliderRef}
							className='flex overflow-x-auto snap-x snap-mandatory gap-4 webkit-scrollbar-hidden'
							style={{
								WebkitOverflowScrolling: 'touch',
							}}
						>

							{projects.slice(0, 3).map((p, index) => {
								const rate = Math.max(0, Math.min(100, Math.round(p.completionRate ?? 0)))
								const imgSrc = p.titleImg ? `${baseUrl}/img/${p.titleImg.uri}` : ''
								return (
									<div
										key={p.id}
										className='group overflow-hidden transition flex-shrink-0 w-full snap-center'
									>
										<div className='relative w-full overflow-hidden rounded-t-2xl transition-all duration-500 cursor-pointer' style={{ aspectRatio: '16 / 9' }} onClick={() => navigate(`/project/${p.id}`)}>
											<img
												src={imgSrc || noImage}
												alt={p.title}
												className='absolute inset-0 w-full h-full object-cover rounded-t-2xl border border-gray-200 transition-all duration-500 ease-out group-hover:scale-105'
												onError={(e) => {
													e.currentTarget.onerror = null
													e.currentTarget.src = noImage
												}}
											/>

											{/* 프로그래스 바 - 이미지 하단 border처럼 */}
											<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
												<div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${rate}%` }} />
											</div>
										</div>

										<div className='px-4 pt-2 pb-4'>
											<div className='flex items-center justify-between mb-0'>
												<h4 className='text-lg font-bold line-clamp-2 hover:underline transition-all'>
													<span className='cursor-pointer' onClick={() => navigate(`/project/${p.id}`)}>{p.title}</span>
												</h4>
												<button
													onClick={(e) => {
														e.preventDefault()
														e.stopPropagation()
														handleLikeToggle(p.id, p.isLiked ?? false)
													}}
													className='text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-all duration-200'
												>
													<svg className={`w-5 h-5 ${p.isLiked ? 'fill-current text-red-500' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
													</svg>
												</button>
											</div>

											{/* 작성자 */}
											<div className='text-xs text-gray-400 mb-1 font-bold'>
												by {p.author?.nickName || '익명'}
											</div>

											{/* 시작일과 진행률 */}
											<div className='text-xs text-gray-600 mb-2 font-bold flex items-center gap-2'>
												{(() => {
													if (!p.createdAt) return `${Math.round(p.completionRate ?? 0)}% 진행`
													const today = new Date()
													const created = new Date(p.createdAt)
													const diffTime = today.getTime() - created.getTime()
													const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
													const startText = diffDays === 0 ? '오늘 시작' : `${diffDays}일전 시작`
													const progressText = `${Math.round(p.completionRate ?? 0)}% 진행`
													return (
														<>
															<span className='flex items-center gap-1'>
																<svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																	<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
																</svg>
																{startText}
															</span>
															{' · '}
															<span className='text-blue-600 font-semibold'>{progressText}</span>
														</>
													)
												})()}
											</div>

											<p className='text-sm text-gray-500 line-clamp-3 mb-2'>
												{p.content || p.shortDescription || p.description || p.summary || p.intro || '프로젝트 소개가 준비 중입니다.'}
											</p>

											{/* 태그들 - 정보 아래에 배치 */}
											<div className='flex flex-wrap gap-2 mt-2'>
												{Array.isArray(p.tags) && p.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
													<span
														key={`left-${tagIndex}`}
														className='inline-flex items-center rounded-full text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 cursor-pointer'
													>
														{tag}
													</span>
												))}
												{getRemainingText(p.expired, p.createdAt) && (
													<span className='inline-flex items-center rounded-full text-[11px] px-2 py-0.5 bg-white/80 text-gray-700 backdrop-blur'>
														{getRemainingText(p.expired, p.createdAt)}
													</span>
												)}
											</div>
										</div>
									</div>
								)
							})}
						</div>

						{/* 슬라이더 인디케이터 - 선 스타일 */}
						<div className='flex justify-center mt-4'>
							<div className='flex items-center space-x-1'>
								{Array.from({ length: projects.slice(0, 3).length }).map((_, index) => (
									<button
										key={index}
										onClick={() => goToSlide(index)}
										className={`h-1 rounded-full transition-all duration-300 ${
											currentSlide === index
												? 'w-8 bg-purple-600'
												: 'w-4 bg-gray-300 hover:bg-gray-400'
										}`}
										aria-label={`슬라이드 ${index + 1}로 이동`}
									/>
								))}
							</div>
						</div>

					</div>

					{/* 우측: 나머지 4개 */}
					<div className='md:col-span-1 lg:col-span-5 relative' style={{ top: '-16px', left: '16px' }}>
						<div className='grid grid-cols-2 gap-2'>
							{projects.slice(3, 7).map((p) => {
								const rate = Math.max(0, Math.min(100, Math.round(p.completionRate ?? 0)))
								const imgSrc = p.titleImg ? `${baseUrl}/img/${p.titleImg.uri}` : ''
								return (
									<div
										key={p.id}
										className='group bg-transparent rounded-sm overflow-visible relative hover:z-[9999] cursor-pointer'
										style={{
											transitionProperty: 'all',
											transitionDuration: '200ms',
											zIndex: 'var(--z-index, 0)',
											'--z-index': '0'
										} as React.CSSProperties}
										onMouseEnter={(e) => {
											const element = e.currentTarget as HTMLElement
											element.style.setProperty('--z-index', '9999')
										}}
										onMouseLeave={(e) => {
											const element = e.currentTarget as HTMLElement
											element.style.setProperty('--z-index', '0')
										}}
									>
										{/* 호버 시 전체 확장된 카드의 통합 배경 */}
										<div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 group-hover:rounded-sm group-hover:shadow-2xl transition-all duration-300 ease-out z-10'></div>
										{/* 호버 시 카드 하단 확장 배경 */}
										<div
											className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-sm max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-2xl z-10'
											style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
										>
											{/* 실제 표시되는 내용 */}
											<div className='pb-4 px-4 space-y-2'>
												<p className='text-sm text-gray-600 leading-relaxed mt-0.5'>
													{p.content || p.shortDescription || p.description || p.summary || p.intro || '프로젝트 소개가 준비 중입니다.'}
												</p>
												<div className='flex flex-wrap gap-2'>
													{Array.isArray(p.tags) && p.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
														<span
															key={`visible-${tagIndex}`}
															className='inline-flex items-center text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 px-2.5 py-1 rounded-full transition-colors duration-200 cursor-pointer'
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										</div>

										<div className='relative z-10 p-4'>
											<a href={`/project/${p.id}`} className='block'>
												{/* 이미지와 프로그래스바 영역 */}
												<div className='flex mb-4 gap-0 rounded-sm overflow-hidden'>
													<div className='flex-1 relative overflow-hidden rounded-t-lg'>
														<img
															src={imgSrc || noImage}
															alt={p.title}
															className='w-full object-cover rounded-t-lg border border-gray-200 transition-all duration-500 ease-out group-hover:scale-105'
															style={{ aspectRatio: '16 / 9' }}
															onError={(e) => {
																e.currentTarget.onerror = null
																e.currentTarget.src = noImage
															}}
														/>

														{/* 프로그래스 바 - 이미지 하단 border처럼 */}
														<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
															<div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${rate}%` }} />
														</div>
													</div>
												</div>

												<div className='flex items-center justify-between mb-0'>
													<h4 className='text-sm font-bold line-clamp-2 hover:underline transition-all cursor-pointer' onClick={() => navigate(`/project/${p.id}`)}>{p.title}</h4>
													<button
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleLikeToggle(p.id, p.isLiked ?? false)
														}}
														className='text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md ml-1 transition-all duration-200'
													>
														<svg className={`w-4 h-4 ${p.isLiked ? 'fill-current text-red-500' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
															<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
														</svg>
													</button>
												</div>

												{/* 작성자 */}
												<div className='text-xs text-gray-400 mt-1 font-bold'>
													by {p.author?.nickName || '익명'}
												</div>

												{/* 시작일과 진행률 */}
												<div className='text-xs text-gray-600 mt-1 font-bold flex items-center gap-2'>
													{(() => {
														if (!p.createdAt) return `${Math.round(p.completionRate ?? 0)}% 진행`
														const today = new Date()
														const created = new Date(p.createdAt)
														const diffTime = today.getTime() - created.getTime()
														const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
														const startText = diffDays === 0 ? '오늘 시작' : `${diffDays}일전 시작`
														const progressText = `${Math.round(p.completionRate ?? 0)}% 진행`
														return (
															<>
																<span className='flex items-center gap-1'>
																	<svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
																		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
																	</svg>
																	{startText}
																</span>
																{' · '}
																<span className='text-blue-600 font-semibold'>{progressText}</span>
															</>
														)
													})()}
												</div>
											</a>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			)}
		</section>
	)
}

export default React.memo(RecommendedProject)
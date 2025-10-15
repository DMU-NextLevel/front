import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import noImage from '../../../assets/images/noImage.jpg'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import { useAuth } from '../../../hooks/AuthContext'

// 스크롤바 숨김을 위한 스타일
const scrollbarHiddenStyle = {
	scrollbarWidth: 'none' as const, /* Firefox */
	msOverflowStyle: 'none' as const, /* IE and Edge */
} as React.CSSProperties

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
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

const NewProject: React.FC = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const navigate = useNavigate()
	const { isLoggedIn } = useAuth()
	const [projects, setProjects] = useState<any[]>([])
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const tickingRef = useRef(false)
	const [canPrev, setCanPrev] = useState(false)
	const [canNext, setCanNext] = useState(true)

	// optimized update using requestAnimationFrame; defined at top-level to satisfy hooks rules
	const update = React.useCallback(() => {
		const el = sliderRef.current
		if (!el) return
		if (!tickingRef.current) {
			tickingRef.current = true
			requestAnimationFrame(() => {
				setCanPrev(el.scrollLeft > 0)
				setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
				tickingRef.current = false
			})
		}
	}, [])

	// 컴포넌트 마운트 시 WebKit 스크롤바 숨김 스타일 추가
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

	useEffect(() => {
		const loadProjects = async () => {
			const data = await fetchProjectsFromServer({ order: 'CREATED', desc: true, pageCount: 3 })
			if (Array.isArray(data)) {
				setProjects(data)
			}
		}
		loadProjects()
	}, [])

	// Update nav button enabled state on scroll/resize
	useEffect(() => {
		const el = sliderRef.current
		if (!el) return
		// 초기 상태 업데이트를 위한 타이머
		const timer = setTimeout(update, 100)
		// 즉시 한 번 실행
		update()
		el.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		return () => {
			clearTimeout(timer)
			el.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [projects, update]) // projects가 로드된 후에 실행되도록 변경

		const getStep = () => {
			const el = sliderRef.current
			if (!el) return 0
			const first = el.querySelector<HTMLElement>(':scope > *')
			const gapPx = 12 // Tailwind gap-3 ≈ 12px
			const w = first ? first.getBoundingClientRect().width : el.clientWidth * 0.9
			return Math.max(0, Math.round(w + gapPx))
		}

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
						p.id === projectId ? { ...p, isLiked: like, recommendCount: like ? (p.recommendCount || 0) + 1 : Math.max(0, (p.recommendCount || 0) - 1) } : p
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

	return (
			<section className='py-6 sm:py-8 min-w-[1024px] mx-auto px-[15%]'>
				<div className='flex items-end justify-between mb-4 sm:mb-6'>
					<div>
						<h2 className='text-lg sm:text-xl md:text-2xl font-bold m-0'>신규 프로젝트</h2>
						<p className='mt-1 text-xs sm:text-sm text-gray-500 m-0'>방금 올라온 따끈한 프로젝트를 확인해보세요</p>
					</div>
					<a href='/search?order=CREATED' className='text-xs sm:text-sm text-purple-600 hover:underline'>더 보기</a>
				</div>

						{projects.length === 0 && <p className='text-sm text-gray-500'>프로젝트가 없습니다.</p>}

						{/* 반응형 그리드 레이아웃 */}
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
							{projects.map((item) => {
						// titleImg can be a string or an object with uri
						const titleImgPath = item?.titleImg?.uri ? item.titleImg.uri : item.titleImg
						const imgSrc = titleImgPath ? `${baseUrl}/img/${titleImgPath}` : ''
						const rate = Math.max(0, Math.min(100, Math.round(item?.completionRate ?? 0)))
						const tagText = Array.isArray(item?.tags) && item.tags.length > 0 ? item.tags[0] : 'New'
						const remain = getRemainingText(item?.expired, item?.createdAt)
						const creatorName = item?.creator?.name || item?.author?.name || item?.user?.name || '알 수 없음'
						const createdDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString('ko-KR') : ''
						return (
							<div
								key={item.id}
														className='bg-transparent group'
							>
								<div className='relative'>
									{/* 이미지와 프로그래스바 영역 */}
									<div className='flex mb-4 sm:mb-6 gap-0 rounded-sm overflow-hidden'>
										<div className='flex-1 relative overflow-hidden rounded-t-lg border border-gray-200'>
											<img
												src={imgSrc || noImage}
												alt={item.title}
												className='w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 cursor-pointer'
												style={{ aspectRatio: '16 / 9' }}
												loading="lazy"
												onClick={() => navigate(`/project/${item.id}`)}
												onError={(e) => {
													e.currentTarget.onerror = null
													e.currentTarget.src = noImage
												}}
											/>
											{/* 호버 시 그라데이션 오버레이 */}
											                          {/* 그라데이션 오버레이 */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg'></div>

											{/* 프로그래스 바 - 이미지 하단 border처럼 */}
											<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
												<div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${rate}%` }} />
											</div>
										</div>
									</div>

									{/* 타이틀 */}
									<h3 className='text-base sm:text-[18px] font-bold line-clamp-2 mb-0 transition-colors duration-300 group-hover:text-purple-600'>
										<span className='cursor-pointer' onClick={() => navigate(`/project/${item.id}`)}>{item.title}</span>
									</h3>

									{/* 작성자와 시작일 */}
									<div className='flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3'>
										<span className='flex items-center gap-1'>
											<i className='bi bi-person text-xs' />
											{creatorName}
										</span>
										<span className='flex items-center gap-1'>
											<i className='bi bi-calendar text-xs' />
											{createdDate}
										</span>
									</div>

									{/* 프로젝트 설명 */}
									<p className='text-sm text-gray-500 line-clamp-2 mb-2 sm:mb-3'>
										{item.content || item.shortDescription || item.description || item.summary || item.intro || '프로젝트 소개가 준비 중입니다.'}
									</p>

									{/* 진행률과 추천수 */}
									<div className='flex items-center justify-between text-xs sm:text-sm mb-2 sm:mb-3'>
										<span className='text-purple-600 font-semibold'>{rate}% 달성</span>
										<button
											className='flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer'
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
												handleLikeToggle(item.id, !!item.isLiked)
											}}
										>
											<i className={`text-xs transition-all duration-200 ${item.isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart'}`} />
											{/* <span className='text-xs'>{item?.recommendCount?.toLocaleString?.('ko-KR') ?? 0}</span> */}
										</button>
									</div>

									{/* 태그 */}
									<div className='flex flex-wrap gap-1.5 sm:gap-2'>
										{Array.isArray(item.tags) && item.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
											<span
												key={`tag-${tagIndex}`}
												className='inline-flex items-center text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full'
											>
												{tag}
											</span>
										))}
										{remain && (
											<span className='inline-flex items-center text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full'>
												{remain}
											</span>
										)}
									</div>
								</div>
							</div>
						)
								})}
								</div>
			</section>
	)
}

export default React.memo(NewProject)
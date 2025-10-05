import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import noImage from '../../../assets/images/noImage.jpg'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'

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
	const [projects, setProjects] = useState<any[]>([])
	const sliderRef = useRef<HTMLDivElement | null>(null)
	const [canPrev, setCanPrev] = useState(false)
	const [canNext, setCanNext] = useState(true)

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
			const data = await fetchProjectsFromServer({ order: 'CREATED', desc: true, pageCount: 4 })
			console.log('📦 서버에서 받아온 프로젝트:', data)
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
		
		const update = () => {
			setCanPrev(el.scrollLeft > 0)
			setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
		}
		
		// 초기 상태 업데이트를 위한 타이머
		const timer = setTimeout(update, 100)
		
		update()
		el.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		
		return () => {
			clearTimeout(timer)
			el.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [projects]) // projects가 로드된 후에 실행되도록 변경

		const getStep = () => {
			const el = sliderRef.current
			if (!el) return 0
			const first = el.querySelector<HTMLElement>(':scope > *')
			const gapPx = 20 // Tailwind gap-5 ≈ 20px
			const w = first ? first.getBoundingClientRect().width : el.clientWidth * 0.9
			return Math.max(0, Math.round(w + gapPx))
		}

		const goPrev = () => {
			const el = sliderRef.current
			if (!el) return
			el.scrollBy({ left: -getStep(), behavior: 'smooth' })
		}
		const goNext = () => {
			const el = sliderRef.current
			if (!el) return
			el.scrollBy({ left: getStep(), behavior: 'smooth' })
		}

	return (
			<section className='mt-10' data-aos='fade-up'>
				<div className='flex items-end justify-between mb-4'>
					<div>
						<h2 className='text-xl md:text-2xl font-bold m-0'>신규 프로젝트</h2>
						<p className='mt-1 text-xs text-gray-500 m-0'>방금 올라온 따끈한 프로젝트를 확인해보세요</p>
					</div>
					<a href='/search?order=CREATED' className='text-sm text-purple-600 hover:underline'>더 보기</a>
				</div>

						{projects.length === 0 && <p className='text-sm text-gray-500'>프로젝트가 없습니다.</p>}

								{/* Apple-like horizontal scroll slider (no blur, native scroll) */}
										<div className='relative'>
											<div 
												ref={sliderRef} 
												className='flex overflow-x-auto snap-x snap-proximity gap-5 pt-1 pr-16 md:pr-20 pb-16 md:pb-20 webkit-scrollbar-hidden'
												style={{
													...scrollbarHiddenStyle,
													WebkitOverflowScrolling: 'touch',
												}}
											>
							{projects.map((item) => {
						// titleImg can be a string or an object with uri
						const titleImgPath = item?.titleImg?.uri ? item.titleImg.uri : item.titleImg
						const imgSrc = titleImgPath ? `${baseUrl}/img/${titleImgPath}` : ''
						const rate = Math.max(0, Math.min(100, Math.round(item?.completionRate ?? 0)))
						const tagText = Array.isArray(item?.tags) && item.tags.length > 0 ? item.tags[0] : 'New'
						const remain = getRemainingText(item?.expired, item?.createdAt)
						const introText =
							item?.shortDescription || item?.description || item?.summary || item?.intro || '방금 등록된 프로젝트의 핵심 소개가 여기에 들어갑니다.'

						return (
							<div
								key={item.id}
								onClick={() => navigate(`/project/${item.id}`)}
														className='group block cursor-pointer rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white hover:ring-purple-300 hover:shadow-lg transition snap-center shrink-0 first:ml-px w-[85%] sm:w-[65%] md:w-[48%] lg:w-[32%] xl:w-[30%]'
							>
								<div className='relative w-full overflow-hidden' style={{ aspectRatio: '16 / 9' }}>
									<img
										src={imgSrc || noImage}
										alt={item.title}
										className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
										onError={(e) => {
											e.currentTarget.onerror = null
											e.currentTarget.src = noImage
										}}
									/>
									<div className='absolute top-3 right-3 z-10 flex gap-2'>
										<button className='w-9 h-9 grid place-items-center rounded-full bg-white/90 text-gray-800 hover:bg-white shadow'>
											<i className='bi bi-heart' />
										</button>
										<button className='w-9 h-9 grid place-items-center rounded-full bg-white/90 text-gray-800 hover:bg-white shadow'>
											<i className='bi bi-share' />
										</button>
									</div>
									<div className='absolute inset-x-0 bottom-0 p-3 flex items-center gap-2'>
										<span className='inline-flex items-center rounded-full text-xs px-2.5 py-1 bg-black/60 text-white backdrop-blur'>
											{tagText}
										</span>
										{remain && (
											<span className='inline-flex items-center rounded-full text-[11px] px-2 py-0.5 bg-white/80 text-gray-700 backdrop-blur'>{remain}</span>
										)}
									</div>
								</div>
								<div className='p-4'>
									<h3 className='text-base md:text-[1.05rem] font-bold line-clamp-2 min-h-[2.6em]'>{item.title}</h3>
									<p className='mt-1 text-xs text-gray-500 line-clamp-2'>{introText}</p>
									<div className='mt-3'>
										<div className='flex items-center justify-between text-sm font-semibold'>
											<span className='text-purple-600'>{rate}% 달성</span>
											{Array.isArray(item?.tags) && item.tags[1] && (
												<span className='text-gray-600'>{item.tags[1]}</span>
											)}
										</div>
										<div className='mt-2 h-2 rounded-full bg-gray-100 overflow-hidden'>
											<div className={`h-full ${gradients}`} style={{ width: `${rate}%` }} />
										</div>
									</div>
									<div className='mt-4 flex items-center justify-between text-xs text-gray-500'>
										<div className='flex items-center gap-1.5'>
											<i className='bi bi-people text-gray-400 text-sm' />
											<span>추천 {item?.recommendCount?.toLocaleString?.('ko-KR') ?? 0}</span>
										</div>
										{remain && (
											<div className='flex items-center gap-1.5'>
												<i className='bi bi-clock text-gray-400 text-sm' />
												<span>{remain}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						)
								})}
								</div>

								{/* Bottom-right nav buttons */}
											<div className='pointer-events-none absolute right-4 md:right-6 bottom-4 md:bottom-6 flex items-center gap-2'>
									<button
										aria-label='Previous'
										className={`pointer-events-auto w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow grid place-items-center hover:bg-white ${!canPrev ? 'opacity-40 cursor-default' : ''}`}
										onClick={goPrev}
										disabled={!canPrev}
									>
										<i className='bi bi-chevron-left' />
									</button>
									<button
										aria-label='Next'
										className={`pointer-events-auto w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow grid place-items-center hover:bg-white ${!canNext ? 'opacity-40 cursor-default' : ''}`}
										onClick={goNext}
										disabled={!canNext}
									>
										<i className='bi bi-chevron-right' />
									</button>
								</div>
							</div>
			</section>
	)
}

export default NewProject

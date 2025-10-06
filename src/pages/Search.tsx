import React, { useEffect, useState, useRef, useCallback } from 'react'
import noImage from '../assets/images/noImage.jpg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { useSearchParams } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { fetchProjectsFromServer } from '../hooks/fetchProjectsFromServer'
import CategoryBar from '../components/UI/shared/CategoryBar'
import { api } from '../AxiosInstance'

// git 오류 체크용

type ProjectItem = {
  id: number
  title: string
  titleImg: string
  completionRate: number
  recommendCount?: number
  userCount: number
  tags: string[]
  createdAt: string
  expired: string
  isExpired: boolean
  isRecommend: boolean
  // 소개 텍스트를 위한 임시 필드들
  shortDescription?: string
  description?: string
  summary?: string
  intro?: string
  likeCount?: number
  viewCount?: number
  isLiked?: boolean // 좋아요 상태 추가
}

const categories = [
	{ label: '전체', icon: 'bi bi-circle', tag: '' },
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

const orderOptions = [
	{ value: 'RECOMMEND', label: '추천순' },
	{ value: 'COMPLETION', label: '달성률순' },
	{ value: 'USER', label: '유저순' },
	{ value: 'CREATED', label: '생성일순' },
]

const Search: React.FC = () => {
	// Per-card hover state for transition delay
	const [hoveredCards, setHoveredCards] = useState<{ [key: number]: boolean }>({});
	const [searchParams] = useSearchParams()
	const location = useLocation()
	const tagFromState = location.state as string | undefined
	const initialTag = tagFromState || searchParams.get('tag') || ''
	const [tag, setTag] = useState(initialTag)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const [projects, setProjects] = useState<ProjectItem[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const [order, setOrder] = useState('RECOMMEND')
	const [page, setPage] = useState('0')
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	//const [tag, setTag] = useState('');
	const orderIndex = orderOptions.findIndex((opt) => opt.value === order)

	const navigate = useNavigate()
	const { isLoggedIn } = useAuth()
	const [hasMore, setHasMore] = useState(true)
	const observer = useRef<IntersectionObserver | null>(null)
	const lastProjectRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return
			if (observer.current) observer.current.disconnect()

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					// Prevent duplicate calls to page 1
					const nextPage = parseInt(page) + 1
					if (page !== '0' || nextPage > 1) {
						setPage((prev) => (parseInt(prev) + 1).toString())
					}
				}
			})

			if (node) observer.current.observe(node)
		},
		[loading, hasMore]
	)

	// 검색 키워드 저장
	useEffect(() => {
		const keyword = searchParams.get('search')
		setSearchTerm(keyword ?? '')
	}, [searchParams])

	useEffect(() => {
		const newTag = searchParams.get('tag')
		if (newTag !== tag) {
			setTag(newTag || '')
		}
	}, [searchParams])

	useEffect(() => {
		// tag나 order가 변경될 때만 fetchProjects 호출
		if (tag || order || searchTerm) {
			setProjects([])
			setHasMore(true)
			fetchProjects()
		}
	}, [tag, order, searchTerm])

	useEffect(() => {
		// 페이지가 변경될 때만 fetchProjects 호출
		if (page && page !== '0') {
			fetchProjects()
		}
	}, [page])

	const getRemainingDays = (expiredDateStr: string, createdDateStr: string): string => {
		const today = new Date()
		const expiredDate = new Date(expiredDateStr)
		const createdDate = new Date(createdDateStr)

		// 남은 일수 계산 (현재 시간 기준)
		const diffTime = expiredDate.getTime() - today.getTime()
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		// 생성일로부터 24시간 이내면 NEW
		const createdDiff = today.getTime() - createdDate.getTime()
		const createdHours = Math.floor(createdDiff / (1000 * 60 * 60))

		return createdHours <= 24 ? 'New' : diffDays < 0 ? '마감' : `${diffDays}일 남음`
	}

	const fetchProjects = async () => {
		try {
			setLoading(true) // 🔐 로딩 시작
			const loadProjects = async () => {
				const data = await fetchProjectsFromServer({
					order: order || 'RECOMMEND',
					page: 0,
					search: searchTerm,
					desc: false,
					tag: tag !== null && tag !== undefined && !isNaN(parseInt(tag)) ? parseInt(tag) : undefined,
				})
				console.log('📦 서버에서 받아온 프로젝트:', data)
				if (Array.isArray(data)) {
					// 더미 소개 텍스트 배열
					const dummyDescriptions = [
						'혁신적인 아이디어로 새로운 가치를 창조하는 프로젝트입니다. 많은 관심과 참여 부탁드려요!창의적인 디자인과 실용성을 결합한 제품으로, 새로운 경험을 선사합니다',
						'일상을 더욱 편리하게 만드는 스마트한 솔루션을 제안합니다. 함께 미래를 만들어가요!',
						'창의적인 디자인과 실용성을 결합한 제품으로, 새로운 경험을 선사합니다.',
						'지속가능한 미래를 위한 친환경 프로젝트입니다. 작은 변화가 큰 차이를 만들어냅니다.',
						'사용자 중심의 인터페이스와 뛰어난 기능성으로 완성된 혁신적인 서비스입니다.',
						'품질과 디자인을 모두 만족시키는 프리미엄 제품을 선보입니다.',
						'커뮤니티와 함께 성장하는 소셜 플랫폼으로, 새로운 연결의 가치를 제공합니다.',
						'건강하고 활기찬 라이프스타일을 위한 맞춤형 솔루션을 제안합니다.',
						'전문가의 노하우가 담긴 고품질 콘텐츠와 서비스를 만나보세요.',
						'모든 연령대가 함께 즐길 수 있는 재미있고 유익한 경험을 제공합니다.'
					]
					
					// 더미 소개 텍스트 추가
					const projectsWithIntro = data.map((project: any, index: number) => ({
						...project,
						shortDescription: project.shortDescription || 
							project.description || 
							project.summary || 
							project.intro || 
							dummyDescriptions[index % dummyDescriptions.length]
					}))
					setProjects(projectsWithIntro)
				}
			}
			await Promise.all([loadProjects(), new Promise((resolve) => setTimeout(resolve, 500))])
		} catch (error) {
			console.error('프로젝트 불러오기 실패:', error)
			setError('프로젝트 불러오기 실패')
		} finally {
			setLoading(false)
		}
	}

	// 좋아요 토글 API 함수 (api 인스턴스, withCredentials만 사용)
	const toggleProjectLike = async (projectId: number, like: boolean) => {
		try {
			const url = `${baseUrl}/social/user/like`;
			const res = await api.post(url, { like, projectId }, { withCredentials: true })
			if (res.data.message === 'success') {
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
		await toggleProjectLike(projectId, !current)
	}

	return (
		<div className="px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]">
			{/* 모바일/데스크톱 모두 메인페이지와 동일한 카테고리바 디자인 적용 */}
			<div className="mt-4">
				<CategoryBar
					categories={categories}
					value={tag}
					onChange={(t: string) => setTag(t)}
					className="px-0 py-0"
				/>
			</div>
			<div className='relative flex bg-gray-100 rounded-2xl mb-5 overflow-hidden'>
				<div
					className='absolute top-0 left-0 w-1/4 h-full bg-purple-500 border-2 border-blue-400 rounded-2xl transition-transform duration-300 ease z-0'
					style={{ transform: `translateX(${orderIndex * 100}%)` }}
				/>
				{orderOptions.map((opt) => (
					<button
						key={opt.value}
						onClick={() => setOrder(opt.value)}
						className={`flex-1 py-3 bg-transparent border-none text-sm text-gray-500 font-bold cursor-pointer whitespace-nowrap z-10 relative ${
							order === opt.value ? 'text-white' : ''
						}`}>
						{opt.label}
					</button>
				))}
			</div>
			{loading && (
				<div className='fixed inset-0 w-full min-h-screen flex flex-col justify-center items-center z-[1000]'>
					<div className='absolute inset-0 bg-white bg-opacity-70 pointer-events-none'></div>
					<div className='flex justify-center items-center mt-4 relative z-10'>
						<span className='w-2.5 h-2.5 bg-purple-500 rounded-full mx-1.5 animate-wave'></span>
						<span className='w-2.5 h-2.5 bg-purple-500 rounded-full mx-1.5 animate-wave' style={{ animationDelay: '0.15s' }}></span>
						<span className='w-2.5 h-2.5 bg-purple-500 rounded-full mx-1.5 animate-wave' style={{ animationDelay: '0.3s' }}></span>
					</div>
				</div>
			)}
			<div className='flex items-center gap-2.5'>
				{searchTerm && (
					<div className='flex items-center mb-4 text-2xl font-bold text-gray-500'>
						<span className='mr-2 text-black'>{searchTerm}</span> 검색 결과
						<button className='bg-none border-none cursor-pointer p-0 ml-2' onClick={() => setSearchTerm('')}>
							<i className='bi bi-x'></i>
						</button>
					</div>
				)}
			</div>
			{projects.length === 0 && !loading && (
				<div className='text-center py-16 text-gray-500 bg-white rounded-2xl min-h-[calc(100vh-180px)] flex flex-col justify-center items-center shadow-sm'>
					<i className='bi bi-search text-4xl font-bold'></i>
					<p className='text-xl text-gray-500 font-bold mt-2'>검색 결과가 없습니다.</p>
				</div>
				)}
			{projects.length > 0 && (
				<div>
					총 <strong>{projects.length}</strong>개의 프로젝트가 있습니다.
				</div>
			)}
			{/* {error && <ErrorText>{error}</ErrorText>} */}

			{/* 모바일 리스트 뷰 */}
			<div className="block sm:hidden">
				{projects.map((item) => (
					<div key={item.id} className="flex items-center bg-white rounded-2xl shadow-sm mb-4 p-3">
						<img
							src={item.titleImg ? `${baseUrl}/img/${item.titleImg}` : noImage}
							alt={item.title}
							className="w-24 h-24 object-cover rounded-xl mr-3"
							onError={(e) => {
								e.currentTarget.onerror = null
								e.currentTarget.src = noImage
							}}
						/>
						<div className="flex-1 flex flex-col justify-between h-full">
							<div className="flex justify-between items-start">
								<h3 className="text-base font-bold text-gray-900 line-clamp-2 mr-2">{item.title}</h3>
								{/* 모바일 리스트 뷰 좋아요 버튼 스타일 수정: 항상 정사각형 원 유지 */}
<button
  className="w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500 group"
  style={{ background: 'none', border: 'none', boxShadow: 'none' }}
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    handleLikeToggle(item.id, !!item.isRecommend)
  }}
>
  <i className={`text-base transition-all duration-200 group-hover:scale-150 group-hover:text-red-500 ${item.isRecommend ? 'bi-heart-fill text-red-500' : 'bi-heart'}`} />
</button>
							</div>
							<p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.shortDescription}</p>
							<div className="flex flex-wrap gap-1 mt-2">
								{Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag, tagIndex) => (
									<span key={tagIndex} className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
								))}
							</div>
							<div className="flex items-center justify-between text-xs text-gray-500 mt-2">
								<span>{getRemainingDays(item.expired, item.createdAt)}</span>
								<span className="text-purple-600 font-semibold">{Math.round(item.completionRate ?? 0)}% funded</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* 데스크톱 카드 그리드 */}
			<div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-x-4 gap-y-12 justify-between relative z-0" style={{ overflow: 'visible', zoom: 0.9 }}>
				{projects.map((item, index) => {
					const isLast = index === projects.length - 1
					const rate = Math.max(0, Math.min(100, Math.round(item.completionRate ?? 0)))
					const remainingText = getRemainingDays(item.expired, item.createdAt)
					const imgSrc = item.titleImg ? `${baseUrl}/img/${item.titleImg}` : ''
					const introText = item.shortDescription || '간단한 소개가 준비 중이에요. 프로젝트 상세 페이지에서 더 많은 정보를 확인해 보세요.'

					const getProgressColor = (percent: number) => {
						if (percent >= 80) return 'from-purple-500 to-purple-600'
						if (percent >= 60) return 'from-indigo-500 to-indigo-600'
						if (percent >= 40) return 'from-blue-500 to-blue-600'
						if (percent >= 20) return 'from-sky-500 to-sky-600'
						return 'from-gray-400 to-gray-500'
					}

								return (
									<div
										key={item.id}
										ref={isLast ? lastProjectRef : undefined}
										className='group bg-transparent rounded-2xl overflow-visible relative hover:z-[9999] cursor-pointer'
										style={{
											'--expanded-height': '200px',
											'transitionProperty': 'all',
											'transitionDuration': hoveredCards[item.id] ? '200ms' : '0ms',
											'zIndex': 'var(--z-index, 0)',
											'--z-index': '0'
										} as React.CSSProperties}
										onMouseEnter={(e) => {
											setHoveredCards((prev) => ({ ...prev, [item.id]: true }));
											const element = e.currentTarget as HTMLElement;
											if (element && element.style) {
												element.style.setProperty('--z-index', '9999');
											}
										}}
										onMouseLeave={(e) => {
											setHoveredCards((prev) => ({ ...prev, [item.id]: false }));
											const element = e.currentTarget as HTMLElement;
											if (element && element.style) {
												// Remove z-index immediately
												element.style.setProperty('--z-index', '0');
											}
										}}
									>
							{/* 호버 시 전체 확장된 카드의 통합 배경 */}
							<div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 rounded-2xl group-hover:rounded-b-none group-hover:shadow-2xl transition-all duration-300 ease-out z-10'></div>
											{/* 호버 시 카드 하단 확장 배경 - 위에서 아래로 내려오는 슬라이드 효과 */}
											<div
												className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-2xl max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-2xl z-10'
												style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
											>
								{/* 숨겨진 내용으로 높이 결정 - 좌우 패딩 없이 */}
								<div className='invisible py-4 px-0 space-y-3'>
									<p className='text-sm text-gray-600 leading-relaxed'>
										{introText}
									</p>
									<div className='flex flex-wrap gap-2'>
										{Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
											<span 
												key={`hidden-${tagIndex}`}
												className='inline-flex items-center text-xs font-medium text-white bg-gray-600 px-2.5 py-1 rounded-full'
											>
												{tag}
											</span>
										))}
										<span className='inline-flex items-center text-xs font-medium text-white bg-gray-600 px-2.5 py-1 rounded-full'>
											Redondo Beach, CA
										</span>
									</div>
								</div>
							</div>
							
							<div className='relative z-10 p-4'>
								<a href={`/project/${item.id}`} className='block'>
									{/* 이미지와 프로그래스바 영역 */}
									<div className='flex mb-4 gap-0 rounded-xl overflow-hidden'>
										<div className='flex-1 relative overflow-hidden rounded-l-xl'>
											<img
												src={imgSrc || noImage}
												alt={item.title}
												className='w-full object-cover transition-all duration-500 ease-out group-hover:scale-105'
												style={{ aspectRatio: '16 / 9' }}
												onError={(e) => {
													e.currentTarget.onerror = null
													e.currentTarget.src = noImage
												}}
											/>
											<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out' />
																	{/* 데스크톱 카드 그리드 좋아요 버튼: 배경 원, 테두리, 그림자 모두 제거하고 하트 아이콘만 남김 */}
<button
  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500"
  style={{ background: 'none', border: 'none', boxShadow: 'none' }}
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    handleLikeToggle(item.id, !!item.isLiked)
  }}
>
  <i className={`text-base transition-all duration-200 hover:scale-125 hover:text-red-500 ${item.isLiked ? 'bi-heart-fill text-red-500' : 'bi-heart'}`} />
</button>
										</div>
										
										   {/* 프로그래스바 - 이미지 바로 옆에 붙임 */}
										   <div className='w-2 relative overflow-visible transition-all duration-150 ease group/progress cursor-pointer'>
											   <div className='bg-gray-50 relative rounded-r-xl w-2 h-full flex flex-col-reverse transition-all duration-200 group-hover/progress:bg-gray-200 group-hover/progress:w-3'>
												   <div
													   className={`w-full bg-gradient-to-t ${getProgressColor(rate)} transition-all duration-300 ease-out rounded-r-xl relative overflow-hidden group-hover/progress:shadow-lg`}
													   style={{ height: `${rate ?? 0}%` }}
												   >
													   <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 group-hover/progress:opacity-100' />
												   </div>
											   </div>
											   {/* 툴팁 말풍선 - 항상 오른쪽에 표시 */}
											   <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover/progress:opacity-100 transition-all duration-200 ease-out z-[99999]">
												   <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap relative flex items-center">
													   <span className="font-bold">{rate ?? 0}%</span>
													   <span className="ml-2 text-gray-300">{item.userCount || 0}명 참여</span>
													   {/* 오른쪽 화살표 */}
													   <span className="ml-2 w-0 h-0 border-l-[6px] border-l-gray-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></span>
												   </div>
											   </div>
										   </div>
									</div>
								</a>
									
									<div className='space-y-2 relative'>
										<a href={`/project/${item.id}`} className='block group/title'>
											  <h3 className='text-lg font-bold text-gray-900 leading-tight line-clamp-2 hover:scale-[1.02] transition-all duration-250 ease-out'>
												{item.title}
											</h3>
										</a>
										
																									<div className='text-xs text-gray-600 transition-all duration-200 ease-in-out hover:text-purple-600 hover:underline cursor-pointer'>
																										Big Thinker
																									</div>
										
										<div className='flex items-center justify-between text-xs text-gray-500 mb-2 mt-2'>
											<span>{remainingText && remainingText !== '마감' ? remainingText : '진행 중'}</span>
											<span className='text-purple-600 font-semibold'>{rate}% funded</span>
										</div>

										{/* 호버 시 확장 내용 - 최상위 레벨에서 렌더링 */}
										<div className='absolute left-0 right-0 top-full opacity-0 group-hover:opacity-100 transition-all duration-250 z-20' style={{ marginTop: '-1px' }}>
											<div className='py-4 px-0 space-y-3'>
												<p className='text-sm text-gray-600 leading-relaxed'>
													{introText}
												</p>
												
												<div className='flex flex-wrap gap-2'>
													{Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
														<span 
															key={tagIndex}
															className='inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full transition-all duration-250 ease-out cursor-pointer'
														>
															{tag}
														</span>
													))}
												</div>
											</div>	
										</div>
									</div>
								</div>



						</div>
					)
				})}
			</div>

		</div>
	)
}

export default Search

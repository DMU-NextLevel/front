import React, { useEffect, useState, useRef, useCallback } from 'react'
import noImage from '../assets/images/noImage.jpg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { useSearchParams } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { fetchProjectsFromServer, ProjectResponseData } from '../hooks/fetchProjectsFromServer'
import CategoryBar from '../components/UI/shared/CategoryBar'
import { api } from '../AxiosInstance'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

type ProjectItem = {
  id: number
  title: string
  content?: string // 프로젝트 소개글
  titleImg: {
    id: number
    uri: string
  }
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
  author?: {
    name: string
    nickName: string
  }
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
	const [searchInput, setSearchInput] = useState<string>('')

	const [projects, setProjects] = useState<ProjectItem[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const [completedProjects, setCompletedProjects] = useState<ProjectItem[]>([])
	const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false)
	const [completedTotalCount, setCompletedTotalCount] = useState(0)

	const [order, setOrder] = useState(() => {
		const orderParam = searchParams.get('order')
		// NEW 파라미터는 CREATED로 매핑
		if (orderParam === 'NEW') return 'CREATED'
		// 유효한 order 값인지 확인
		return orderOptions.some(opt => opt.value === orderParam) ? orderParam : 'RECOMMEND'
	})
	const [currentPage, setCurrentPage] = useState(0) // 현재 페이지
	const [hasNextPage, setHasNextPage] = useState(true) // 다음 페이지 존재 여부
	const [loadingMore, setLoadingMore] = useState(false) // 더 보기 로딩 상태
	const [totalCount, setTotalCount] = useState(0) // 전체 프로젝트 개수
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	//const [tag, setTag] = useState('');
	const orderIndex = orderOptions.findIndex((opt) => opt.value === order)

	const navigate = useNavigate()
	const { isLoggedIn } = useAuth()

	// 검색 키워드 저장
	useEffect(() => {
		const keyword = searchParams.get('search')
		const searchKeyword = keyword ?? ''
		setSearchTerm(searchKeyword)
		setSearchInput(searchKeyword)
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
			fetchProjects(0, false)
		}
	}, [tag, order, searchTerm])

	const getRemainingDays = (expiredDateStr: string, createdDateStr: string): string => {
		const today = new Date()

		// 날짜 문자열 유효성 검증
		const expiredDate = new Date(expiredDateStr)
		const createdDate = new Date(createdDateStr)

		// 유효하지 않은 날짜인 경우 기본값 반환
		if (isNaN(expiredDate.getTime()) || isNaN(createdDate.getTime())) {
			return '진행 중'
		}

		// 남은 일수 계산 (현재 시간 기준)
		const diffTime = expiredDate.getTime() - today.getTime()
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		// 생성일로부터 24시간 이내면 NEW
		const createdDiff = today.getTime() - createdDate.getTime()
		const createdHours = Math.floor(createdDiff / (1000 * 60 * 60))

		return createdHours <= 24 ? 'New' : diffDays < 0 ? '마감' : `${diffDays}일 남음`
	}

	// 시작일 표시 함수 (메인페이지 스타일)
	const getStartDateText = (createdAt?: string): string => {
		if (!createdAt) return '진행 중'
		const today = new Date()
		const created = new Date(createdAt)
		const diffTime = today.getTime() - created.getTime()
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
		return diffDays === 0 ? '오늘 시작' : `${diffDays}일전 시작`
	}

	const fetchProjects = async (page: number = 0, append: boolean = false) => {
		try {
			if (page === 0) {
				setLoading(true) // 첫 페이지 로딩
				setCurrentPage(0)
				setHasNextPage(true)
			} else {
				setLoadingMore(true) // 추가 페이지 로딩
			}

			// 완료된 프로젝트 로드 (첫 페이지일 때만)
			const loadCompletedProjects = async () => {
				if (page === 0) {
					setLoadingCompleted(true)
					try {
						const data = await fetchProjectsFromServer({
							order: order || 'RECOMMEND',
							page: 0,
							search: searchTerm,
							desc: false,
							tag: tag !== null && tag !== undefined && !isNaN(parseInt(tag)) ? parseInt(tag) : undefined,
							pageCount: 1000, // 완료된 프로젝트는 많이 가져옴
							returnFullResponse: true,
							status: ['SUCCESS', 'FAIL', 'END'],
						}) as ProjectResponseData
						if (data && data.projects && Array.isArray(data.projects)) {
							// 더미 소개 텍스트 추가 (동일)
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

							const completedWithIntro = data.projects.map((project: any, index: number) => ({
								...project,
								shortDescription: project.content ||
									project.shortDescription ||
									project.description ||
									project.summary ||
									project.intro ||
									dummyDescriptions[index % dummyDescriptions.length]
							}))

							setCompletedProjects(completedWithIntro)
						} else {
							setCompletedProjects([])
						}
						// 완료된 프로젝트 총 개수 설정
						setCompletedTotalCount(data.totalCount || 0)
					} catch (error) {
						Swal.fire({
							icon: 'error',
							title: 'Error',
							text: '잠시 후 다시 시도해주세요. 계속 발생시 관리자에게 문의해주세요.',
							confirmButtonColor: '#a66bff',
							confirmButtonText: '확인',
						})
						setCompletedProjects([])
						setCompletedTotalCount(0)
					} finally {
						setLoadingCompleted(false)
					}
				}
			}

			const loadProjects = async () => {
				const data = await fetchProjectsFromServer({
					order: order || 'RECOMMEND',
					page: page,
					search: searchTerm,
					desc: (order === 'COMPLETION' || order === 'RECOMMEND' || order === 'CREATED' || order === 'USER') ? true : false, // 달성률순, 추천순, 생성일순, 유저순은 역순(내림차순)으로
					tag: tag !== null && tag !== undefined && !isNaN(parseInt(tag)) ? parseInt(tag) : undefined,
					pageCount: 8,
					returnFullResponse: true,
				}) as ProjectResponseData
				if (data && data.projects && Array.isArray(data.projects)) {
					// totalCount 설정
					setTotalCount(data.totalCount || 0)

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
					const projectsWithIntro = data.projects.map((project: any, index: number) => ({
						...project,
						shortDescription: project.content ||
							project.shortDescription ||
							project.description ||
							project.summary ||
							project.intro ||
							dummyDescriptions[(page * 12 + index) % dummyDescriptions.length]
					}))

					// 데이터가 8개 미만이면 다음 페이지가 없음
					if (data.projects.length < 8) {
						setHasNextPage(false)
					}

					if (append) {
						// 기존 데이터에 추가
						setProjects(prev => [...prev, ...projectsWithIntro])
					} else {
						// 새 데이터로 교체
						setProjects(projectsWithIntro)
					}
				} else {
					// 데이터가 없으면 다음 페이지 없음
					setHasNextPage(false)
					setTotalCount(0)
					if (!append) {
						setProjects([])
					}
				}
			}
			await Promise.all([loadProjects(), loadCompletedProjects(), new Promise((resolve) => setTimeout(resolve, page === 0 ? 500 : 200))])
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: '잠시 후 다시 시도해주세요. 계속 발생시 관리자에게 문의해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			setError('프로젝트 불러오기 실패')
			setHasNextPage(false)
		} finally {
			setLoading(false)
			setLoadingMore(false)
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
			toast.error('좋아요 토글 실패')
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

	// 검색 핸들러
	const handleSearch = () => {
		const trimmedSearch = searchInput.trim()
		setSearchTerm(trimmedSearch)
		// URL 파라미터 업데이트
		const newSearchParams = new URLSearchParams(searchParams)
		if (trimmedSearch) {
			newSearchParams.set('search', trimmedSearch)
		} else {
			newSearchParams.delete('search')
		}
		// URL 업데이트 (페이지 리로드 없이)
		window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`)
	}

	// Enter 키 입력 핸들러
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 검색어 초기화 핸들러
	const handleReset = () => {
		setSearchInput('')
		setSearchTerm('')
		const newSearchParams = new URLSearchParams(searchParams)
		newSearchParams.delete('search')
		window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`)
	}

	return (
		<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
			{/* 모바일/데스크톱 모두 메인페이지와 동일한 카테고리바 디자인 적용 */}



			{/* 검색 섹션 - 좌측 정렬 */}
			<div className='mt-8 mb-6'>
				<div className='flex flex-col lg:flex-row lg:items-center gap-4'>
					<div className='flex-1'>
						<h2 className='text-2xl font-bold text-gray-900 mb-2'>어떤 프로젝트를 찾고 계신가요?</h2>
						<p className='text-gray-600'>관심있는 키워드를 입력해 보세요</p>
					</div>
					{/* 검색바 영역 */}
					<div className='flex items-center gap-2'>
						{/* 검색바 컨테이너 - 항상 표시 */}
						<div className='relative w-96'>
							{/* 검색바 */}
							<div className='relative w-96 lg:flex-shrink-0'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<i className='bi bi-search text-gray-400'></i>
								</div>
								<input
									type='text'
									placeholder='프로젝트 검색...'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className='w-full pl-9 pr-9 py-3 text-sm border border-gray-200 rounded-full focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 bg-white shadow-sm'
									autoFocus
								/>
								{searchInput && (
									<button
										onClick={handleReset}
										className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								)}
								{searchInput && (
									<button
										onClick={handleSearch}
										className='absolute inset-y-0 right-8 pr-3 flex items-center text-purple-500 hover:text-purple-700 transition-colors duration-200'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
										</svg>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

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
						<button className='bg-none border-none cursor-pointer p-0 ml-2' onClick={() => {
							setSearchTerm('')
							setSearchInput('')
							const newSearchParams = new URLSearchParams(searchParams)
							newSearchParams.delete('search')
							window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams}`)
						}}>
							<i className='bi bi-x'></i>
						</button>
					</div>
				)}
			</div>
			{/* {error && <ErrorText>{error}</ErrorText>} */}

			{/* 최상단 총 프로젝트 개수 표시 */}
			{(projects.length > 0 || completedProjects.length > 0) && (
				<div className="mb-6">
					총 <strong>{totalCount + completedTotalCount}</strong>개의 프로젝트가 있습니다.
				</div>
			)}

			{/* 아이템 리스트 컨테이너 - 최소 높이 설정 */}
			<div className={`min-h-[160px] -mx-4 ${projects.length === 0 && !loading ? 'flex items-center justify-center' : ''}`}>
				{projects.length === 0 && !loading && (
					<div className='text-center text-gray-500 py-[100px]'>
						<i className='bi bi-search text-6xl mb-4'></i>
						<p className='text-xl font-bold'>검색 결과가 없습니다.</p>
						<p className='text-gray-400 mt-2'>다른 검색어로 시도해보세요.</p>
					</div>
				)}
				{projects.length > 0 && (
					<div className="mb-6">
						<h2 className="text-xl font-bold text-gray-900 ml-[16px] pb-2 border-b border-gray-200">진행중인 프로젝트 ({totalCount}개)</h2>
					</div>
				)}
				{/* 모바일 리스트 뷰 */}
				<div className="block sm:hidden pb-[100px]">
					{projects.map((item) => (
					<div key={item.id} className="flex items-center bg-white rounded-2xl shadow-sm mb-4 p-3">
						<img
							src={item.titleImg ? `${baseUrl}/img/${item.titleImg.uri}` : noImage}
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
  className="w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500 group relative"
  style={{ background: 'none', border: 'none', boxShadow: 'none' }}
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    handleLikeToggle(item.id, !!item.isRecommend)
  }}
>
  <i className={`text-base transition-all duration-200 group-hover:scale-150 group-hover:text-red-500 relative z-10 ${item.isRecommend ? 'bi-heart-fill text-red-500 group-hover:brightness-75' : 'bi-heart group-hover:brightness-75'}`} />
</button>
							</div>
							{/* 작성자와 시작일/진행률을 한 줄에 배치 */}
							<div className='flex items-center justify-between text-xs mb-1'>
								{/* 좌측: 작성자 */}
								<div className='text-gray-400 font-bold'>
									{item.author?.nickName || '익명'}
								</div>
								{/* 우측: 시작일과 진행률 */}
								<div className='text-gray-600 font-bold flex items-center gap-2'>
									<span className='flex items-center gap-1'>
										<svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
										</svg>
										{getStartDateText(item.createdAt)}
									</span>
									{' · '}
									<span className='text-purple-600 font-semibold'>{Math.round(item.completionRate ?? 0)}% 달성</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* 데스크톱 카드 그리드 */}
			<div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-x-2 gap-y-10 justify-between relative z-0 pb-[100px]" style={{ overflow: 'visible', zoom: 0.9 }}>
				{projects.map((item, index) => {
					const rate = Math.max(0, Math.min(100, Math.round(item.completionRate ?? 0)))
					const remainingText = getRemainingDays(item.expired, item.createdAt)
					const imgSrc = item.titleImg ? `${baseUrl}/img/${item.titleImg.uri}` : ''
					const introText = item.shortDescription || '간단한 소개가 준비 중이에요. 프로젝트 상세 페이지에서 더 많은 정보를 확인해 보세요.'

					const getProgressColor = (percent: number) => {
						if (percent >= 80) return { background: '#8B5CF6' }
						if (percent >= 60) return { background: '#9D6BFF' }
						if (percent >= 40) return { background: '#B794FF' }
						if (percent >= 20) return { background: '#C4B5FD' }
						return { background: '#9CA3AF' }
					}

								return (
									<div
										key={item.id}
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
							<div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 rounded-t-2xl group-hover:rounded-b-none group-hover:shadow-lg transition-all duration-300 ease-out z-10'></div>
											{/* 호버 시 카드 하단 확장 배경 - 위에서 아래로 내려오는 슬라이드 효과 */}
											<div
												className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-2xl max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-lg z-10'
												style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
											>
								{/* 숨겨진 내용으로 높이 결정 - 좌우 패딩 없이 */}
								<div className='invisible py-4 px-0 space-y-3'>
									<div className='text-sm text-gray-600 line-clamp-2'>
										{item.content || item.shortDescription || item.description || item.summary || item.intro || '프로젝트 소개가 준비 중입니다.'}
									</div>
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
									<div className='flex mb-4 gap-0 rounded-sm overflow-hidden'>
										<div className='flex-1 relative overflow-hidden rounded-t-lg border border-gray-200'>
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
											<div className='absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out' />
											{/* 데스크톱 카드 그리드 좋아요 버튼: 배경 원, 테두리, 그림자 모두 제거하고 하트 아이콘만 남김 */}
											<button
											  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500 group"
											  style={{ background: 'none', border: 'none', boxShadow: 'none' }}
											  onClick={(e) => {
											    e.preventDefault()
											    e.stopPropagation()
											    handleLikeToggle(item.id, !!item.isLiked)
											  }}
											>
											  <i className={`text-base transition-all duration-200 hover:scale-125 hover:text-red-500 relative z-10 ${item.isLiked ? 'bi-heart-fill text-red-500 hover:brightness-75' : 'bi-heart hover:brightness-75'}`} />
											</button>

											{/* 프로그래스 바 - 이미지 하단 border처럼 */}
											<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
												<div className={`h-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 transition-all duration-300`} style={{ width: `${rate ?? 0}%` }} />
											</div>
										</div>
									</div>
								</a>

									<div className='space-y-2 relative'>
										<a href={`/project/${item.id}`} className='block group/title'>
											  <h3 className='text-base font-bold text-gray-900 leading-tight line-clamp-2 hover:scale-[1.02] transition-all duration-250 ease-out'>
												{item.title}
											</h3>
										</a>

										{/* 작성자와 시작일/진행률을 한 줄에 배치 */}
										<div className='flex items-center justify-between text-xs mb-2'>
											{/* 좌측: 작성자 */}
											<div className='text-gray-400 font-bold'>
												{item.author?.nickName || '익명'}
											</div>
											{/* 우측: 시작일과 진행률 */}
											<div className='text-gray-600 font-bold flex items-center gap-2'>
												<span className='flex items-center gap-1'>
													<svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
														<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
													</svg>
													{getStartDateText(item.createdAt)}
												</span>
												{' · '}
												<span className='text-purple-600 font-semibold'>{rate}% 진행</span>
											</div>
										</div>										{/* 호버 시 확장 내용 - 최상위 레벨에서 렌더링 */}
										<div className='absolute left-0 right-0 top-full opacity-0 group-hover:opacity-100 transition-all duration-250 z-20' style={{ marginTop: '-1px' }}>
											<div className='py-4 px-0 space-y-3'>
												<div className='text-sm text-gray-600 line-clamp-2'>
													{item.content || item.shortDescription || item.description || item.summary || item.intro || '프로젝트 소개가 준비 중입니다.'}
												</div>
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

			{/* banner removed here and will be re-inserted after the load-more button */}

					</div>
			{/* 더 보기 버튼 */}
			{hasNextPage && !loadingMore && (
				<div className="flex justify-center mt-8 mb-4">
					<button
						onClick={() => {
							const nextPage = currentPage + 1
							setCurrentPage(nextPage)
							fetchProjects(nextPage, true)
						}}
						className="bg-white hover:bg-[#A66CFF] text-gray-700 hover:text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={loadingMore}
					>
						{loadingMore ? '로딩 중...' : '프로젝트 더 보기'}
					</button>
				</div>
			)}
			</div>

			{/* 완료된 프로젝트 섹션 */}
			{completedProjects.length > 0 && (
				<div className="mt-12">
					<h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">완료된 프로젝트 ({completedTotalCount}개)</h2>
					<div className="min-h-[160px] -mx-4">
						{/* 모바일 완료된 프로젝트 리스트 뷰 */}
						<div className="block sm:hidden pb-[100px]">
							{completedProjects.map((item) => (
								<div key={`completed-${item.id}`} className="flex items-center bg-white rounded-2xl shadow-sm mb-4 p-3">
									<img
										src={item.titleImg ? `${baseUrl}/img/${item.titleImg.uri}` : noImage}
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
											{/* 모바일 완료된 프로젝트 좋아요 버튼 */}
											<button
												className="w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500 group relative"
												style={{ background: 'none', border: 'none', boxShadow: 'none' }}
												onClick={(e) => {
													e.preventDefault()
													e.stopPropagation()
													handleLikeToggle(item.id, !!item.isLiked)
												}}
											>
												<i className={`text-base transition-all duration-200 group-hover:scale-150 group-hover:text-red-500 relative z-10 ${item.isLiked ? 'bi-heart-fill text-red-500 group-hover:brightness-75' : 'bi-heart group-hover:brightness-75'}`} />
											</button>
										</div>
										{/* 작성자와 상태 표시 */}
										<div className='flex items-center justify-between text-xs mb-1'>
											<div className='text-gray-400 font-bold'>
												{item.author?.nickName || '익명'}
											</div>
											<div className='text-gray-600 font-bold flex items-center gap-2'>
												<span className='text-green-600 font-semibold'>완료됨</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* 데스크톱 완료된 프로젝트 카드 그리드 */}
						<div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-x-2 gap-y-10 justify-between relative z-0 pb-[100px]" style={{ overflow: 'visible', zoom: 0.9 }}>
							{completedProjects.map((item, index) => {
								const rate = Math.max(0, Math.min(100, Math.round(item.completionRate ?? 0)))
								const remainingText = getRemainingDays(item.expired, item.createdAt)
								const imgSrc = item.titleImg ? `${baseUrl}/img/${item.titleImg.uri}` : ''
								const introText = item.shortDescription || '완료된 프로젝트입니다.'

								return (
									<div
										key={`completed-${item.id}`}
										className='group bg-transparent rounded-2xl overflow-visible relative hover:z-[9999] cursor-pointer'
										style={{
											'--expanded-height': '200px',
											'transitionProperty': 'all',
											'transitionDuration': hoveredCards[item.id] ? '200ms' : '0ms',
											'zIndex': 'var(--z-index, 0)',
											'--z-index': '0'
										} as React.CSSProperties}
										onMouseEnter={(e) => {
											setHoveredCards((prev) => ({ ...prev, [`completed-${item.id}`]: true }));
											const element = e.currentTarget as HTMLElement;
											if (element && element.style) {
												element.style.setProperty('--z-index', '9999');
											}
										}}
										onMouseLeave={(e) => {
											setHoveredCards((prev) => ({ ...prev, [`completed-${item.id}`]: false }));
											const element = e.currentTarget as HTMLElement;
											if (element && element.style) {
												element.style.setProperty('--z-index', '0');
											}
										}}
									>
										{/* 호버 시 전체 확장된 카드의 통합 배경 */}
										<div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 rounded-t-2xl group-hover:rounded-b-none group-hover:shadow-lg transition-all duration-300 ease-out z-10'></div>
										{/* 호버 시 카드 하단 확장 배경 */}
										<div
											className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-2xl max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-lg z-10'
											style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
										>
											<div className='invisible py-4 px-0 space-y-3'>
												<div className='flex flex-wrap gap-2'>
													{Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
														<span
															key={`completed-hidden-${tagIndex}`}
															className='inline-flex items-center text-xs font-medium text-white bg-gray-600 px-2.5 py-1 rounded-full'
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										</div>

										<div className='relative z-10 p-4'>
											<a href={`/project/${item.id}`} className='block'>
												{/* 이미지 영역 */}
												<div className='flex mb-4 gap-0 rounded-sm overflow-hidden'>
													<div className='flex-1 relative overflow-hidden rounded-t-lg border border-gray-200'>
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
														<div className='absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out' />
														{/* 완료된 프로젝트 좋아요 버튼 */}
														<button
															className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-transparent border-none shadow-none p-0 m-0 hover:text-red-500 group"
															style={{ background: 'none', border: 'none', boxShadow: 'none' }}
															onClick={(e) => {
																e.preventDefault()
																e.stopPropagation()
																handleLikeToggle(item.id, !!item.isLiked)
															}}
														>
															<i className={`text-base transition-all duration-200 hover:scale-125 hover:text-red-500 relative z-10 ${item.isLiked ? 'bi-heart-fill text-red-500 hover:brightness-75' : 'bi-heart hover:brightness-75'}`} />
														</button>

														{/* 프로그래스 바 - 이미지 하단 border처럼 */}
														<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
															<div className={`h-full bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 transition-all duration-300`} style={{ width: '100%' }} />
														</div>
													</div>
												</div>
											</a>

											<div className='space-y-2 relative'>
												<a href={`/project/${item.id}`} className='block group/title'>
													<h3 className='text-base font-bold text-gray-900 leading-tight line-clamp-2 hover:scale-[1.02] transition-all duration-250 ease-out'>
														{item.title}
													</h3>
												</a>

												{/* 작성자와 상태 표시 */}
												<div className='flex items-center justify-between text-xs mb-2'>
													<div className='text-gray-400 font-bold'>
														{item.author?.nickName || '익명'}
													</div>
													<div className='text-gray-600 font-bold flex items-center gap-2'>
														<span className='text-green-600 font-semibold'>완료됨</span>
													</div>
												</div>

												{/* 호버 시 확장 내용 */}
												<div className='absolute left-0 right-0 top-full opacity-0 group-hover:opacity-100 transition-all duration-250 z-20' style={{ marginTop: '-1px' }}>
													<div className='py-4 px-0 space-y-3'>
														<div className='flex flex-wrap gap-2'>
															{Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
																<span
																	key={`completed-${tagIndex}`}
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
				</div>
			)}

			{/* 하단 프로모션 배너 (contained) - stays inside page padding (up to 15%) */}
			<div className="mt-12 mb-8">
				<div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 text-gray-900 shadow-sm">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%] py-8 md:py-12">
						<div className="flex-1">
							<h3 className="text-sm sm:text-base font-medium text-gray-700">아이디어가 있으신가요?</h3>
							<h2 className="text-2xl sm:text-3xl font-bold leading-tight mt-2 text-gray-900">당신의 프로젝트를 세상에 보여주세요</h2>
							<p className="mt-3 text-sm sm:text-base text-gray-700">팀 빌딩, 펀딩, 커뮤니티 확장까지 — 지금 바로 프로젝트를 등록하고 첫 발을 내딛어보세요.</p>
							<div className="mt-4 flex items-center gap-3">
								<button onClick={() => navigate('/creater')} className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition">프로젝트 시작하기</button>
								<a onClick={() => navigate('/support/faq')} className="text-gray-700/80 hover:text-gray-900 text-sm">도움말 보기</a>
							</div>
						</div>
						<div className="flex items-center justify-center md:items-center md:justify-end md:w-1/3">
							{/* Cloud icon */}
							<svg className="w-32 h-32 md:w-40 md:h-40" style={{color: '#A66CFF'}} fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M16 7.5a2.5 2.5 0 0 1-1.456 2.272 3.5 3.5 0 0 0-.65-.824 1.5 1.5 0 0 0-.789-2.896.5.5 0 0 1-.627-.421 3 3 0 0 0-5.22-1.625 5.6 5.6 0 0 0-1.276.088 4.002 4.002 0 0 1 7.392.91A2.5 2.5 0 0 1 16 7.5"/>
								<path d="M7 5a4.5 4.5 0 0 1 4.473 4h.027a2.5 2.5 0 0 1 0 5H3a3 3 0 0 1-.247-5.99A4.5 4.5 0 0 1 7 5m3.5 4.5a3.5 3.5 0 0 0-6.89-.873.5.5 0 0 1-.51.375A2 2 0 1 0 3 13h8.5a1.5 1.5 0 1 0-.376-2.953.5.5 0 0 1-.624-.492z"/>
							</svg>
						</div>
					</div>
				</div>
			</div>

		</div>
	)
}

export default Search

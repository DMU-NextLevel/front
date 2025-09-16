import React, { useEffect, useState, useRef, useCallback } from 'react'
import noImage from '../assets/images/noImage.jpg'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { useSearchParams } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { fetchProjectsFromServer } from '../hooks/fetchProjectsFromServer'

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
	const [searchParams] = useSearchParams()
	const location = useLocation()
	const tagFromState = location.state as string | undefined
	const initialTag = tagFromState || searchParams.get('tag') || ''
	const [tag, setTag] = useState(initialTag)
	const [searchTerm, setSearchTerm] = useState<string>('')

	const [projects, setProjects] = useState<any[]>([])
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
					setProjects(data)
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

	//좋아요 기능 추후 추가 예정
	const handleLikeToggle = async (projectId: number, current: boolean) => {
		// if (!isLoggedIn) {
		//   navigate('/login');
		//   return;
		// }
		// try {
		//   if (current) {
		//     await api.delete(`/project/like/${projectId}`);
		//   } else {
		//     await api.post(`/project/like/${projectId}`);
		//   }
		//   fetchProjects();
		// } catch (e) {
		//   console.error('좋아요 실패', e);
		// }
	}

	return (
		<div className='mx-[15%] xl:mx-[10%] lg:mx-[5%]'>
			<div className='flex overflow-x-auto h-20 px-5 py-3 items-center justify-between'>
				{categories.map((cat) => (
					<div
						key={cat.tag}
						onClick={() => setTag(cat.tag)}
						className={`flex flex-col items-center text-[13px] min-w-[80px] text-gray-500 cursor-pointer transition-all duration-200 hover:text-purple-500 hover:font-bold hover:-translate-y-0.5 ${
							tag === cat.tag ? 'text-purple-500 font-bold mx-2.5' : ''
						}`}>
						<i
							className={`${cat.icon} text-[22px] mb-1.5 ${
								tag === cat.tag ? 'bg-purple-500 text-white rounded-full p-1.5 w-[35px] h-[35px] flex justify-center items-center' : ''
							}`}></i>
						<span>{cat.label}</span>
					</div>
				))}
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
				<div className='fixed top-20 left-0 right-0 bottom-0 w-full h-[calc(100%-80px)] bg-white bg-opacity-60 flex flex-col justify-center items-center z-[1000]'>
					<div className='flex justify-center items-center mt-4'>
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
				<div className='text-center py-32 text-gray-500'>
					<i className='bi bi-search text-6xl font-bold'></i>
					<p className='text-3xl text-gray-500 font-bold'>검색 결과가 없습니다.</p>
				</div>
			)}
			{projects.length > 0 && (
				<div>
					총 <strong>{projects.length}</strong>개의 프로젝트가 있습니다.
				</div>
			)}
			{/* {error && <ErrorText>{error}</ErrorText>} */}

			<div className='grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-12 justify-between overflow-visible relative z-0'>
				{projects.map((item, index) => {
					const isLast = index === projects.length - 1
					const getProgressColor = (percent: number) => {
						if (percent >= 80) return 'bg-purple-500'
						if (percent >= 60) return 'bg-indigo-400'
						if (percent >= 40) return 'bg-blue-300'
						if (percent >= 20) return 'bg-sky-300'
						return 'bg-gray-400'
					}
					return (
						<div key={item.id} ref={isLast ? lastProjectRef : undefined} className='flex flex-col bg-white w-70 my-5 overflow-visible relative z-3 hover:z-5'>
							<div className='flex items-center'>
								<div>
									<a href={`/project/${item.id}`} className='no-underline text-inherit'>
										<div className='relative'>
											<img
												src={`${baseUrl}/img/${item.titleImg}`}
												alt={item.title}
												className='h-40 cursor-pointer rounded-xl border border-gray-300 object-cover w-65 z-1 transition-all duration-500 ease hover:shadow-lg hover:scale-[1.005]'
												onError={(e) => {
													e.currentTarget.onerror = null
													e.currentTarget.src = noImage
												}}
											/>
											<i
												className={`absolute top-2.5 right-2.5 text-xl text-purple-500 cursor-pointer transition-all duration-300 ease hover:scale-110 ${
													item.isRecommend ? 'bi bi-heart-fill' : 'bi bi-heart'
												}`}
												onClick={() => handleLikeToggle(item.id, item.isRecommend)}
											/>
										</div>
									</a>
									<div className='flex flex-col'>
										<div className='text-xs text-purple-500 mt-1'>{item.completionRate}% 달성</div>
										<a href={`/project/${item.id}`} className='no-underline text-inherit'>
											<div className='text-base text-gray-800 mt-1 font-medium cursor-pointer min-h-10'>{item.title}</div>
										</a>
										<div className='text-xs text-gray-500 mt-1 cursor-pointer hover:text-purple-500 hover:font-bold transition-all duration-200 ease'>회사이름</div>
										<div className='flex flex-wrap gap-1.5 mt-2'>
											<span className='bg-gray-100 px-1.5 py-1 text-xs rounded-md text-gray-600 hover:bg-purple-500 hover:text-white hover:font-bold transition-all duration-200 ease'>
												{item.tags[0]}
											</span>
											{item.tags[0] && (
												<span className='bg-gray-100 px-1.5 py-1 text-xs rounded-md text-gray-600 hover:bg-purple-500 hover:text-white hover:font-bold transition-all duration-200 ease'>
													{item.tags[1]}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className='w-2.5 h-full ml-2.5 relative overflow-visible rounded-lg p-0 z-2 transition-all duration-500 ease hover:shadow-lg hover:scale-[1.01] group'>
									<div className='bg-gray-200 relative rounded-lg w-2.5 h-full flex flex-col-reverse transition-all duration-300 ease'>
										<div
											className={`w-full h-[${item.completionRate}%] ${getProgressColor(item.completionRate)} transition-all duration-300 ease rounded-lg`}
											style={{ height: `${item.completionRate}%` }}>
											<div className="absolute z-[9999] -right-24 top-1/2 transform -translate-y-1/2 py-2.5 px-2.5 bg-purple-500 rounded-lg min-w-10 flex justify-center items-center text-sm text-white opacity-0 transition-opacity duration-300 ease delay-500 pointer-events-none group-hover:opacity-100 after:content-[''] after:absolute after:top-1/2 after:-left-2.5 after:transform after:-translate-y-1/2 after:w-0 after:h-0 after:border-t-[10px] after:border-t-transparent after:border-b-[10px] after:border-b-transparent after:border-r-[10px] after:border-r-purple-500">
												{item.userCount}명 참여
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

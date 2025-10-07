import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/AuthContext'
import { api } from '../../AxiosInstance'
import { useUserRole } from '../../hooks/useUserRole'
import noImage from '../../assets/images/noImage.jpg'
import SupportLayout from './SupportLayout'

type Notice = {
	id: number
	title: string
	content?: string
	createdAt: string
	imgs: string[]
}

const PAGE_SIZE = 5

const SupportNotice: React.FC = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const [searchInput, setSearchInput] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [searchType, setSearchType] = useState<'title' | 'titleContent'>('title')
	const [currentPage, setCurrentPage] = useState(1)
	const [noticeList, setNoticeList] = useState<Notice[]>([])
	const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
	const [isMobile, setIsMobile] = useState(false)
	const { isLoggedIn } = useAuth()
	const { role, loading } = useUserRole()
	const navigate = useNavigate()

	// 화면 크기 감지
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 640)
		}
		
		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	useEffect(() => {
		api
			.get('/public/notice')
			.then((res) => {
				if (res.data.message === 'success') {
					setNoticeList(res.data.data)
				}
			})
			.catch((err) => {
				console.error('공지 불러오기 실패:', err)
			})
	}, [])

	const handleSearch = () => {
		setSearchTerm(searchInput.trim())
		setCurrentPage(1)
	}

	const handleReset = () => {
		setSearchInput('')
		setSearchTerm('')
		setCurrentPage(1)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	// 검색 타입이 변경될 때마다 현재 검색어로 재검색
	useEffect(() => {
		if (searchTerm) {
			setCurrentPage(1)
		}
	}, [searchType])

	const handleCreate = () => {
		navigate('/notice/write')
	}

	const handleNoticeClick = (notice: Notice) => {
		navigate(`/support/notice/${notice.id}`, { state: notice })
	}

	const handleSortChange = (newSortOrder: 'newest' | 'oldest') => {
		setSortOrder(newSortOrder)
		setCurrentPage(1)
	}

	const filteredAndSortedNotices = noticeList
		.filter((notice) => {
			const lowerSearchTerm = searchTerm.toLowerCase()
			if (searchType === 'title') {
				return notice.title.toLowerCase().includes(lowerSearchTerm)
			} else {
				return notice.title.toLowerCase().includes(lowerSearchTerm) || 
				       (notice.content && notice.content.toLowerCase().includes(lowerSearchTerm))
			}
		})
		.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime()
			const dateB = new Date(b.createdAt).getTime()
			return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
		})

	const totalPages = Math.ceil(filteredAndSortedNotices.length / PAGE_SIZE)
	const startIndex = (currentPage - 1) * PAGE_SIZE
	const currentNotices = filteredAndSortedNotices.slice(startIndex, startIndex + PAGE_SIZE)

	const formatDate = (isoDate: string) => {
		const d = new Date(isoDate)
		return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
	}

	return (
		<SupportLayout>
			<div>
				{/* Header Section */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h2 className='text-2xl font-bold text-gray-900 mb-2'>공지사항</h2>
							<p className='text-sm text-gray-500'>NextLevel의 주요 공지사항을 확인하세요</p>
						</div>
						
						{/* Admin Button */}
						{!loading && role === 'ADMIN' && (
							<button 
								onClick={handleCreate}
								className='hidden sm:flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm'>
								<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
								</svg>
								새 공지 작성
							</button>
						)}
					</div>

					{/* Controls */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg'>
						<div className='flex items-center gap-3'>
							<span className='text-sm text-gray-600'>
								총 <span className='font-semibold text-purple-600'>{filteredAndSortedNotices.length}</span>개
							</span>
							<div className='h-4 w-px bg-gray-300'></div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => handleSortChange('newest')}
									className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${
										sortOrder === 'newest' 
											? 'bg-purple-600 text-white' 
											: 'bg-white text-gray-600 hover:bg-gray-100'
									}`}>
									최신순
								</button>
								<button
									onClick={() => handleSortChange('oldest')}
									className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${
										sortOrder === 'oldest' 
											? 'bg-purple-600 text-white' 
											: 'bg-white text-gray-600 hover:bg-gray-100'
									}`}>
									과거순
								</button>
							</div>
						</div>

						{/* Search */}
						<div className='flex items-center gap-2'>
							<select
								value={searchType}
								onChange={(e) => setSearchType(e.target.value as 'title' | 'titleContent')}
								className='px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white'>
								<option value='title'>제목</option>
								<option value='titleContent'>제목+내용</option>
							</select>
							<div className='relative flex-1 sm:w-64'>
								<input
									type='text'
									placeholder='검색어를 입력하세요'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className='w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none bg-white'
								/>
								<svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
								</svg>
								{searchInput && (
									<button
										onClick={handleReset}
										className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
										</svg>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Content Section */}
				{filteredAndSortedNotices.length === 0 ? (
					<div className='text-center py-16 sm:py-20 text-gray-400 text-base'>검색 결과가 없습니다.</div>
				) : (
					<>
						{/* Notice List */}
						<div className='space-y-0 border-t border-gray-200'>
							{currentNotices.map((notice) => (
								<div 
									key={notice.id} 
									onClick={() => handleNoticeClick(notice)} 
									className='border-b border-gray-100 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'>
									
									{/* Desktop/Tablet Layout */}
									<div className='hidden sm:flex items-stretch justify-between'>
										<div className='flex-1 pr-4 lg:pr-6 py-2 lg:py-3.5'>
											<div className='flex items-center gap-2 mb-1 sm:mb-2'>
												<span className='text-xs text-purple-600 font-medium'>공지</span>
											</div>
											<h3 className='text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 leading-relaxed hover:text-purple-600 transition-colors duration-200 line-clamp-2'>
												{notice.title}
											</h3>
											<div className='text-sm text-gray-400'>
												{formatDate(notice.createdAt)}
											</div>
										</div>
										{notice.imgs?.length > 0 && (
											<div className='flex-shrink-0'>
												<img
													src={`${baseUrl}/img/${notice.imgs[0]}`}
													alt={`공지 썸네일`}
													className='w-24 sm:w-28 lg:w-32 h-16 sm:h-20 lg:h-24 object-cover rounded border border-gray-200'
													onError={(e) => {
														e.currentTarget.onerror = null
														e.currentTarget.src = noImage
													}}
												/>
											</div>
										)}
									</div>

									{/* Mobile Layout */}
									<div className='sm:hidden space-y-3'>
										<div className='flex items-start justify-between gap-3'>
											<div className='flex-1 min-w-0'>
												<div className='flex items-center gap-2 mb-2'>
													<span className='text-xs text-purple-600 font-medium'>공지</span>
												</div>
												<h3 className='text-base font-semibold text-gray-900 mb-2 leading-relaxed hover:text-purple-600 transition-colors duration-200 line-clamp-2'>
													{notice.title}
												</h3>
												<div className='text-sm text-gray-400'>
													{formatDate(notice.createdAt)}
												</div>
											</div>
											{notice.imgs?.length > 0 && (
												<div className='flex-shrink-0'>
													<img
														src={`${baseUrl}/img/${notice.imgs[0]}`}
														alt={`공지 썸네일`}
														className='w-20 h-16 object-cover rounded border border-gray-200'
														onError={(e) => {
															e.currentTarget.onerror = null
															e.currentTarget.src = noImage
														}}
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className='flex justify-center items-center mt-8 sm:mt-12 gap-1'>
								<button 
									onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
									className={`w-8 h-8 flex items-center justify-center text-sm transition-colors duration-200 ${
										currentPage === 1 
											? 'text-gray-300 cursor-not-allowed'
											: 'text-gray-400 hover:text-gray-600'
									}`}>
									&lt;
								</button>
								
								{Array.from({ length: Math.min(totalPages, isMobile ? 5 : 7) }, (_, i) => {
									const maxPages = isMobile ? 5 : 7;
									let pageNum;
									if (totalPages <= maxPages) {
										pageNum = i + 1;
									} else if (currentPage <= Math.floor(maxPages/2) + 1) {
										pageNum = i + 1;
									} else if (currentPage >= totalPages - Math.floor(maxPages/2)) {
										pageNum = totalPages - maxPages + 1 + i;
									} else {
										pageNum = currentPage - Math.floor(maxPages/2) + i;
									}
									
									return (
										<button
											key={pageNum}
											className={`w-8 h-8 flex items-center justify-center text-sm transition-colors duration-200 ${
												pageNum === currentPage 
													? 'bg-purple-600 text-white rounded' 
													: 'text-gray-600 hover:text-gray-900'
											}`}
											onClick={() => setCurrentPage(pageNum)}>
											{pageNum}
										</button>
									);
								})}
								
								<button 
									onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`w-8 h-8 flex items-center justify-center text-sm transition-colors duration-200 ${
										currentPage === totalPages 
											? 'text-gray-300 cursor-not-allowed'
											: 'text-gray-400 hover:text-gray-600'
									}`}>
									&gt;
								</button>
							</div>
						)}
					</>
				)}

				{/* Mobile Admin Button */}
				{!loading && role === 'ADMIN' && (
					<div className='sm:hidden mt-8'>
						<button 
							onClick={handleCreate}
							className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md'>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
							</svg>
							글쓰기
						</button>
					</div>
				)}
			</div>
		</SupportLayout>
	)
}

export default SupportNotice

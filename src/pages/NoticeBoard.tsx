import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { api } from '../AxiosInstance'
import { useUserRole } from '../hooks/useUserRole'
import noImage from '../assets/images/noImage.jpg'
import Swal from 'sweetalert2'

type Notice = {
	id: number
	title: string
	content?: string
	createdAt: string
	imgs: string[]
}

const PAGE_SIZE = 5

const NoticeBoard: React.FC = () => {
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
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: '잠시 후 다시 시도해주세요. 계속 발생시 관리자에게 문의해주세요.',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
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
		navigate(`/notice/${notice.id}`, { state: notice })
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
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-white min-h-screen'>
			{/* Header Section - Responsive */}
			<div className='mb-6 lg:mb-8'>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>공지사항</h1>

					{/* Desktop/Tablet Admin Button */}
					{!loading && role === 'ADMIN' && (
						<button
							onClick={handleCreate}
							className='hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md'>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
							</svg>
							글쓰기
						</button>
					)}
				</div>

				{/* Controls Section - Responsive */}
				<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
					{/* Left controls */}
					<div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
						<span className='bg-gray-900 text-white px-3 py-1 rounded text-xs font-medium w-fit'>전체</span>
						<div className='flex items-center bg-gray-100 rounded-lg p-1'>
							<button
								onClick={() => handleSortChange('newest')}
								className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
									sortOrder === 'newest'
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
								}`}>
								최신 순
							</button>
							<button
								onClick={() => handleSortChange('oldest')}
								className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
									sortOrder === 'oldest'
										? 'bg-white text-gray-900 shadow-sm'
										: 'text-gray-600 hover:text-gray-900'
								}`}>
								오래된 순
							</button>
						</div>
					</div>

					{/* Right controls */}
					<div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
						{/* Stats - Hidden on mobile, visible on tablet+ */}
						<span className='hidden sm:block text-sm text-gray-600'>
							전체 <span className='font-bold'>{filteredAndSortedNotices.length}</span>건 |
							페이지 <span className='font-bold'>{currentPage}</span> / <span className='font-bold'>{totalPages}</span>
						</span>

						{/* Search controls */}
						<div className='flex items-center gap-2'>
							<select
								value={searchType}
								onChange={(e) => setSearchType(e.target.value as 'title' | 'titleContent')}
								className='px-3 py-2 text-sm text-center border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white'>
								<option value='title'>제목</option>
								<option value='titleContent'>제목+내용</option>
							</select>
							<div className='relative w-full sm:w-64 lg:w-80'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
									</svg>
								</div>
								<input
									type='text'
									placeholder='검색어를 입력하세요'
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={handleKeyDown}
									className='w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200'
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
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Stats */}
				<div className='sm:hidden mt-3 text-sm text-gray-600 text-center'>
					전체 <span className='font-bold'>{filteredAndSortedNotices.length}</span>건 |
					페이지 <span className='font-bold'>{currentPage}</span> / <span className='font-bold'>{totalPages}</span>
				</div>
			</div>

			{/* Content Section - Responsive */}
			{filteredAndSortedNotices.length === 0 ? (
				<div className='text-center py-16 sm:py-20 text-gray-400 text-base'>검색 결과가 없습니다.</div>
			) : (
				<>
					{/* Notice List - Responsive */}
					<div className='space-y-0 border-t border-gray-200'>
						{currentNotices.map((notice, index) => (
							<div
								key={notice.id}
								onClick={() => handleNoticeClick(notice)}
								className='border-b border-gray-100 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'>

								{/* Desktop/Tablet Layout */}
								<div className='hidden sm:flex items-stretch justify-between'>
									<div className='flex-1 pr-4 lg:pr-6 py-2 lg:py-3.5'>
										<div className='flex items-center gap-2 mb-1 sm:mb-2'>
											<span className='text-xs text-blue-600 font-medium'>공지</span>
										</div>
										<h3 className='text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 leading-relaxed hover:text-blue-600 transition-colors duration-200 line-clamp-2'>
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
												alt={`공지 썸네일 - ${notice.title}`}
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
												<span className='text-xs text-blue-600 font-medium'>공지</span>
											</div>
											<h3 className='text-base font-semibold text-gray-900 mb-2 leading-relaxed hover:text-blue-600 transition-colors duration-200 line-clamp-2'>
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
													alt={`공지 썸네일 - ${notice.title}`}
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

					{/* Pagination - Responsive */}
					{totalPages > 1 && (
						<div className='flex justify-center items-center mt-8 sm:mt-12 gap-1'>
							{/* Previous Button */}
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

							{/* Page Numbers */}
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
												? 'bg-gray-900 text-white rounded'
												: 'text-gray-600 hover:text-gray-900'
										}`}
										onClick={() => setCurrentPage(pageNum)}>
										{pageNum}
									</button>
								);
							})}

							{/* Next Button */}
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

			{/* Mobile Admin Button - Below Pagination */}
			{!loading && role === 'ADMIN' && (
				<div className='sm:hidden mt-8'>
					<button
						onClick={handleCreate}
						className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
						</svg>
						글쓰기
					</button>
				</div>
			)}

			{/* Desktop Admin Button */}
			{!loading && role === 'ADMIN' && (
				<div className='hidden sm:block mt-8 text-center'>
					<button
						onClick={handleCreate}
						className='inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
						</svg>
						글쓰기
					</button>
				</div>
			)}
		</div>
	)
}

export default NoticeBoard
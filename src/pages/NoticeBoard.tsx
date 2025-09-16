import React, { useState, useEffect, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/AuthContext'
import { api } from '../AxiosInstance'
import { useUserRole } from '../hooks/useUserRole'
import noImage from '../assets/images/noImage.jpg'

type Notice = {
	id: number
	title: string
	createdAt: string
	imgs: string[]
}

const PAGE_SIZE = 5

const NoticeBoard: React.FC = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const [searchInput, setSearchInput] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [noticeList, setNoticeList] = useState<Notice[]>([])
	const { isLoggedIn } = useAuth()
	const { role, loading } = useUserRole()
	const navigate = useNavigate()

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

	const handleCreate = () => {
		navigate('/notice/write')
	}

	const handleNoticeClick = (notice: Notice) => {
		navigate(`/notice/${notice.id}`, { state: notice })
	}

	const filteredNotices = noticeList.filter((notice) => notice.title.toLowerCase().includes(searchTerm.toLowerCase()))

	const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE)
	const startIndex = (currentPage - 1) * PAGE_SIZE
	const currentNotices = filteredNotices.slice(startIndex, startIndex + PAGE_SIZE)

	const formatDate = (isoDate: string) => {
		const d = new Date(isoDate)
		return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
	}

	return (
		<div className='max-w-4xl mx-auto p-8'>
			<h1 className='text-2xl font-bold mb-6'>공지사항</h1>

			{filteredNotices.length === 0 ? (
				<div className='text-center py-10 text-gray-400 text-base'>검색 결과가 없습니다.</div>
			) : (
				<>
					<ul className='list-none p-0'>
						{currentNotices.map((notice) => (
							<li key={notice.id} onClick={() => handleNoticeClick(notice)} className='flex justify-between items-center py-5 border-b border-gray-200 cursor-pointer'>
								<div className='flex-1'>
									<p className='text-base font-semibold mb-1'>{notice.title}</p>
									<p className='text-xs text-gray-500'>{formatDate(notice.createdAt)}</p>
								</div>
								{notice.imgs?.length > 0 && (
									<img
										src={`${baseUrl}/img/${notice.imgs[0]}`}
										alt={`공지 썸네일 - ${notice.title}`}
										className='w-20 h-20 object-cover rounded ml-4'
										onError={(e) => {
											e.currentTarget.onerror = null
											e.currentTarget.src = noImage
										}}
									/>
								)}
							</li>
						))}
					</ul>

					{totalPages > 1 && (
						<div className='flex justify-center mt-8 gap-2'>
							{Array.from({ length: totalPages }, (_, i) => (
								<button
									key={i}
									className={`py-1.5 px-3 text-sm border-none rounded cursor-pointer font-medium transition-colors duration-200 ${
										i + 1 === currentPage ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-800 hover:text-white'
									}`}
									onClick={() => setCurrentPage(i + 1)}>
									{i + 1}
								</button>
							))}
						</div>
					)}
				</>
			)}

			{!loading && role === 'ADMIN' && (
				<button className='py-2 px-4 text-sm bg-gray-800 text-white border-none rounded cursor-pointer hover:bg-black transition-colors duration-200' onClick={handleCreate}>
					공지사항 작성
				</button>
			)}

			<br />
			<div className='mt-10 flex gap-2 mb-5 justify-center'>
				<input
					type='text'
					placeholder='제목 검색'
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className='w-1/5 py-2 px-3 text-sm border border-gray-300 rounded'
				/>
				<button className='py-2 px-4 text-sm bg-gray-800 text-white border-none rounded cursor-pointer hover:bg-black transition-colors duration-200' onClick={handleSearch}>
					검색
				</button>
				<button className='py-2 px-4 text-sm bg-gray-800 text-white border-none rounded cursor-pointer hover:bg-black transition-colors duration-200' onClick={handleReset}>
					초기화
				</button>
			</div>
		</div>
	)
}

export default NoticeBoard

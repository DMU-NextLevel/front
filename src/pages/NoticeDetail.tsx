import React, { useEffect, useState } from 'react'
import { useUserRole } from '../hooks/useUserRole'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../AxiosInstance'

type NoticeArticle = {
	id: number
	title: string
	content: string
	createdAt: string
	imgs?: string[]
}

const NoticeDetail: React.FC = () => {
	const { role, loading: roleLoading } = useUserRole()
	const { id } = useParams<{ id: string }>()
	const location = useLocation()
	const navigate = useNavigate()
	
	const [prevNotice, setPrevNotice] = useState<NoticeArticle | null>(null)
	const [nextNotice, setNextNotice] = useState<NoticeArticle | null>(null)

	const article = location.state as NoticeArticle | undefined

	const formatDate = (isoDate: string) => {
		const d = new Date(isoDate)
		return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`
	}

	// 이전글/다음글 가져오기
	useEffect(() => {
		const fetchAdjacentNotices = async () => {
			if (!id) return
			
			try {
				const response = await api.get('/public/notice')
				const notices = response.data.data as NoticeArticle[]
				
				const currentIndex = notices.findIndex(notice => notice.id === parseInt(id))
				if (currentIndex !== -1) {
					// 다음글 (더 최신글)
					if (currentIndex > 0) {
						setNextNotice(notices[currentIndex - 1])
					}
					// 이전글 (더 오래된 글)
					if (currentIndex < notices.length - 1) {
						setPrevNotice(notices[currentIndex + 1])
					}
				}
			} catch (error) {
				console.error('이전글/다음글 로딩 실패:', error)
			}
		}

		fetchAdjacentNotices()
	}, [id])

	if (!article) {
		return <div className='max-w-4xl mx-auto p-8'>공지 정보를 불러올 수 없습니다.</div>
	}

	//삭제 함수
	const handleDelete = async () => {
		if (!id) return
		console.log(id)
		const confirm = window.confirm('정말 삭제하시겠습니까?')
		if (!confirm) return

		try {
			const res = await api.post(`/admin/notice/${id}`)
			if (res.data.message === 'success') {
				alert('삭제가 완료되었습니다.')
				navigate('/notice')
			} else {
				alert('삭제 실패: ' + res.data.message)
			}
		} catch (err) {
			console.error('삭제 중 오류:', err)
			alert('삭제 중 오류가 발생했습니다.')
		}
	}
	// 🧩 이미지 삽입된 content HTML에 실제 이미지 경로 삽입
	const getProcessedContent = () => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(article.content, 'text/html')
		const imgTags = doc.querySelectorAll('img')

		imgTags.forEach((img, idx) => {
			if (article.imgs && article.imgs[idx]) {
				img.setAttribute('src', `${api.defaults.baseURL}img/${article.imgs[idx]}`)
			}
		})

		return { __html: doc.body.innerHTML }
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white min-h-screen'>
			{/* Header Section */}
			<div className='mb-8'>
				<div className='flex items-center justify-between mb-6'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900 mb-2'>{article.title}</h1>
						<div className='flex items-center gap-4 text-sm text-gray-500'>
							<div className='flex items-center gap-2'>
								<img 
									src={`https://placehold.co/32x32?text=WU`} 
									alt='작성자 이미지' 
									className='w-8 h-8 rounded-full object-cover border border-gray-200' 
								/>
								<span className='font-medium'>위드유</span>
							</div>
							<span className='text-gray-400'>•</span>
							<span>{formatDate(article.createdAt)}</span>
						</div>
					</div>

					{!roleLoading && role === 'ADMIN' && (
						<div className='flex items-center gap-2'>
							<button
								onClick={() =>
									navigate(`/notice/edit/${article.id}`, {
										state: { article },
									})
								}
								className='px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-200'>
								<svg className='w-4 h-4 inline mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
								</svg>
								수정
							</button>
							<button
								onClick={handleDelete}
								className='px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300'>
								<svg className='w-4 h-4 inline mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
								</svg>
								삭제
							</button>
						</div>
					)}
				</div>
				<hr className='border-gray-200' />
			</div>

			{/* Content Section */}
			<div className='bg-white py-8'>
				<div 
					className='prose prose-lg max-w-none text-gray-800 leading-relaxed'
					dangerouslySetInnerHTML={getProcessedContent()} 
				/>
			</div>

			{/* Previous/Next Navigation */}
			<div className='mt-12 pt-8 border-t border-gray-200'>
				<div className='space-y-0 border border-gray-200 rounded-lg overflow-hidden mb-8'>
					{/* 다음글 */}
					{nextNotice ? (
						<div 
							onClick={() => navigate(`/notice/${nextNotice.id}`, { state: nextNotice })}
							className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2 text-sm text-gray-500'>
									<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
									</svg>
									<span className='font-medium'>다음글</span>
								</div>
								<h3 className='text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200'>
									{nextNotice.title}
								</h3>
							</div>
							<span className='text-sm text-gray-400'>
								{formatDate(nextNotice.createdAt)}
							</span>
						</div>
					) : (
						<div className='flex items-center justify-between p-4 border-b border-gray-200 text-gray-400'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2 text-sm'>
									<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
									</svg>
									<span>다음글</span>
								</div>
								<span className='text-sm'>다음글이 없습니다</span>
							</div>
						</div>
					)}

					{/* 이전글 */}
					{prevNotice ? (
						<div 
							onClick={() => navigate(`/notice/${prevNotice.id}`, { state: prevNotice })}
							className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2 text-sm text-gray-500'>
									<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
									</svg>
									<span className='font-medium'>이전글</span>
								</div>
								<h3 className='text-gray-900 font-medium hover:text-blue-600 transition-colors duration-200'>
									{prevNotice.title}
								</h3>
							</div>
							<span className='text-sm text-gray-400'>
								{formatDate(prevNotice.createdAt)}
							</span>
						</div>
					) : (
						<div className='flex items-center justify-between p-4 text-gray-400'>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2 text-sm'>
									<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
									</svg>
									<span>이전글</span>
								</div>
								<span className='text-sm'>이전글이 없습니다</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Navigation Section */}
			<div className='pt-4 border-t border-gray-200'>
				<button
					onClick={() => navigate('/notice')}
					className='inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200'>
					<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
					</svg>
					목록으로 돌아가기
				</button>
			</div>
		</div>
	)
}

export default NoticeDetail

import React, { useEffect, useState } from 'react'
import { useUserRole } from '../../hooks/useUserRole'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../AxiosInstance'
import SupportLayout from './SupportLayout'

type NoticeArticle = {
	id: number
	title: string
	content: string
	createdAt: string
	imgs?: string[]
}

const SupportNoticeDetail: React.FC = () => {
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

	// 페이지 로드 시, 메인 아티클 컨테이너가 뷰포트 최상단에 오도록 스크롤
	useEffect(() => {
		setTimeout(() => {
			const target = document.getElementById('notice-article-top') as HTMLElement
			if (!target) return

			// 고정된 헤더나 sticky 탭이 있다면 그 높이만큼 보정
			const header = document.querySelector('header') as HTMLElement | null
			const stickyTab = document.querySelector('.support-tab') as HTMLElement | null
			const headerHeight = header ? header.offsetHeight : 0
			const stickyHeight = stickyTab ? stickyTab.offsetHeight : 0

			// 타겟의 문서 기준 Y 좌표
			const targetTop = target.getBoundingClientRect().top + window.scrollY
			// 최종 스크롤 위치 계산 (헤더 + sticky 탭 높이만큼 빼서 타겟이 보이도록)
			const finalScroll = Math.max(0, targetTop - headerHeight - stickyHeight)

			window.scrollTo({ top: finalScroll, behavior: 'auto' })
		}, 50)
	}, [id])

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
		return (
			<SupportLayout>
				<div className='max-w-4xl mx-auto p-8'>공지 정보를 불러올 수 없습니다.</div>
			</SupportLayout>
		)
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
				navigate('/support/notice')
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
				img.setAttribute('src', `${api.defaults.baseURL}/img/${article.imgs[idx]}`)
			}
		})

		return { __html: doc.body.innerHTML }
	}

	return (
		<SupportLayout>
			<div id='notice-article-top' className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12'>
				{/* Header Section - Responsive */}
				<div className='mb-6 sm:mb-8'>
					<div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-6'>
						<div className='flex-1 min-w-0'>
							<h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-2 leading-tight break-words'>
								{article.title}
							</h1>
							<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500'>
								<div className='flex items-center gap-2'>
									<img 
										src={`https://placehold.co/32x32?text=WU`} 
										alt='작성자 이미지' 
										className='w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200' 
									/>
									<span className='font-medium'>위드유</span>
								</div>
								<span className='hidden sm:inline text-gray-400'>•</span>
								<span>{formatDate(article.createdAt)}</span>
							</div>
						</div>

						{/* Admin Controls - Responsive */}
						{!roleLoading && role === 'ADMIN' && (
							<div className='flex items-center gap-2 flex-shrink-0'>
								<button
									onClick={() =>
										navigate(`/notice/edit/${article.id}`, {
											state: { article },
										})
									}
									className='flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-purple-200'>
									<svg className='w-4 h-4 inline mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
									</svg>
									<span>수정</span>
								</button>
								<button
									onClick={handleDelete}
									className='flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300'>
									<svg className='w-4 h-4 inline mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
									</svg>
									<span>삭제</span>
								</button>
							</div>
						)}
					</div>
					<hr className='border-gray-200' />
				</div>

				{/* Content Section - Responsive */}
				<div className='py-6 sm:py-8'>
					<div 
						className='prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800 leading-relaxed
						[&_img]:w-full [&_img]:rounded-lg [&_img]:my-4 [&_img]:border [&_img]:border-gray-200
						[&_p]:mb-4 [&_h1]:text-xl [&_h1]:sm:text-2xl [&_h2]:text-lg [&_h2]:sm:text-xl
						[&_h3]:text-base [&_h3]:sm:text-lg [&_ul]:ml-4 [&_ol]:ml-4'
						dangerouslySetInnerHTML={getProcessedContent()} 
					/>
				</div>

				{/* Previous/Next Navigation - Responsive */}
				<div className='mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
					<div className='space-y-0 border border-gray-200 rounded-lg overflow-hidden mb-6 sm:mb-8'>
						{/* 다음글 */}
						{nextNotice ? (
							<div 
								onClick={() => navigate(`/support/notice/${nextNotice.id}`, { state: nextNotice })}
								className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200 border-b border-gray-200 gap-2 sm:gap-0'>
								<div className='flex items-start sm:items-center gap-3 min-w-0 flex-1'>
									<div className='flex items-center gap-2 text-sm text-purple-600 flex-shrink-0'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
										</svg>
										<span className='font-medium'>다음글</span>
									</div>
									<h3 className='text-gray-900 font-medium hover:text-purple-600 transition-colors duration-200 text-sm sm:text-base line-clamp-2 min-w-0'>
										{nextNotice.title}
									</h3>
								</div>
								<span className='text-xs sm:text-sm text-gray-400 flex-shrink-0 sm:ml-4'>
									{formatDate(nextNotice.createdAt)}
								</span>
							</div>
						) : (
							<div className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-200 text-gray-400 gap-2 sm:gap-0'>
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
								onClick={() => navigate(`/support/notice/${prevNotice.id}`, { state: prevNotice })}
								className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-purple-50 transition-colors duration-200 gap-2 sm:gap-0'>
								<div className='flex items-start sm:items-center gap-3 min-w-0 flex-1'>
									<div className='flex items-center gap-2 text-sm text-purple-600 flex-shrink-0'>
										<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
										</svg>
										<span className='font-medium'>이전글</span>
									</div>
									<h3 className='text-gray-900 font-medium hover:text-purple-600 transition-colors duration-200 text-sm sm:text-base line-clamp-2 min-w-0'>
										{prevNotice.title}
									</h3>
								</div>
								<span className='text-xs sm:text-sm text-gray-400 flex-shrink-0 sm:ml-4'>
									{formatDate(prevNotice.createdAt)}
								</span>
							</div>
						) : (
							<div className='flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 text-gray-400 gap-2 sm:gap-0'>
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

				{/* Navigation Section - Responsive */}
				<div className='pt-4 sm:pt-4 border-t border-gray-200'>
					<button
						onClick={() => {
							// 스크롤 위치 복원을 위해 flag 설정
							sessionStorage.setItem('shouldRestoreScroll', 'true')
							navigate('/support/notice')
						}}
						className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200'>
						<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
						</svg>
						목록으로 돌아가기
					</button>
				</div>
			</div>
		</SupportLayout>
	)
}

export default SupportNoticeDetail

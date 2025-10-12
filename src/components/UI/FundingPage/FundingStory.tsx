import React, { JSX, useState } from 'react'
import NewsContent from './NewsContent'
import FundingMessage from './FundingMessage'
import NoticeModal from './modals/NoticeModal'
import QuestionModal from './modals/QuestionModal'
import { StoryModal } from './modals/StoryModal'

const baseUrl = process.env.REACT_APP_API_BASE_URL

interface storyProps {
	story: any[] | undefined
}

interface newsProps {
	notice: any[] | undefined
}

interface commuProps {
	community: any[] | undefined
}

export const FundingStory = ({ story }: storyProps): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleEdit = () => {
		setIsModalOpen(true)
	}

	return (
		<div className='flex flex-col w-[90%] max-w-4xl mx-auto'>
			{/* 헤더 섹션 */}
			<div className='flex items-center gap-3 mb-6'>
				<div className='flex items-center gap-3 flex-1'>
					<div className='w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-300 rounded-full'></div>
					<h2 className='text-2xl font-bold text-gray-800'>📢 프로젝트 스토리</h2>
				</div>
				<button className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5' onClick={handleEdit}>수정하기</button>
			</div>

			{/* 구분선 */}
			<div className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8'></div>

			{/* 스토리 콘텐츠 */}
			<div className='space-y-6' style={{ minHeight: '800px' }}>
				{story && story.length > 0 ? (
					story.map((story) => (
						<div key={story.id} className='bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden'>
							<img src={`${baseUrl}/img/${story}`} className='w-full h-auto object-cover' alt='프로젝트 스토리 이미지' />
						</div>
					))
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
							<svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
						</div>
						<p className='text-gray-500 text-lg'>아직 등록된 스토리가 없습니다.</p>
						<p className='text-gray-400 text-sm mt-1'>프로젝트의 스토리를 공유해보세요!</p>
					</div>
				)}
			</div>
			<StoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	)
}

export const FundingNews = ({ notice }: newsProps): JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<div className='flex flex-col w-[90%] max-w-4xl mx-auto'>
			{/* 헤더 섹션 */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
				<div className='flex items-center gap-3'>
					<div className='w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-300 rounded-full'></div>
					<h2 className='text-2xl font-bold text-gray-800'>우리 프로젝트는 현재 이렇게 진행중이에요</h2>
				</div>
				<button
					onClick={() => setIsModalOpen(true)}
					className='flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'>
					<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
					</svg>
					공지 추가
				</button>
			</div>

			{/* 구분선 */}
			<div className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8'></div>

			{/* 공지 목록 */}
			<div className='space-y-4'>
				{notice && notice.length > 0 ? (
					notice.map((news) => <NewsContent title={news.title} content={news.content} id={news.id} />)
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
							<svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
						</div>
						<p className='text-gray-500 text-lg'>아직 등록된 공지가 없습니다.</p>
						<p className='text-gray-400 text-sm mt-1'>첫 번째 공지를 추가해보세요!</p>
					</div>
				)}
			</div>

			<NoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	)
}

export const FundingCommu = ({ community }: commuProps): JSX.Element => {
	const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)

	return (
		<div className='flex flex-col w-[90%] max-w-4xl mx-auto pb-[600px]'>
			{/* 헤더 섹션 */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
				<div className='flex items-center gap-3'>
					<div className='w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-300 rounded-full'></div>
					<h2 className='text-2xl font-bold text-gray-800'>💬 저희 소통해요</h2>
				</div>
				<button
					onClick={() => setIsQuestionModalOpen(true)}
					className='flex items-center gap-2 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'>
					<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					질문하기
				</button>
			</div>

			{/* 구분선 */}
			<div className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8'></div>

			{/* 커뮤니티 메시지 */}
			<div className='space-y-4'>
				{community && community.length > 0 ? (
					community.map((commu) => <FundingMessage key={commu.id} ask={commu.ask} answer={commu.answer} />)
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
							<svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
								/>
							</svg>
						</div>
						<p className='text-gray-500 text-lg'>아직 등록된 질문이 없습니다.</p>
						<p className='text-gray-400 text-sm mt-1'>첫 번째 질문을 추가해보세요!</p>
					</div>
				)}
			</div>

			<QuestionModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} mode='question' />
		</div>
	)
}

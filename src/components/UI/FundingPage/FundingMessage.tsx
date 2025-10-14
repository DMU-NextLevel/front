import React, { useEffect, useState } from 'react'
import QuestionModal from './modals/QuestionModal'
import Modal from '../../layout/Modal'
import { useCommunityDelete } from '../../../apis/funding/useCommuFetch'
import { useAuthorStore } from '../../../store/authorStore'
import { useAuth } from '../../../hooks/AuthContext'

interface AnswerData {
	id: number
	content: string
	createdAt: string
	userProfileDto: {
		id: number
		nickName: string
		img: {
			id: null | number
			uri: null | string
		}
	}
}

interface AskData {
	id: number
	content: string
	createdAt: string
	userProfileDto: {
		id: number
		nickName: string
		img: {
			id: null | number
			uri: null | string
		}
	}
}

interface ChatMessageProps {
	ask?: AskData | null
	answer?: AnswerData | null
}

const FundingMessage: React.FC<ChatMessageProps> = ({ ask, answer }) => {
	const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isType, setIsType] = useState<'ask' | 'answer' | null>(null)
	const [editData, setEditData] = useState<{ id: number; content: string; isType: 'ask' | 'answer' | null } | null>(null)
	const [isMine, setIsMine] = useState(false)
	const {deleteCommunity} = useCommunityDelete()
	const { user } = useAuth()
	const { isAuthor } = useAuthorStore()

	useEffect(() => {
		setIsMine(user?.id === ask?.userProfileDto.id)
	}, [user, ask])

	const handleAnswer = () => {
		setIsAnswerModalOpen(true)
	}

	const handleEdit = (isType: 'ask' | 'answer') => {
		setIsEditModalOpen(true)
		setIsType(isType)
		if (isType === 'ask') {
			setEditData({ id: ask?.id ?? 0, content: ask?.content ?? '', isType: isType })
		} else if (isType === 'answer') {
			setEditData({ id: answer?.id ?? 0, content: answer?.content ?? '', isType: isType })
		}
	}

	const handleDelete = (isType: 'ask' | 'answer') => {
		setIsDeleteModalOpen(true)
		setIsType(isType)
		if (isType === 'ask') {
			setEditData({ id: ask?.id ?? 0, content: ask?.content ?? '', isType: isType })
		} else if (isType === 'answer') {
			setEditData({ id: answer?.id ?? 0, content: answer?.content ?? '', isType: isType })
		}
	}

	return (
		<div className='p-4 mb-4'>
			{/* 질문 부분 */}
			<div className={`flex flex-row-reverse items-end mb-4`}>
				<div className={`w-10 h-10 rounded-full flex-shrink-0 bg-gray-300`} />
				<div className={`flex flex-col items-end mx-2.5`}>
					{!answer && isAuthor && (
						<button className='text-xs text-purple-500 hover:text-purple-700 font-medium' onClick={() => handleAnswer()}>
							답변하기
						</button>
					)}
					<div className={`max-w-[20vw] py-4 px-5 border-4 border-gray-300 rounded-3xl bg-white relative text-base leading-relaxed break-words`}>{ask?.content}</div>
					<div className='mt-2 flex flex-row items-center gap-2'>
						<div className='flex flex-col items-end'>
							<div className='font-bold text-sm text-gray-800'>{ask?.userProfileDto.nickName}</div>
							<div className='text-xs text-gray-500'>{ask?.createdAt.split('T')[0]}</div>
						</div>
					</div>
					<div className='flex flex-row items-center gap-4'>
						{isMine && (
							<button className='text-xs text-gray-500 hover:text-purple-700 font-medium' onClick={() => handleEdit('ask')}>
								수정하기
							</button>
						)}
						{(isMine || isAuthor) && (
							<button className='text-xs text-gray-500 hover:text-red-700 font-medium' onClick={() => handleDelete('ask')}>
								삭제하기
							</button>
						)}
					</div>
				</div>
			</div>

			{/* 답변 부분 */}
			{answer && (
				<div>
					<div className='flex items-end'>
						<div className='w-10 h-10 rounded-full flex-shrink-0 bg-purple-400' />
						<div className='flex flex-col items-start mx-2.5'>
							<div className='max-w-[20vw] py-4 px-5 border-4 border-purple-400 rounded-3xl bg-purple-50 text-base leading-relaxed break-words'>{answer?.content}</div>
							<div className='mt-2 flex flex-col items-start'>
								<div className='font-bold text-sm text-gray-800'>{answer?.userProfileDto.nickName}</div>
								<div className='text-xs text-gray-500'>{answer?.createdAt.split('T')[0]}</div>
							</div>
							<div className='flex flex-row items-center gap-4'>
								{isAuthor && (
									<>
										<button className='text-xs text-gray-500 hover:text-purple-700 font-medium' onClick={() => handleEdit('answer')}>
											수정하기
										</button>
										<button className='text-xs text-gray-500 hover:text-red-700 font-medium' onClick={() => handleDelete('answer')}>
											삭제하기
										</button>
									</>
								)}
							</div>
						</div>
					</div>

					<div className='w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-4' />
				</div>
			)}

			<QuestionModal isOpen={isAnswerModalOpen} onClose={() => setIsAnswerModalOpen(false)} mode='answer' askId={ask?.id} />
			<QuestionModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				mode='edit'
				editData={{
					id: editData?.id ?? 0,
					content: editData?.content ?? '',
					isType: editData?.isType ?? null,
				}}
			/>
			<DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} communityId={editData?.id ?? 0} isType={editData?.isType ?? null} />
		</div>
	)
}

const DeleteModal = ({ isOpen, onClose, communityId, isType }: { isOpen: boolean; onClose: () => void; communityId: number; isType: 'ask' | 'answer' | null }) => {
	const { deleteCommunity, isLoading, error } = useCommunityDelete()
	const handleDelete = async () => {
		try {
			await deleteCommunity({ communityId: communityId.toString(), isType: isType })
			onClose()
			window.location.reload()
		} catch (error) {
			console.error('질문 삭제 실패:', error)
			alert('질문 삭제에 실패했습니다. 다시 시도해주세요.')
		}
	}

	if (!isOpen) return null

	return (
		<Modal onClose={onClose}>
			<div className='bg-white rounded-xl p-6 w-[400px] max-w-2xl max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center gap-4'>
					<h2 className='text-xl font-bold'>삭제하시겠습니까?</h2>
					<button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-2xl'>
						×
					</button>
				</div>
				<button onClick={handleDelete} className='bg-red-500 hover:bg-red-600 transition-all duration-200 text-white px-4 py-2 rounded-md w-full mt-12'>
					삭제
				</button>
			</div>
		</Modal>
	)
}

export default FundingMessage

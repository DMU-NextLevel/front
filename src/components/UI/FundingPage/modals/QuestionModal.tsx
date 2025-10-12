import React, { useState, useEffect } from 'react'
import Modal from '../../../layout/Modal'
import { useParams } from 'react-router-dom'
import { useQuestionAdd, useAnswerAdd, useCommunityUpdate } from '../../../../apis/useCommuFetch'

interface QuestionFormData {
	content: string
}

interface QuestionAddModalProps {
	isOpen: boolean
	onClose: () => void
	mode?: 'question' | 'answer' | 'edit'
	askId?: number // 답변 모드일 때 필요한 질문 ID
	editData?: {
		id: number
		content: string
		isType: 'ask' | 'answer' | null
	}
}

const QuestionModal = ({ isOpen, onClose, mode = 'question', askId, editData }: QuestionAddModalProps) => {
	const [questionData, setQuestionData] = useState<QuestionFormData>({
		content: '',
	})
	const { no } = useParams<{ no: string }>()
    const { addQuestion, isLoading: questionLoading, error: questionError } = useQuestionAdd()
    const { addAnswer, isLoading: answerLoading, error: answerError } = useAnswerAdd()
    const { updateCommunity, isLoading: updateLoading, error: updateError } = useCommunityUpdate()

    const isLoading = questionLoading || answerLoading || updateLoading
    const error = questionError || answerError || updateError

	// 수정 모드일 때 기존 데이터로 폼 초기화
	useEffect(() => {
		if (mode === 'edit' && editData && isOpen) {
			setQuestionData({
				content: editData.content,
			})
		} else if ((mode === 'question' || mode === 'answer') && isOpen) {
			setQuestionData({
				content: '',
			})
		}
	}, [mode, editData, isOpen])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!questionData.content.trim()) {
			alert(`${mode === 'question' ? '질문' : mode === 'answer' ? '답변' : '질문'} 내용을 입력해주세요.`)
			return
		}

		try {
			if (mode === 'question') {
				await addQuestion({
					projectId: no ?? '',
					content: questionData.content,
				})
			} else if (mode === 'answer' && askId) {
				await addAnswer({
					askId: askId.toString(),
					content: questionData.content,
				})
			} else if (mode === 'edit' && editData) {
				await updateCommunity({
					communityId: editData.id.toString(),
					content: questionData.content,
					isType: editData.isType,
				})
			}

			// 성공 시 폼 초기화
			setQuestionData({ content: '' })
			onClose()

			// 페이지 새로고침 또는 목록 업데이트
			window.location.reload()
		} catch (error) {
			console.error(`${mode === 'question' ? '질문' : mode === 'answer' ? '답변' : '질문'} ${mode === 'edit' ? '수정' : '추가'} 실패:`, error)
			alert(`${mode === 'question' ? '질문' : mode === 'answer' ? '답변' : '질문'} ${mode === 'edit' ? '수정' : '추가'}에 실패했습니다. 다시 시도해주세요.`)
		}
	}

	if (!isOpen) return null

	return (
		<Modal onClose={onClose}>
			<div className='bg-white rounded-xl p-6 w-[600px] max-w-2xl max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold'>
						{mode === 'question' ? '질문하기' : mode === 'answer' ? '답변하기' : '질문 수정'}
					</h2>
					<button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-2xl'>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							{mode === 'question' ? '질문' : mode === 'answer' ? '답변' : '질문'} 내용 <span className='text-red-500'>*</span>
						</label>
						<textarea
							value={questionData.content}
							onChange={(e) => setQuestionData((prev) => ({ ...prev, content: e.target.value }))}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none'
							placeholder={
								mode === 'question'
									? '프로젝트에 대해 궁금한 점을 질문해주세요'
									: mode === 'answer'
									? '질문에 대한 답변을 작성해주세요'
									: '질문 내용을 수정해주세요'
							}
							maxLength={500}
						/>
						<p className='text-sm text-gray-500 mt-1'>{questionData.content.length}/500</p>
					</div>

					{error && <div className='text-red-500 text-sm mt-2'>{error}</div>}

					<div className='flex justify-end space-x-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							disabled={isLoading}
							className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50'
						>
							취소
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50'
						>
							{isLoading
								? (mode === 'question' ? '질문 중...' : mode === 'answer' ? '답변 중...' : '수정 중...')
								: (mode === 'question' ? '질문하기' : mode === 'answer' ? '답변하기' : '수정하기')
							}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default QuestionModal

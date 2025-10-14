import React, { useState, useEffect } from 'react'
import Modal from '../../../layout/Modal'
import { useNoticeAdd, useNoticeUpdate } from '../../../../apis/funding/useNoticeFetch'
import { useParams } from 'react-router-dom'

interface NoticeFormData {
	title: string
	content: string
	img: File | null
}

interface NoticeAddModalProps {
	isOpen: boolean
	onClose: () => void
	mode?: 'create' | 'edit'
	editData?: {
		id: number
		title: string
		content: string
		img?: string | null
	}
}

const NoticeModal = ({ isOpen, onClose, mode = 'create', editData }: NoticeAddModalProps) => {
	const [noticeData, setNoticeData] = useState<NoticeFormData>({
		title: '',
		content: '',
		img: null,
	})
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const { no } = useParams<{ no: string }>()
    const { addNotice, isLoading: addLoading, error: addError } = useNoticeAdd()
    const { updateNotice, isLoading: updateLoading, error: updateError } = useNoticeUpdate()

    const isLoading = addLoading || updateLoading
    const error = addError || updateError

	// 수정 모드일 때 기존 데이터로 폼 초기화
	useEffect(() => {
		if (mode === 'edit' && editData && isOpen) {
			setNoticeData({
				title: editData.title,
				content: editData.content,
				img: null, // 기존 이미지는 표시하지 않음
			})
		} else if (mode === 'create' && isOpen) {
			setNoticeData({
				title: '',
				content: '',
				img: null,
			})
		}
	}, [mode, editData, isOpen])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		setSelectedFiles(files)
		setNoticeData((prev) => ({ ...prev, img: files[0] }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!noticeData.title.trim() || !noticeData.content.trim()) {
			alert('제목과 내용을 모두 입력해주세요.')
			return
		}

		try {
			if (mode === 'create') {
				await addNotice({
					projectId: no ?? '',
					noticeData: noticeData
				})
			} else if (mode === 'edit' && editData) {
				await updateNotice({
					noticeId: editData.id.toString(),
					noticeData: noticeData
				})
			}

			// 성공 시 폼 초기화
			setNoticeData({ title: '', content: '', img: null })
			setSelectedFiles([])
			onClose()

			// 페이지 새로고침 또는 공지 목록 업데이트
			window.location.reload()
		} catch (error) {
			console.error(`공지 ${mode === 'create' ? '추가' : '수정'} 실패:`, error)
			alert(error || `공지 ${mode === 'create' ? '추가' : '수정'}에 실패했습니다. 다시 시도해주세요.`)
		}
	}

	if (!isOpen) return null

	return (
		<Modal onClose={onClose}>
			<div className='bg-white rounded-xl p-6 w-[600px] max-w-2xl max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold'>{mode === 'create' ? '공지 추가' : '공지 수정'}</h2>
					<button onClick={onClose} className='text-gray-500 hover:text-gray-700 text-2xl'>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							제목 <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							value={noticeData.title}
							onChange={(e) => setNoticeData((prev) => ({ ...prev, title: e.target.value }))}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
							placeholder='공지 제목을 입력하세요'
							maxLength={100}
						/>
						<p className='text-sm text-gray-500 mt-1'>{noticeData.title.length}/100</p>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							내용 <span className='text-red-500'>*</span>
						</label>
						<textarea
							value={noticeData.content}
							onChange={(e) => setNoticeData((prev) => ({ ...prev, content: e.target.value }))}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none'
							placeholder='공지 내용을 입력하세요'
							maxLength={1000}
						/>
						<p className='text-sm text-gray-500 mt-1'>{noticeData.content.length}/1000</p>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>이미지 (선택사항)</label>
						<input
							type='file'
							multiple
							accept='image/*'
							onChange={handleFileChange}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
						/>
						{selectedFiles.length > 0 && (
							<div className='mt-2'>
								<p className='text-sm text-gray-600'>선택된 파일:</p>
								{selectedFiles.map((file, index) => (
									<p key={index} className='text-sm text-gray-500'>
										{file.name}
									</p>
								))}
							</div>
						)}
					</div>

					{error && (
						<div className='text-red-500 text-sm mt-2'>
							{error}
						</div>
					)}

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
								? (mode === 'create' ? '추가 중...' : '수정 중...')
								: (mode === 'create' ? '추가' : '수정')
							}
						</button>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default NoticeModal

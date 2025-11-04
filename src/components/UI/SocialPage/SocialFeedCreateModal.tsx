import { useState, useEffect } from 'react'
import { useFeedCreate, useFeedEdit } from '../../../apis/social/useFeedFetch'
import Swal from 'sweetalert2'

interface SocialFeedCreateModalProps {
	isOpen: boolean
	onClose: () => void
	editMode?: boolean
	feedId?: number
	initialContent?: string
	initialImages?: string[]
}

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const SocialFeedCreateModal = ({ isOpen, onClose, editMode = false, feedId, initialContent = '', initialImages = [] }: SocialFeedCreateModalProps) => {
	const [content, setContent] = useState(initialContent)
	const [images, setImages] = useState<File[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages)
	const { createFeed } = useFeedCreate()
	const { editFeed } = useFeedEdit()

	// 초기 데이터 설정 - 모달이 열릴 때만 실행
	useEffect(() => {
		if (isOpen) {
			setContent(initialContent)
			setPreviewUrls(initialImages)
			setImages([])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen])

	if (!isOpen) return null

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files)
			setImages(filesArray)

			// 미리보기 URL 생성
			const urls = filesArray.map((file) => URL.createObjectURL(file))
			setPreviewUrls(urls)
		}
	}

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index)
		const newUrls = previewUrls.filter((_, i) => i !== index)
		setImages(newImages)
		setPreviewUrls(newUrls)
	}

	const handleSubmit = async () => {
		// 내용과 이미지 둘 다 없으면 에러
		if (!content.trim() && images.length === 0 && previewUrls.length === 0) {
			Swal.fire({
				title: '경고',
				text: '내용 또는 이미지를 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
		}

		if (editMode && feedId) {
			// 수정 모드
			await editFeed({
				id: feedId,
				text: content.trim() || null,
				img: images.length > 0 ? images : null,
			})
			// 서버가 처리할 시간을 주기 위해 딜레이 추가
			await new Promise((resolve) => setTimeout(resolve, 800))
		} else {
			// 생성 모드
			await createFeed({
				text: content.trim() || null,
				imgs: images.length > 0 ? images : null,
			})
			await new Promise((resolve) => setTimeout(resolve, 800))
		}
		handleClose()
		window.location.reload()
	}

	const handleClose = () => {
		setContent('')
		setImages([])
		setPreviewUrls([])
		onClose()
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm' onClick={handleClose}>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
				{/* 헤더 */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<h2 className='text-2xl font-bold text-gray-800'>{editMode ? '피드 수정' : '피드 작성'}</h2>
					<button onClick={handleClose} className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>
				</div>

				{/* 본문 */}
				<div className='p-6 space-y-4'>
					{/* 텍스트 입력 */}
					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>내용</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder='무슨 일이 일어나고 있나요?'
							className='w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none transition-colors duration-200'
							rows={5}
						/>
						<div className='text-right text-sm text-gray-400 mt-1'>{content.length} / 500</div>
					</div>

					{/* 이미지 업로드 */}
					<div>
						<label className='block text-sm font-semibold text-gray-700 mb-2'>이미지 (선택)</label>
						<div className='relative'>
							<input type='file' id='image-upload' accept='image/*' multiple onChange={handleImageChange} className='hidden' />
							<label
								htmlFor='image-upload'
								className='flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
									/>
								</svg>
								<span className='text-gray-600 font-medium'>이미지 선택</span>
							</label>
						</div>

						{/* 이미지 미리보기 */}
						{previewUrls.length > 0 && (
							<div className='grid grid-cols-3 gap-3 mt-4'>
								{previewUrls.map((url, index) => (
									<div key={index} className='relative group'>
										<img src={`${baseUrl}/img/${url}`} alt={`미리보기 ${index + 1}`} className='w-full h-24 object-cover rounded-lg' />
										<button
											onClick={() => handleRemoveImage(index)}
											className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600'>
											<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* 푸터 */}
				<div className='flex gap-3 p-6 border-t border-gray-200'>
					<button onClick={handleClose} className='flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200'>
						취소
					</button>
					<button
						onClick={handleSubmit}
						className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 transition-all duration-200'>
						{editMode ? '수정하기' : '게시하기'}
					</button>
				</div>
			</div>
		</div>
	)
}

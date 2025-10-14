import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useCreateStore } from '../store/store'

const ProjectMediaPage: React.FC = () => {
	const navigate = useNavigate()
	const { state } = useLocation()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const videoInputRef = useRef<HTMLInputElement>(null)
	const { setContent, setTitleImg, setImgs } = useCreateStore()

	// ProjectInfoPage에서 전달된 데이터가 없으면 이전 페이지로 이동
	useEffect(() => {
		if (!state) {
			navigate('/project/create')
		}
	}, [navigate, state])

	useEffect(() => {
		setTitleImg(null)
		setImgs([])
	}, [])

	const MAX_IMAGES = 10
	const MAX_VIDEOS = 3

	const [formData, setFormData] = useState({
		thumbnail: null as File | null,
		thumbnailPreview: state?.thumbnailPreview || '',
		images: [] as { file: File; preview: string }[],
		videos: [] as { file: File; preview: string }[],
		summary: '',
		story: '',
	})

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			// 파일 크기 검사 (1MB 이하)
			if (file.size > 1 * 1024 * 1024) {
				Swal.fire({
					icon: 'error',
					title: '파일 크기 초과',
					text: '대표 이미지는 1MB 이하의 파일만 업로드 가능합니다.',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				return
			}

			const reader = new FileReader()
			reader.onloadend = () => {
				setFormData((prev) => ({
					...prev,
					thumbnail: file,
					thumbnailPreview: reader.result as string,
				}))
			}
			setTitleImg(file)
			reader.readAsDataURL(file)
		}
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			const remainingSlots = MAX_IMAGES - formData.images.length
			if (remainingSlots <= 0) {
				Swal.fire({
					icon: 'error',
					title: '업로드 제한',
					text: `이미지는 최대 ${MAX_IMAGES}개까지 업로드 가능합니다.`,
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				return
			}

			const validFiles = Array.from(files).slice(0, remainingSlots)

			// 파일 크기 검사 (각 파일 1MB 이하)
			const oversizedFiles = validFiles.filter((file) => file.size > 1 * 1024 * 1024)
			if (oversizedFiles.length > 0) {
				Swal.fire({
					icon: 'error',
					title: '파일 크기 초과',
					text: '이미지 파일은 1MB 이하여야 합니다.',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				return
			}

			const newImages = validFiles.map((file) => ({
				file,
				preview: URL.createObjectURL(file),
			}))

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...newImages].slice(0, MAX_IMAGES),
			}))

			if (imageInputRef.current) {
				imageInputRef.current.value = ''
			}
			const currentImgs = useCreateStore.getState().imgs
			setImgs([...currentImgs, ...validFiles])
		}
	}

	const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (files) {
			const remainingSlots = MAX_VIDEOS - formData.videos.length
			if (remainingSlots <= 0) {
				Swal.fire({
					icon: 'error',
					title: '업로드 제한',
					text: `동영상은 최대 ${MAX_VIDEOS}개까지 업로드 가능합니다.`,
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				return
			}

			const validFiles = Array.from(files).slice(0, remainingSlots)

			// 파일 형식 및 크기 검사
			const invalidFiles = validFiles.filter((file) => {
				const fileName = file.name.toLowerCase()
				const isValidFormat = fileName.endsWith('.mp4') || fileName.endsWith('.webm') || file.type === 'video/mp4' || file.type === 'video/webm'
				const isSizeValid = file.size <= 1 * 1024 * 1024 // 1MB
				return !isValidFormat || !isSizeValid
			})

			if (invalidFiles.length > 0) {
				Swal.fire({
					icon: 'error',
					title: '파일 오류',
					text: '동영상은 MP4, WebM 형식만 가능하며, 최대 1MB까지 업로드 가능합니다.',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
				return
			}

			const newVideos = validFiles.map((file) => ({
				file,
				preview: URL.createObjectURL(file),
			}))

			setFormData((prev) => ({
				...prev,
				videos: [...prev.videos, ...newVideos].slice(0, MAX_VIDEOS),
			}))

			if (videoInputRef.current) {
				videoInputRef.current.value = ''
			}
		}
	}

	const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.dataTransfer.effectAllowed = 'move'
		e.dataTransfer.setData('text/plain', index.toString())
		setDraggedIndex(index)
		e.currentTarget.style.opacity = '0.5'
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
		e.preventDefault()
		const sourceIndex = Number(e.dataTransfer.getData('text/plain'))

		if (sourceIndex === targetIndex) return

		const newImages = [...formData.images]
		const [movedItem] = newImages.splice(sourceIndex, 1)
		newImages.splice(targetIndex, 0, movedItem)

		setFormData((prev) => ({
			...prev,
			images: newImages,
		}))

		e.currentTarget.style.opacity = '1'
	}

	const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
		e.currentTarget.style.opacity = '1'
		setDraggedIndex(null)
	}

	const removeImage = (index: number) => {
		const newImages = [...formData.images]
		const removed = newImages.splice(index, 1)
		URL.revokeObjectURL(removed[0].preview)
		setFormData((prev) => ({
			...prev,
			images: newImages,
		}))
	}

	const removeVideo = (index: number) => {
		const newVideos = [...formData.videos]
		const removed = newVideos.splice(index, 1)
		URL.revokeObjectURL(removed[0].preview)
		setFormData((prev) => ({
			...prev,
			videos: newVideos,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.thumbnailPreview) {
			Swal.fire({
				icon: 'error',
				title: '대표 이미지 필요',
				text: '대표 이미지를 업로드해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (formData.images.length === 0) {
			Swal.fire({
				icon: 'error',
				title: '이미지 필요',
				text: '최소 1개 이상의 이미지를 업로드해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (!formData.summary.trim()) {
			Swal.fire({
				icon: 'error',
				title: '프로젝트 요약 필요',
				text: '프로젝트 요약을 작성해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (!formData.story.trim()) {
			Swal.fire({
				icon: 'error',
				title: '프로젝트 스토리 필요',
				text: '프로젝트 스토리를 작성해주세요.',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		// 폼 데이터 처리 로직 (예: 서버 전송)
		console.log('프로젝트 전체 데이터:', {
			...state, // ProjectInfoPage에서 전달된 데이터 (대표 이미지 포함)
			images: formData.images.map((f) => f.file),
			videos: formData.videos.map((f) => f.file),
			summary: formData.summary,
			story: formData.story,
		})

		// 다음 단계(프로젝트 소개 페이지)로 이동
		navigate('/project/introduction', {
			state: {
				...state, // ProjectInfoPage에서 전달된 데이터
				thumbnail: formData.thumbnail,
				thumbnailPreview: formData.thumbnailPreview,
				images: formData.images,
				videos: formData.videos,
				summary: formData.summary,
				story: formData.story,
			},
		})
	}

	const isFormValid = () => {
		return (
			formData.thumbnailPreview !== '' && // 대표 이미지 필수
			formData.images.length > 0 && // 최소 1개 이상의 이미지 필수
			formData.summary.trim() !== '' && // 프로젝트 한줄소개 필수
			formData.story.trim() !== '' // 프로젝트 요약 필수
		)
	}

	const scriptChange = (e: any) => {
		setFormData((prev) => ({ ...prev, summary: e.target.value }))
		setContent(formData.summary)
	}

	return (
		<div className='max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen'>
			<form onSubmit={handleSubmit} className='flex flex-col gap-8'>
				<h2 className='text-3xl font-bold text-gray-800 mt-8 mb-8 text-center relative pb-4 after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-15 after:h-1 after:bg-purple-500 after:rounded-sm'>
					프로젝트 미디어 및 스토리
				</h2>

				<div className='bg-white rounded-lg p-8 shadow-sm transition-all duration-300 mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
						대표 이미지 <span className='text-red-500'>*</span>
					</h3>
					<p className='text-sm text-gray-600 mb-6'>프로젝트를 대표하는 썸네일 이미지를 업로드해주세요.</p>
					<div
						onClick={() => fileInputRef.current?.click()}
						className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-4 ${
							formData.thumbnailPreview ? 'border-purple-500 border-solid' : 'border-gray-300 hover:border-purple-500'
						}`}>
						{formData.thumbnailPreview ? (
							<img src={formData.thumbnailPreview} alt='대표 이미지 미리보기' className='max-w-full max-h-72 object-contain mx-auto' />
						) : (
							<div>
								<p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
								<p className='text-xs text-gray-500'>권장 사이즈: 1200x675px (16:9 비율)</p>
							</div>
						)}
						<input type='file' ref={fileInputRef} onChange={handleThumbnailChange} accept='image/*' className='hidden' required />
					</div>
				</div>

				<div className='bg-white rounded-lg p-8 shadow-sm transition-all duration-300 mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
						프로젝트 이미지 <span className='text-red-500'>*</span>{' '}
						<span className='text-sm text-gray-600 font-normal'>
							({formData.images.length}/{MAX_IMAGES})
						</span>
					</h3>
					<p className='text-sm text-gray-600 mb-6'>프로젝트를 소개할 이미지를 업로드하세요. (최대 {MAX_IMAGES}개, 각 파일 최대 1MB)</p>

					<div
						onClick={() => imageInputRef.current?.click()}
						className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-4 hover:border-purple-500'>
						<div>
							<p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
							<p className='text-xs text-gray-500'>모든 이미지 형식 (최대 1MB)</p>
							<p className={`text-xs ${formData.images.length >= MAX_IMAGES ? 'text-red-500' : 'text-gray-500'}`}>{`업로드 가능: ${MAX_IMAGES - formData.images.length}개`}</p>
						</div>
						<input type='file' ref={imageInputRef} onChange={handleImageUpload} accept='image/*' multiple disabled={formData.images.length >= MAX_IMAGES} className='hidden' />
					</div>

					{formData.images.length > 0 && (
						<>
							<p className='mb-2'>
								업로드된 이미지 ({formData.images.length}/{MAX_IMAGES}):
							</p>
							<div className='flex flex-wrap gap-4 mt-4'>
								{formData.images.map((image, index) => (
									<div
										key={`img-${index}`}
										draggable
										onDragStart={(e) => handleDragStart(e, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDrop={(e) => handleDrop(e, index)}
										onDragEnd={handleDragEnd}
										className='relative w-25 h-25 border border-gray-300 rounded-md overflow-hidden mr-2.5 mb-2.5 cursor-grab transition-opacity duration-200'
										style={{
											opacity: draggedIndex === index ? 0.5 : 1,
											backgroundColor: draggedIndex === index ? '#f0f0f0' : 'transparent',
										}}>
										<img src={image.preview} alt={`이미지 ${index + 1}`} className='w-full h-full object-cover pointer-events-none' />
										<div className='absolute top-0.5 left-0.5 bg-black bg-opacity-70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold z-10'>
											{index + 1}
										</div>
										<button
											type='button'
											onClick={(e) => {
												e.stopPropagation()
												removeImage(index)
											}}
											className='absolute top-0.5 right-0.5 bg-black bg-opacity-70 text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs p-0 hover:bg-red-500'>
											×
										</button>
									</div>
								))}
							</div>
						</>
					)}
				</div>

				<div className='bg-white rounded-lg p-8 shadow-sm transition-all duration-300 mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
						프로젝트 동영상 (선택){' '}
						<span className='text-sm text-gray-600 font-normal'>
							({formData.videos.length}/{MAX_VIDEOS})
						</span>
					</h3>
					<p className='text-sm text-gray-600 mb-6'>프로젝트를 소개할 동영상을 업로드하세요. (최대 {MAX_VIDEOS}개, 각 파일 최대 1MB)</p>

					<div
						onClick={() => videoInputRef.current?.click()}
						className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-300 mb-4 hover:border-purple-500'>
						<div>
							<p>동영상을 드래그하거나 클릭하여 업로드하세요</p>
							<p className='text-xs text-gray-500'>MP4, WebM (최대 1MB, 3분 이내)</p>
							<p className={`text-xs ${formData.videos.length >= MAX_VIDEOS ? 'text-red-500' : 'text-gray-500'}`}>{`업로드 가능: ${MAX_VIDEOS - formData.videos.length}개`}</p>
						</div>
						<input
							type='file'
							ref={videoInputRef}
							onChange={handleVideoUpload}
							accept='.mp4,.webm,video/mp4,video/webm'
							multiple
							disabled={formData.videos.length >= MAX_VIDEOS}
							className='hidden'
						/>
					</div>

					{formData.videos.length > 0 && (
						<>
							<p className='mb-2'>
								업로드된 동영상 ({formData.videos.length}/{MAX_VIDEOS}):
							</p>
							<div className='flex flex-wrap gap-4 mt-4'>
								{formData.videos.map((video, index) => (
									<div key={`vid-${index}`} className='relative w-25 h-25 border border-gray-300 rounded-md overflow-hidden mr-2.5 mb-2.5'>
										<video src={video.preview} className='w-full h-full object-cover' />
										<button
											type='button'
											onClick={(e) => {
												e.stopPropagation()
												removeVideo(index)
											}}
											className='absolute top-0.5 right-0.5 bg-black bg-opacity-70 text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer text-xs p-0 hover:bg-red-500'>
											×
										</button>
									</div>
								))}
							</div>
						</>
					)}
				</div>

				<div className='bg-white rounded-lg p-8 shadow-sm transition-all duration-300 mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
						프로젝트 요약 <span className='text-red-500'>*</span>
					</h3>
					<p className='text-sm text-gray-600 mb-6'>프로젝트를 한 줄로 간단하게 소개해주세요.</p>
					<input
						type='text'
						placeholder='예: 혁신적인 기술로 일상의 문제 해결'
						maxLength={100}
						value={formData.summary}
						onChange={scriptChange}
						required
						className='w-full py-3 px-4 border border-gray-300 rounded-md text-base transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none'
					/>
				</div>

				<div className='bg-white rounded-lg p-8 shadow-sm transition-all duration-300 mb-8'>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2'>
						프로젝트 스토리 <span className='text-red-500'>*</span>
					</h3>
					<p className='text-sm text-gray-600 mb-4'>프로젝트에 대한 자세한 설명을 작성해주세요. 다음 내용을 포함하면 좋아요:</p>
					<ul className='ml-6 mb-6 text-gray-600'>
						<li>이 프로젝트를 시작하게 된 계기</li>
						<li>이 프로젝트가 해결하고자 하는 문제</li>
						<li>이 프로젝트의 차별화 포인트</li>
						<li>기대 효과 및 향후 계획</li>
					</ul>
					<textarea
						placeholder='프로젝트에 대한 자세한 설명을 작성해주세요.'
						value={formData.story}
						onChange={(e) => setFormData((prev) => ({ ...prev, story: e.target.value }))}
						required
						className='w-full min-h-36 py-3 px-4 border border-gray-300 rounded-md text-base font-inherit resize-none transition-all duration-300 focus:border-purple-500 focus:shadow-[0_0_0_2px_rgba(166,107,255,0.2)] focus:outline-none'
					/>
				</div>

				<div className='flex justify-between mt-8'>
					<button
						type='button'
						onClick={() => navigate(-1)}
						className='py-3 px-6 bg-gray-100 text-gray-600 border-none rounded-md text-base font-medium cursor-pointer transition-all duration-300 hover:bg-gray-200'>
						이전
					</button>
					<button
						type='submit'
						disabled={!isFormValid()}
						className={`py-3 px-6 border-none rounded-md text-base font-medium cursor-pointer transition-all duration-300 ${
							isFormValid() ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
						style={{ opacity: isFormValid() ? 1 : 0.6 }}>
						다음 단계로
					</button>
				</div>
			</form>
		</div>
	)
}

export default ProjectMediaPage

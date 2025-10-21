import { useRef, useState } from "react";
import Modal from "../../../layout/Modal"
import Swal from "sweetalert2";
import { useStoryUpdate } from "../../../../apis/funding/useStoryFetch";
import { useParams } from "react-router-dom";

export const StoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { updateStory, isLoading, error } = useStoryUpdate()
    const { no } = useParams<{ no: string }>()
    const MAX_IMAGES = 10
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        images: [] as { file: File; preview: string }[],
    })

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

    const closeModal = () => {
        setFormData({
            images: [],
        })
        onClose()
    }

    const handleSubmit = async () => {
		if (formData.images.length === 0) {
			Swal.fire({
				title: '경고',
				text: '이미지를 추가해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

        try {
            await updateStory({ projectId: no ?? '', imgs: formData.images.map((image) => image.file) })
            closeModal()
            window.location.reload()
        } catch (error) {
            Swal.fire({
                title: '에러',
                text: '스토리 수정에 실패했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmButtonColor: '#a66bff',
                confirmButtonText: '확인',
            })
        }
    }

    if (!isOpen) return null

	return (
		<Modal onClose={closeModal}>
			<div className='bg-white rounded-xl p-6 w-[600px] max-w-2xl max-h-[90vh] overflow-y-auto'>
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

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type='button'
                            className='bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/25 hover:-translate-y-0.5'
                            onClick={closeModal}
                        >
                            취소
                        </button>

                        <button
                            type='submit'
                            className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'
                            onClick={handleSubmit}
                        >
                            저장
                        </button>
                    </div>
			</div>
		</Modal>
	)
}

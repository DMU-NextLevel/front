import { useState } from 'react'
import { FundingOptionList } from './FundingOptionList'
import { FundingOptionForm } from './FundingOptionForm'
import { useAddFundingOption, useDeleteFundingOption, useGetFundingOptionList, useUpdateFundingOption } from '../../../../apis/funding/useFundingOptionFetch'
import Swal from 'sweetalert2'

interface FundingOptionManageModalProps {
	isOpen: boolean
	onClose: () => void
	projectId: string
}

export const FundingOptionManageModal = ({ isOpen, onClose, projectId }: FundingOptionManageModalProps) => {
	const { optionList, refetch } = useGetFundingOptionList(projectId)
	const { addFundingOption } = useAddFundingOption()
	const { updateFundingOption } = useUpdateFundingOption()
	const { deleteFundingOption } = useDeleteFundingOption()
	const [showForm, setShowForm] = useState(false)
	const [editingOption, setEditingOption] = useState<{ id: number; price: number; description: string } | null>(null)

	if (!isOpen) return null

	const handleEdit = (id: number) => {
		const option = optionList?.find((opt) => opt.id === id)
		if (option) {
			setEditingOption(option)
			setShowForm(true)
		}
	}

	const handleDelete = async (id: number) => {
		const result = await Swal.fire({
			title: '정말 삭제하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#a66bff',
			cancelButtonColor: '#9e9e9e',
			confirmButtonText: '삭제하기',
			cancelButtonText: '돌아가기',
		})
		if (result.isConfirmed) {
			try {
				await deleteFundingOption({ optionId: id })
				// 삭제 성공 후 리스트 새로고침
				refetch()
			} catch (error) {
				Swal.fire({
					title: '에러',
					text: '삭제에 실패했습니다. 다시 시도해주세요.',
					icon: 'error',
					confirmButtonColor: '#a66bff',
					confirmButtonText: '확인',
				})
			}
		}
	}

	const handleAdd = () => {
		setEditingOption(null)
		setShowForm(true)
	}

	const handleFormSubmit = async (price: number, description: string) => {
		try {
			if (editingOption) {
				// 수정 모드
				await updateFundingOption({ optionId: editingOption.id, price, description })
				console.log('수정 완료:', { id: editingOption.id, price, description })
			} else {
				// 추가 모드
				await addFundingOption({ projectId, price, description })
				console.log('추가 완료:', { price, description })
			}
			// API 성공 후 리스트 새로고침
			refetch()
			setShowForm(false)
			setEditingOption(null)
		} catch (error) {
			console.error('옵션 저장 실패:', error)
		}
	}

	const handleFormCancel = () => {
		setShowForm(false)
		setEditingOption(null)
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm' onClick={onClose}>
			<div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
				{/* 헤더 */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50'>
					<div>
						<h2 className='text-2xl font-bold text-gray-800'>펀딩 옵션 관리</h2>
						<p className='text-sm text-gray-600 mt-1'>스타터들이 선택할 수 있는 리워드 옵션을 관리하세요</p>
					</div>
				</div>

			{/* 컨텐츠 영역 */}
			<div className='p-6'>
				{showForm ? (
					// 옵션 추가/수정 폼
					<FundingOptionForm
						onSubmit={handleFormSubmit}
						onCancel={handleFormCancel}
						editMode={!!editingOption}
						initialData={editingOption || undefined}
					/>
				) : (
					// 옵션 리스트
					<>
						<button
							onClick={handleAdd}
							className='w-full py-4 px-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2'>
							<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
							</svg>
							새 옵션 추가하기
						</button>
						<FundingOptionList options={optionList || []} onEdit={handleEdit} onDelete={handleDelete} />
					</>
				)}
			</div>

				{/* 푸터 */}
				<div className='flex gap-3 p-6 border-t border-gray-200 bg-gray-50'>
					<button
						onClick={onClose}
						className='flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200'>
						닫기
					</button>
				</div>
			</div>
		</div>
	)
}


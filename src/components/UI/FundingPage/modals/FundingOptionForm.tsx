import { useState } from 'react'
import Swal from 'sweetalert2'

interface FundingOptionFormProps {
	onSubmit: (price: number, description: string) => void
	onCancel: () => void
	editMode?: boolean
	initialData?: {
		price: number
		description: string
	}
}

export const FundingOptionForm = ({ onSubmit, onCancel, editMode = false, initialData }: FundingOptionFormProps) => {
	const [price, setPrice] = useState<string>(initialData?.price.toString() || '')
	const [description, setDescription] = useState(initialData?.description || '')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// 유효성 검사
		if (!price || parseInt(price) <= 0) {
			Swal.fire({
				title: '경고',
				text: '올바른 금액을 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		if (!description.trim()) {
			Swal.fire({
				title: '경고',
				text: '옵션 설명을 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		onSubmit(parseInt(price), description.trim())
	}

	return (
		<form onSubmit={handleSubmit} className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200'>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-xl font-bold text-gray-800'>{editMode ? '옵션 수정' : '새 옵션 추가'}</h3>
			</div>

			<div className='space-y-5'>
				{/* 금액 입력 */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-2'>
						옵션 금액 <span className='text-red-500'>*</span>
					</label>
					<div className='relative'>
						<input
							type='number'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder='10000'
							className='w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-white'
							min='0'
						/>
						<span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>P</span>
					</div>
					<p className='text-xs text-gray-500 mt-1'>후원자가 선택할 때 표시될 금액입니다</p>
				</div>

				{/* 설명 입력 */}
				<div>
					<label className='block text-sm font-semibold text-gray-700 mb-2'>
						옵션 설명 <span className='text-red-500'>*</span>
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='이 옵션에 대한 자세한 설명을 입력해주세요.'
						className='w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none transition-colors duration-200 bg-white'
						rows={4}
					/>
					<div className='flex justify-between items-center mt-1'>
						<p className='text-xs text-gray-500'>옵션의 혜택, 포함 내역 등을 설명해주세요</p>
						<span className='text-xs text-gray-400'>{description.length} / 200</span>
					</div>
				</div>
			</div>

			{/* 버튼 */}
			<div className='flex gap-3 mt-6'>
				<button
					type='button'
					onClick={onCancel}
					className='flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200'>
					취소
				</button>
				<button
					type='submit'
					className='flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200'>
					{editMode ? '수정하기' : '추가하기'}
				</button>
			</div>
		</form>
	)
}


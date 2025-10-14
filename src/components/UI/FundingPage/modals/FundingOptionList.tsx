interface FundingOption {
    id: number
    price: number
    description: string
}

interface FundingOptionListProps {
	options: FundingOption[]
	onEdit: (id: number) => void
	onDelete: (id: number) => void
}

export const FundingOptionList = ({ options, onEdit, onDelete }: FundingOptionListProps) => {
	if (options.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-16 text-gray-400'>
				<svg xmlns='http://www.w3.org/2000/svg' className='h-16 w-16 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
					<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
				</svg>
				<p className='text-lg font-medium'>등록된 옵션이 없습니다</p>
				<p className='text-sm mt-2'>새 옵션 추가 버튼을 눌러 첫 옵션을 만들어보세요!</p>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			{options.map((option) => (
				<div key={option.id} className='border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all duration-200 hover:shadow-md bg-white'>
					<div className='flex justify-between items-start'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h3 className='text-lg font-bold text-gray-800'>{option.description}</h3>
								<span className='px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full'>
									{option.price.toLocaleString()}P
								</span>
							</div>
						</div>

						{/* 수정/삭제 버튼 */}
						<div className='flex gap-2 ml-4'>
							<button
								onClick={() => onEdit(option.id)}
								className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-1'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
								</svg>
								수정
							</button>
							<button
								onClick={() => onDelete(option.id)}
								className='px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 hover:shadow-md active:scale-95 transition-all duration-200 flex items-center gap-1'>
								<svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
								</svg>
								삭제
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}


// CategorySelector.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Category {
	label: string
	icon: string
	tag: string
}

interface Props {
	categories: Category[]
	selectedTag?: string
	onSelect?: (tag: string) => void // 선택 콜백은 선택사항
}

const categories = [
	{ label: '전체', icon: 'bi bi-circle', tag: '' },
	{ label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
	{ label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
	{ label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
	{ label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
	{ label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
	{ label: '게임', icon: 'bi bi-controller', tag: '6' },
	{ label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
	{ label: '반려동물', icon: 'bi bi-star', tag: '8' },
	{ label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
	{ label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
]

const CategorySelector: React.FC<Props> = ({ categories }) => {
	const navigate = useNavigate()

	const handleClick = (tag: string) => {
		navigate(`/search?tag=${tag}`)
	}

	return (
		<div className='flex h-16 sm:h-20 md:h-24 lg:h-28 px-2 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-2 sm:pb-3 md:pb-4 items-center justify-between gap-2 sm:gap-3 md:gap-4'>
			{categories.map((cat) => (
				<div
					key={cat.tag}
					onClick={() => handleClick(cat.tag)}
					className='flex flex-col items-center text-xs sm:text-sm md:text-[15px] lg:text-[16px] min-w-[60px] sm:min-w-[70px] md:min-w-[75px] lg:min-w-[85px] text-gray-700 cursor-pointer transition-all duration-200 hover:text-purple-500 hover:font-bold hover:-translate-y-0.5 snap-start group flex-shrink-0'
				>
					<div className='w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-gray-100 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 transition-colors duration-200 group-hover:bg-purple-500'>
						<i className={`${cat.icon} text-[18px] sm:text-[20px] md:text-[22px] text-gray-600 transition-colors duration-200 group-hover:text-white`}></i>
					</div>
					<span className='whitespace-nowrap text-center leading-tight'>{cat.label}</span>
				</div>
			))}
		</div>
	)
}

export default CategorySelector

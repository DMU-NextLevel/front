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
		<div className='flex overflow-x-auto h-16 sm:h-18 md:h-20 px-3 sm:px-4 md:px-5 py-2 md:py-3 items-center gap-4 sm:gap-6 md:gap-8 scrollbar-hide snap-x snap-mandatory'>
			{categories.map((cat) => (
				<div
					key={cat.tag}
					onClick={() => handleClick(cat.tag)}
					className='flex flex-col items-center text-[11px] sm:text-[12px] md:text-[13px] min-w-[64px] sm:min-w-[72px] md:min-w-[80px] text-gray-700 cursor-pointer transition-all duration-200 hover:text-purple-500 hover:font-bold hover:-translate-y-0.5 snap-start'>
					<i className={`${cat.icon} text-[18px] sm:text-[20px] md:text-[22px] mb-1 sm:mb-1.5`}></i>
					<span className='whitespace-nowrap'>{cat.label}</span>
				</div>
			))}
		</div>
	)
}

export default CategorySelector

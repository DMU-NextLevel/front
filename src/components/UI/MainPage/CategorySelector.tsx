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
		<div className='flex overflow-x-auto h-20 px-5 py-3 items-center justify-between'>
			{categories.map((cat) => (
				<div
					key={cat.tag}
					onClick={() => handleClick(cat.tag)}
					className='flex flex-col items-center text-[13px] min-w-[80px] text-gray-700 cursor-pointer transition-all duration-200 hover:text-purple-500 hover:font-bold hover:-translate-y-0.5'>
					<i className={`${cat.icon} text-[22px] mb-1.5`}></i>
					<span>{cat.label}</span>
				</div>
			))}
		</div>
	)
}

export default CategorySelector

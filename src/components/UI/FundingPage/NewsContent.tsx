import React, { JSX, useState } from 'react'

interface NewsContentProps {
	title: string
	content: string
}

const NewsContent: React.FC<NewsContentProps> = ({ title, content }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleClick = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<div className='flex flex-col w-full border border-black mb-2.5'>
			<div className={`text-xl p-2.5 ${isOpen ? 'border-b border-black' : ''} bg-gray-100 cursor-pointer`} onClick={handleClick}>
				{title}
			</div>
			{isOpen ? <div className='text-sm p-2.5'>{content}</div> : ''}
		</div>
	)
}

export default NewsContent

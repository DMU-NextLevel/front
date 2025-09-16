import React, { JSX } from 'react'

interface props {
	title: string
	score: number
}

const StarterScore = ({ title, score }: props): JSX.Element => {
	return (
		<div className='flex flex-col w-15 gap-1.5 mr-5'>
			<span className='text-base'>{title}</span>
			<div className='w-full h-2 bg-gray-200 rounded overflow-hidden'>
				<div className='h-full bg-purple-500 transition-all duration-300 ease-in-out' style={{ width: `${score}%` }} />
			</div>
		</div>
	)
}

export default StarterScore

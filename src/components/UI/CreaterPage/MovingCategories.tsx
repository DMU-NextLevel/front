import React from 'react'

const categories = [
	'프리랜서',
	'대기업',
	'중소기업',
	'스타트업',
	'인플루언서',
	'부업',
	'유튜버',
	'크리에이터',
	'1인 사업자',
	'프리랜서',
	'대기업',
	'중소기업',
	'스타트업',
	'인플루언서',
	'부업',
	'유튜버',
	'크리에이터',
	'1인 사업자',
	'프리랜서',
	'대기업',
	'중소기업',
	'스타트업',
	'인플루언서',
	'부업',
	'유튜버',
	'크리에이터',
	'1인 사업자',
]

const MovingCategories = () => {
	return (
		<div className='relative bottom-0 left-0 w-full h-30 backdrop-blur-sm border-t border-slate-200 border-opacity-30'>
			<div className='flex items-center h-full animate-move-right whitespace-nowrap'>
				{categories.map((category, index) => (
					<div
						key={index}
						className='inline-flex items-center justify-center bg-white border border-slate-200 rounded-full px-6 py-3 mx-4 text-sm font-medium text-slate-600 shadow-sm transition-all duration-300 min-w-fit hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-500 hover:text-cyan-500'>
						{category}
					</div>
				))}
			</div>
		</div>
	)
}

export default MovingCategories

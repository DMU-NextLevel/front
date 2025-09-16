import React from 'react'
import MovingCategories from './MovingCategories'

const FundingHero = () => {
	return (
		<div className='min-h-[300px] bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden'>
			<div className='max-w-3xl mb-0'>
				<p className='text-lg text-slate-500 mb-4 font-normal'>저도 자격이 될까요?</p>
				<h1 className='text-2xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight'>
					위드유 펀딩 서비스는
					<br />
					<span className='text-cyan-500'>개인, 개인 사업자, 법인 사업자</span>까지
					<br />
					누구나 이용할 수 있습니다.
				</h1>
				<p className='text-xl md:text-2xl text-slate-600 font-medium'></p>
			</div>
			<MovingCategories />
		</div>
	)
}

export default FundingHero

import React from 'react';
import { useNavigate } from 'react-router-dom'

const PromoBanner = () => {
	const navigate = useNavigate()
	return (
		<div className='bg-gradient-to-b from-purple-500 to-blue-200 py-8 sm:py-12 lg:py-16 px-5 sm:px-8 lg:px-24 rounded-lg text-left m-0'>
			<h2 className='text-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-4'>좋은 아이디어를 수익화 해보는건 어떤가요?</h2>
			<div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6'>
				<p className='text-white text-base sm:text-lg lg:text-xl leading-relaxed'>
					프로젝트를 등록해서 스타터가 되어보세요! <br />
					저희가 당신과 함께 하겠습니다, <span className='font-bold text-white'>withU</span>
				</p>
				<button
					className='self-start lg:self-auto bg-blue-200 text-white py-2.5 sm:py-3 px-5 sm:px-6 border-none rounded-lg cursor-pointer text-sm sm:text-base font-bold transition-colors duration-300 hover:bg-purple-500'
					onClick={() => navigate('/creater')}>
					프로젝트 등록하기
				</button>
			</div>
		</div>
	)
}

export default PromoBanner;
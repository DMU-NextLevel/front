import React from 'react';
import { useNavigate } from 'react-router-dom'

const PromoBanner = () => {
	const navigate = useNavigate()
	return (
		<div className='bg-gradient-to-b from-purple-500 to-blue-200 py-16 px-24 rounded-lg text-left m-0'>
			<h2 className='text-white text-3xl font-bold mb-4'>좋은 아이디어를 수익화 해보는건 어떤가요?</h2>
			<div className='flex items-center justify-between'>
				<p className='text-white text-xl leading-relaxed'>
					프로젝트를 등록해서 스타터가 되어보세요! <br />
					저희가 당신과 함께 하겠습니다, <span className='font-bold text-white'>withU</span>
				</p>
				<button
					className='bg-blue-200 text-white py-3 px-6 border-none rounded-lg cursor-pointer text-base font-bold transition-colors duration-300 hover:bg-purple-500'
					onClick={() => navigate('/creater')}>
					프로젝트 등록하기
				</button>
			</div>
		</div>
	)
}

export default PromoBanner;
import React from 'react'

// active prop 타입 정의
interface TabProps {
	active?: boolean
}

const PricingPage: React.FC = () => {
	return (
		<div className='font-sans bg-white text-gray-900 text-center py-15 px-5'>
			<p className='text-lg font-semibold text-gray-500 mb-3'>위드유의 도움을 받을 수 있나요?</p>
			<h1 className='text-3xl font-bold mb-4 leading-relaxed'>
				메이커 회원님의 필요에 따라 <br />
				적합한 <span className='text-cyan-500'>요금제</span>를 선택하여 진행할 수 있습니다.
			</h1>

			<div className='flex justify-center my-10 mb-8 border-b border-gray-200'>
				<div className='text-base font-bold text-gray-900 mx-5 pb-3 border-b-3 border-gray-900 cursor-pointer'>펀딩·프리오더 요금제</div>
				<div className='text-base font-medium text-gray-500 mx-5 pb-3 cursor-pointer'>스토어 요금제(준비중)</div>
			</div>

			<div className='flex justify-center gap-5 mt-8 flex-wrap'>
				<div className='bg-gray-50 rounded-3xl py-10 px-8 w-75 text-center'>
					<div className='inline-block text-white text-xs font-bold py-1.5 px-3.5 rounded-xl mb-5' style={{ backgroundColor: '#2b2d30' }}>
						Expert
					</div>
					<h3 className='text-lg font-bold mb-3'>엑스퍼트 요금제</h3>
					<p className='text-sm text-gray-700 leading-relaxed'>
						전문가의 컨설팅을 통해서 <br />
						최상의 서비스를 안내받을 수 있어요
					</p>
				</div>

				<div className='bg-gray-50 rounded-3xl py-10 px-8 w-75 text-center'>
					<div className='inline-block text-white text-xs font-bold py-1.5 px-3.5 rounded-xl mb-5' style={{ backgroundColor: '#00c4c4' }}>
						Pro
					</div>
					<h3 className='text-lg font-bold mb-3'>프로 요금제</h3>
					<p className='text-sm text-gray-700 leading-relaxed'>
						위드유 전담 매니저를 통해서 <br />
						필요한 서비스를 제공받을 수 있어요.
					</p>
				</div>

				<div className='bg-gray-50 rounded-3xl py-10 px-8 w-75 text-center'>
					<div className='inline-block text-white text-xs font-bold py-1.5 px-3.5 rounded-xl mb-5' style={{ backgroundColor: '#a5f0e3' }}>
						Basic
					</div>
					<h3 className='text-lg font-bold mb-3'>베이직 요금제</h3>
					<p className='text-sm text-gray-700 leading-relaxed'>
						<strong>직접</strong> 위드유 서비스를 선택하여 <br />
						프로젝트를 진행할 수 있어요.
					</p>
				</div>
			</div>

			<p className='text-xs text-gray-500 mt-10'>
				* 각 요금제의 혜택, 수수료 등에 대한 상세한 정보는 프로젝트 만들기 단계에서 확인할 수 있습니다.
				<span className='text-gray-900 font-semibold ml-2 cursor-pointer'>
					<a href='/project/create'>프로젝트 시작하기 {'>'}</a>
				</span>
			</p>
		</div>
	)
}

export default PricingPage

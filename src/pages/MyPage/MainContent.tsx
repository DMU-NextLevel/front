import React from 'react'

interface Props {
	userInfo: { name: string }
	fundingCount: number
	point: number
	onHandleClick: (label: string) => void // ✅ 이름 변경
}

const MainContent: React.FC<Props> = ({ userInfo, fundingCount, point, onHandleClick }) => {
	return (
		<main className='flex-1 min-w-0 py-10 px-4 bg-white overflow-x-hidden'>
			<div className='mb-8'>
				<h2 className='text-xl font-bold mb-3'>{userInfo.name}님 안녕하세요.</h2>
				<div className='bg-purple-500 p-4 rounded-xl font-medium mb-5 text-white'>당신의 아이디어, 펀딩으로 연결하세요!</div>
				<div className='grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{['펀딩+', '스토어', '지지서명', '알림신청', '포인트', '쿠폰'].map((label) => {
						let value: React.ReactNode

						if (label === '지지서명' || label === '알림신청') {
							value = (
								<button onClick={() => onHandleClick(label)} className='bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600'>
									보기
								</button>
							)
						} else if (label === '포인트') {
							value = <strong className='text-blue-600'>{point.toLocaleString()}P</strong>
						} else if (label === '펀딩+') {
							value = <strong className='text-blue-600'>{fundingCount}</strong>
						} else if (label === '스토어') {
							value = <strong className='text-blue-600'>0</strong>
						} else if (label === '쿠폰') {
							value = <strong className='text-blue-600'>2장</strong>
						}

						return (
							<div key={label} className='bg-gray-50 p-4 rounded-lg text-center border hover:shadow-md transition-shadow'>
								<span className='block text-sm text-gray-600 mb-2'>{label}</span>
								{value}
							</div>
						)
					})}
				</div>
			</div>

			<h3 className='text-lg font-semibold mb-4 text-gray-800'>최근 본 프로젝트 👀</h3>
			<div className='flex gap-4 overflow-x-auto pb-2'>
				{[...Array(5)].map((_, i) => (
					<div key={i} className='min-w-[120px] bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow'>
						<img
							src='https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510'
							alt={`상품${i + 1}`}
							className='w-full h-20 object-cover'
						/>
						<div className='text-xs text-purple-600 font-semibold p-2'>28,000원</div>
					</div>
				))}
			</div>
		</main>
	)
}

export default MainContent

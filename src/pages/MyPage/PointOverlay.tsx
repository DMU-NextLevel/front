import React from 'react'

interface Props {
	point: number
	onClose: () => void
	openPaymentWindow: (amount: number) => void
}

const PointOverlay: React.FC<Props> = ({ point, onClose, openPaymentWindow }) => {
	return (
		<div className='fixed top-1/2 left-1/2 w-[500px] transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl z-[1000]'>
			<div className='flex justify-between items-center mb-5'>
				<h2 className='text-xl font-bold'>포인트 충전</h2>
				<button className='text-2xl border-none bg-transparent cursor-pointer' onClick={onClose}>
					×
				</button>
			</div>
			<div className='mt-5'>
				<div className='text-lg font-bold mb-8'>
					현재 보유 포인트: <strong>{point.toLocaleString()}P</strong>
				</div>
				<div className='bg-gray-50 rounded-xl p-5 text-center'>
					<p>충전하실 금액을 선택하세요</p>
					<div className='mt-4 flex justify-center gap-3'>
						{[1000, 5000, 10000, 20000].map((amount) => (
							<button
								key={amount}
								className='py-2.5 px-4 rounded-lg bg-purple-500 text-white border-none cursor-pointer font-bold text-sm hover:bg-purple-600'
								onClick={() => openPaymentWindow(amount)}>
								{amount.toLocaleString()}P
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default PointOverlay

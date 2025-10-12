import { JSX, useState } from 'react'
import { RewardData } from './modals/FundingModal'

interface FundingPayProps {
	reward: RewardData | undefined
}

const FundingPay = ({ reward }: FundingPayProps): JSX.Element => {
	const termsList = ['[필수] 구매조건, 결제 진행 및 결제 대행 서비스 동의', '[필수] 개인정보 제3자 제공 동의', '[필수] 책임 규정에 대한 동의']
	const [allAgree, setAllAgree] = useState(false)
	const [coupon, setCoupon] = useState<number>(0)
	const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))

	const handleTermChange = (index: number) => {
		const updated = [...checkedTerms]
		updated[index] = !updated[index]
		setCheckedTerms(updated)
		setAllAgree(updated.every(Boolean))
	}

	// reward 데이터에서 price 가져오기
	const getRewardPrice = (): number => {
		if (!reward) {
			return 0
		}
		return reward.data.price
	}

	const rewardPrice = getRewardPrice()

	return (
		<div className='m-5'>
			<div className='border-t-4 border-b-4 border-gray-100 py-4 px-2'>
				<p className='text-purple-500 font-bold text-lg mb-2'>선택한 리워드</p>
				<p className='text-gray-600 mb-2'>{reward?.type === 'free' ? '자유로운 후원' : '옵션 리워드'}</p>
				<div className='flex justify-between items-center mt-3'>
					<p className='text-gray-700 font-medium'>후원 금액</p>
					<p className='text-purple-600 font-bold text-xl'>{rewardPrice.toLocaleString()}P</p>
				</div>
			</div>
			<div className='flex justify-between py-2.5 px-5 bg-gray-100 mt-2.5 rounded-lg'>
				<p className='font-medium'>쿠폰</p>
				<select className='border border-gray-300 rounded px-2 py-1 text-sm'>
					<option>쿠폰을 선택해주세요.</option>
				</select>
			</div>
			<div className='my-8 pb-2.5 border-b-4 border-gray-100'>
				<div className='flex justify-between my-2.5 text-gray-700'>
					<span>리워드 금액</span>
					<span className='font-semibold'>{rewardPrice.toLocaleString()}P</span>
				</div>
				<div className='flex justify-between my-2.5 text-gray-700'>
					<span>쿠폰 금액</span>
					<span className='font-semibold text-red-500'>-{coupon.toLocaleString()}P</span>
				</div>
				<div className='flex justify-between my-2.5 font-bold text-xl mt-4'>
					<span>총 결제 금액</span>
					<span className='text-purple-600'>{(rewardPrice - coupon).toLocaleString()}P</span>
				</div>
			</div>
			<div className='bg-amber-50 border-l-4 border-amber-400 text-gray-700 py-4 px-5 rounded-lg'>
				<p className='font-bold text-amber-700 mb-2 flex items-center gap-2'>
					<span className='text-lg'>⚠️</span> 후원 유의사항
				</p>
				<ul className='space-y-1 text-sm'>
					<li>• 지금 결제를 한 경우에도 프로젝트가 종료되기 전까지 언제든 결제를 취소할 수 있어요.</li>
					<li>• 결제를 시도하기 전에 포인트가 충분한지 확인해주세요.</li>
				</ul>
			</div>
			<div className='my-8'>
				<p className='text-xl font-bold text-gray-800 mb-4'>약관 동의</p>
				<div className='space-y-3'>
					{termsList.map((text, idx) => (
						<label key={idx} className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200'>
							<input
								type='checkbox'
								checked={checkedTerms[idx]}
								onChange={() => handleTermChange(idx)}
								className={`appearance-none w-5 h-5 border-2 border-gray-300 rounded cursor-pointer mt-0.5 transition-all duration-200 ${
									checkedTerms[idx]
										? "bg-purple-500 border-purple-500 bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e\")] bg-center bg-no-repeat"
										: ''
								}`}
							/>
							<span className='text-sm text-gray-700 flex-1'>{text}</span>
						</label>
					))}
				</div>
			</div>
		</div>
	)
}

export default FundingPay

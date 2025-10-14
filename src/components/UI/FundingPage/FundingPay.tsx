import { JSX, useEffect, useState } from 'react'
import { RewardData } from './modals/FundingModal'
import { api } from '../../../AxiosInstance'

interface FundingPayProps {
	reward: RewardData | undefined
	setReward: (reward: RewardData) => void
}

interface responseCouponList {
	message: string
	data: [
		{
			id: number
			name: string
			percent: number
		}
	]
}

interface CouponList {
	id: number
	name: string
	percent: number
}

const FundingPay = ({ reward, setReward }: FundingPayProps): JSX.Element => {
	const termsList = ['[필수] 구매조건, 결제 진행 및 결제 대행 서비스 동의', '[필수] 개인정보 제3자 제공 동의', '[필수] 책임 규정에 대한 동의']
	const [allAgree, setAllAgree] = useState(false)
	const [coupon, setCoupon] = useState<number>(0) // 쿠폰 절대값
	const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))
	const [couponList, setCouponList] = useState<CouponList[] | null>(null)

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

	useEffect(() => {
		const getCouponList = async () => {
			const response = await api.get<responseCouponList>(`/social/coupon`)
			setCouponList(response.data.data)
		}
		getCouponList()
	}, [])

	const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = parseInt(e.target.value)
		console.log(selectedId)

		if (selectedId > 0 && couponList) {
			const selectedCoupon = couponList.find((item) => item.id === selectedId)
			setCoupon(selectedCoupon?.percent ?? 0) // percent 필드에 절대값이 들어있음
			setReward({ ...reward, data: { ...reward?.data, couponId: selectedId } } as RewardData)
			console.log(reward)
		} else if (selectedId === 0) {
			setCoupon(0)
			setReward({ ...reward, data: { ...reward?.data, couponId: null } } as RewardData)
			console.log(reward)
		}
	}

	const rewardPrice = getRewardPrice()
	const finalPrice = rewardPrice - coupon // 최종 결제 금액

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
			{reward?.type === 'option' && (
				<div className='flex justify-between items-center py-4 px-5 bg-gradient-to-r from-purple-50 to-blue-50 mt-2.5 rounded-xl border border-purple-100'>
					<div className='flex items-center gap-2'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-purple-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
							/>
						</svg>
						<p className='font-semibold text-gray-800'>쿠폰</p>
					</div>
					<select
						className='border-2 border-purple-200 rounded-lg px-4 py-2 text-sm font-medium bg-white hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200 cursor-pointer'
						onChange={handleCouponChange}
						defaultValue={0}>
						<option value={0}>{couponList && couponList.length > 0 ? '쿠폰을 선택해주세요.' : '보유중인 쿠폰이 없습니다.'}</option>
						{couponList &&
							couponList.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name} ({item.percent.toLocaleString()}P)
								</option>
							))}
					</select>
				</div>
			)}
			<div className='my-8 pb-2.5 border-b-4 border-gray-100'>
				<div className='flex justify-between my-2.5 text-gray-700'>
					<span>리워드 금액</span>
					<span className='font-semibold'>{rewardPrice.toLocaleString()}P</span>
				</div>
				{coupon > 0 && (
					<div className='flex justify-between my-2.5 text-gray-700'>
						<span>쿠폰 할인</span>
						<span className='font-semibold text-red-500'>-{coupon.toLocaleString()}P</span>
					</div>
				)}
				<div className='flex justify-between my-2.5 font-bold text-xl mt-4'>
					<span>총 결제 금액</span>
					<span className='text-purple-600'>{finalPrice.toLocaleString()}P</span>
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

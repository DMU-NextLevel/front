import React, { JSX, useEffect, useState } from 'react'
import FundingReward from '../FundingReward'
import FundingPay from '../FundingPay'
import FundingFree from '../FundingFree'
import { useFundingFetch, useGetFundingOption } from '../../../../apis/funding/useFundingFetch'
import { useParams } from 'react-router-dom'

export interface OptionRewardData {
	optionId: number
	couponId: number | null
	price: number
}

export interface FreeRewardData {
	price: number
	projectId: number
}

export interface RewardData {
	type: 'option' | 'free'
	data: OptionRewardData | FreeRewardData
}

const FundingModal = (): JSX.Element => {
	const [step, setStep] = useState<number>(1)
	const [isShow, setIsShow] = useState<boolean>(false)
	const [checked, setChecked] = useState<boolean>(false)
	const [selectReward, setSelectReward] = useState<number | null>(null)
	const [reward, setReward] = useState<RewardData>()
	const { no } = useParams<{ no: string }>()
	const { fetchFunding, isLoading, error } = useFundingFetch()
	const { fundingOption } = useGetFundingOption(no ?? '')

	useEffect(() => {
		if (step === 1) {
			setIsShow(false)
		} else if (step === 2) {
			setIsShow(true)
		}
	}, [step])

	const nextClick = () => {
		setStep(2)
	}

	const handleReward = (type: 'option' | 'free', data: OptionRewardData | FreeRewardData, rewardNum: number) => {
		setReward({ type, data })
		setSelectReward(rewardNum)
	}

	const handleFundingSubmit = async () => {
		if (!reward) {
			alert('리워드를 선택해주세요')
			return
		}

		try {
			await fetchFunding({ reward })
			alert('펀딩이 완료되었습니다! 🎉')
			// 성공 후 처리 (예: 모달 닫기, 페이지 이동 등)
		} catch (error) {
			alert('펀딩에 실패했습니다. 다시 시도해주세요.')
		}
	}

	return (
		<div className='flex flex-col items-center bg-white rounded-3xl shadow-2xl h-[85vh] w-[40vw] min-w-[400px] max-w-[500px] overflow-hidden'>
			{/* 헤더 */}
			<div className='w-full bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6'>
				<h2 className='text-2xl font-bold text-white text-center mb-4'>펀딩 참여하기</h2>

				{/* 단계 표시기 */}
				<div className='flex justify-center items-center gap-4'>
					<div className='flex items-center'>
						<div
							className={`flex justify-center items-center w-12 h-12 rounded-full font-semibold text-sm transition-all duration-300 ${
								step === 1 ? 'bg-white text-purple-600 shadow-lg transform scale-110' : 'bg-purple-400 text-white'
							}`}>
							1
						</div>
						<span className={`ml-2 text-sm font-medium ${step === 1 ? 'text-white' : 'text-purple-200'}`}>리워드 선택</span>
					</div>

					<div className={`w-8 h-0.5 transition-all duration-300 ${step >= 2 ? 'bg-white' : 'bg-purple-300'}`} />

					<div className='flex items-center'>
						<div
							className={`flex justify-center items-center w-12 h-12 rounded-full font-semibold text-sm transition-all duration-300 ${
								step === 2 ? 'bg-white text-purple-600 shadow-lg transform scale-110' : 'bg-purple-400 text-white'
							}`}>
							2
						</div>
						<span className={`ml-2 text-sm font-medium ${step === 2 ? 'text-white' : 'text-purple-200'}`}>결제 정보</span>
					</div>
				</div>
			</div>

			{/* 컨텐츠 영역 */}
			<div className='flex-1 w-full overflow-y-auto px-8 py-6'>
				{!isShow ? (
					<div className='space-y-6'>
						<FundingFree checked={selectReward} setSelectReward={handleReward} />
						{Array.isArray(fundingOption) &&
							fundingOption.map((reward: any) => (
								<FundingReward
									key={reward.id}
									id={reward.id}
									price={reward.price?.toString?.()}
								title={reward.description}
								checked={selectReward}
								setSelectReward={handleReward}
							/>
						))}
					</div>
				) : (
					<div className='space-y-6'>
						<FundingPay reward={reward} setReward={setReward} />
					</div>
				)}
			</div>

			{/* 푸터 버튼 */}
			<div className='w-full px-8 py-6 bg-gray-50 border-t border-gray-200'>
				{!isShow ? (
					<button
						className='w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						disabled={selectReward == null}
						onClick={nextClick}>
						다음 단계로
					</button>
				) : (
					<button
						className='w-full h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-lg hover:transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
						onClick={handleFundingSubmit}
						disabled={isLoading}>
						{isLoading ? '처리 중...' : '💜 함께하기'}
					</button>
				)}
			</div>
		</div>
	)
}

export default FundingModal

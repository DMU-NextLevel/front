import React, { JSX, useEffect, useState } from 'react'
import FundingReward from '../FundingReward'
import FundingPay from '../FundingPay'
import FundingFree from '../FundingFree'
import { useFundingFetch, useGetFundingOption } from '../../../../apis/funding/useFundingFetch'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

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
	const [selectReward, setSelectReward] = useState<number | null>(null)
	const [reward, setReward] = useState<RewardData>()
	const { no } = useParams<{ no: string }>()
	const { fetchFunding, isLoading, error } = useFundingFetch()
	const { fundingOption } = useGetFundingOption(no ?? '')
	const termsList = ['[필수] 구매조건, 결제 진행 및 결제 대행 서비스 동의', '[필수] 개인정보 제3자 제공 동의', '[필수] 책임 규정에 대한 동의']
	const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))
	const [allAgree, setAllAgree] = useState(false)

	const handleTermChange = (index: number) => {
		const updated = [...checkedTerms]
		updated[index] = !updated[index]
		setCheckedTerms(updated)
		setAllAgree(updated.every(Boolean))
	}

	useEffect(() => {
		if (step === 1) {
			setIsShow(false)
		} else if (step === 2) {
			setIsShow(true)
		}
	}, [step])

	const nextClick = () => {
		if (reward?.type === 'free' && reward?.data.price <= 0) {
			Swal.fire({
				title: '경고',
				text: '금액을 입력해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}
		setStep(2)
	}

	const handleReward = (type: 'option' | 'free', data: OptionRewardData | FreeRewardData, rewardNum: number) => {
		setReward({ type, data })
		setSelectReward(rewardNum)
	}

	const handleFundingSubmit = async () => {
		if (!reward) {
			Swal.fire({
				title: '경고',
				text: '리워드를 선택해주세요.',
				icon: 'warning',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
			return
		}

		try {
			await fetchFunding({ reward })
			// 성공 후 처리 (예: 모달 닫기, 페이지 이동 등)
			window.location.reload()
		} catch (error) {
			Swal.fire({
				title: '에러',
				text: '펀딩에 실패했습니다. 다시 시도해주세요.',
				icon: 'error',
				confirmButtonColor: '#a66bff',
				confirmButtonText: '확인',
			})
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
									price={reward.price}
								title={reward.description}
								checked={selectReward}
								setSelectReward={handleReward}
							/>
						))}
					</div>
				) : (
					<div className='space-y-6'>
						<FundingPay reward={reward} setReward={setReward} checkedTerms={checkedTerms} termsList={termsList} handleTermChange={handleTermChange} />
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
						disabled={isLoading || !allAgree}>
						{isLoading ? '처리 중...' : '💜 함께하기'}
					</button>
				)}
			</div>
		</div>
	)
}

export default FundingModal

import React, { JSX, useEffect, useState } from 'react'
import FundingReward from '../FundingReward'
import FundingPay from '../FundingPay'
import FundingFree from '../FundingFree'

const exam = [
	{
		id: 1,
		price: '20000P',
		title: '제목인데요?',
		description: `설명인데요?`,
		date: '2025년 3월 말 제공 예정',
	},
]

const FundingModal = (): JSX.Element => {
	const [step, setStep] = useState<Number>(1)
	const [isShow, setIsShow] = useState<boolean>(false)
	const [checked, setChecked] = useState<boolean>(false)
	const [selectReward, setSelectReward] = useState<Number | null>(null)

	useEffect(() => {
		if (step === 1) {
			setIsShow(false)
		} else if (step === 2) {
			setIsShow(true)
		}
	}, [step])

	const nextClick = () => {
		setStep(2)
		setSelectReward(null)
	}

	// 디버깅용
	const moveStep = (step: number) => {
		setStep(step)
	}

	return (
		<div className='flex flex-col items-center border-none rounded-[60px] h-[80vh] bg-white w-[30vw] p-8'>
			<div className='w-full flex justify-center items-center gap-[1vw]'>
				<div
					className={`flex justify-center items-center w-20 h-20 font-bold ${step === 1 ? 'text-black' : 'text-gray-400'} rounded-full ${
						step === 1 ? 'border-4 border-dashed border-purple-500' : 'border-2 border-dashed border-gray-400'
					} m-1.5`}
					onClick={() => moveStep(1)}>
					리워드
				</div>
				<div className='w-[15%] h-0 border-b-4 border-dashed border-gray-100 rounded-3xl' />
				<div
					className={`flex justify-center items-center w-20 h-20 font-bold ${step === 2 ? 'text-black' : 'text-gray-400'} rounded-full ${
						step === 2 ? 'border-4 border-dashed border-purple-500' : 'border-2 border-dashed border-gray-400'
					} m-1.5`}
					onClick={() => moveStep(2)}>
					결제
				</div>
			</div>
			<div className='w-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:max-h-2.5 [&::-webkit-scrollbar]:rounded-xl [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:max-h-2.5 [&::-webkit-scrollbar-thumb]:rounded-3xl [&::-webkit-scrollbar-thumb]:bg-gray-400'>
				{!isShow ? (
					<>
						<FundingFree checked={selectReward} setSelectReward={setSelectReward} />
						{exam.map((reward) => (
							<FundingReward
								id={reward.id}
								price={reward.price}
								title={reward.title}
								description={reward.description}
								date={reward.date}
								checked={selectReward}
								setSelectReward={setSelectReward}
							/>
						))}
						<button
							className='w-[30%] h-10 border-none bg-purple-500 text-white font-bold text-lg mt-8 cursor-pointer ml-[35%] rounded-xl disabled:opacity-50'
							disabled={selectReward == null}
							onClick={nextClick}>
							다음
						</button>
					</>
				) : (
					<>
						<FundingPay />
						<button className='w-[30%] h-10 border-none bg-purple-500 text-white font-bold text-lg mt-8 cursor-pointer ml-[35%] rounded-xl'>함께하기</button>
					</>
				)}
			</div>
		</div>
	)
}

export default FundingModal

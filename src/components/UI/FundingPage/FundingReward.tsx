import React, { JSX, useEffect, useState } from 'react'
import { OptionRewardData } from './modals/FundingModal'

interface props {
	id: number
	price: number
	title: string
	checked: number | null
	setSelectReward: (type: 'option' | 'free', data: OptionRewardData, rewardNum: number) => void
}

const FundingReward = ({ id, price, title, checked, setSelectReward }: props): JSX.Element => {
	const [check, setCheck] = useState<boolean>(false)

	const onCheck = () => {
		// price에서 'P' 제거하고 숫자로 변환
		const priceNumber = parseInt(price.toString().replace('P', ''))
		setSelectReward('option', { optionId: id, couponId: 0, price: priceNumber }, id)
	}

	useEffect(() => {
		if (checked === id) {
			setCheck(true)
		} else {
			setCheck(false)
		}
	}, [checked, id])

	return (
		<div className={`p-6 rounded-xl border-2 transition-all duration-300 ${check ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
			<div className='flex flex-row gap-3 items-start mb-4'>
				<input
					type='checkbox'
					onChange={onCheck}
					checked={check}
					className={`appearance-none border-2 border-gray-300 rounded-md p-1 w-8 h-8 cursor-pointer transition-all duration-200 mt-1 ${
						check
							? "border-transparent bg-purple-500 bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e\")] bg-full bg-center bg-no-repeat shadow-sm"
							: 'hover:border-gray-400'
					}`}
				/>
				<div className='flex-1'>
					<div className='flex items-center justify-between mb-2'>
						<span className={`font-bold text-xl transition-colors duration-200 ${check ? 'text-purple-600' : 'text-gray-400'}`}>{price.toLocaleString()} P</span>
					</div>
					<p className={`font-normal text-sm mb-2 transition-colors duration-200 ${check ? 'text-gray-600' : 'text-gray-400'}`}>{title}</p>
					<p className={`text-xs flex items-center gap-1 transition-colors duration-200 ${check ? 'text-purple-600' : 'text-gray-400'}`}>
					</p>
				</div>
			</div>
		</div>
	)
}

export default FundingReward

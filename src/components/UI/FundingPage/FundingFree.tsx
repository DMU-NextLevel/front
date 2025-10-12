import { JSX, useEffect, useState } from 'react'
import { FreeRewardData } from './modals/FundingModal'
import { useParams } from 'react-router-dom'

interface props {
	checked: number | null
	setSelectReward: (type: 'free', data: FreeRewardData, rewardNum: number) => void
}

const FundingFree = ({ checked, setSelectReward }: props): JSX.Element => {
	const [check, setCheck] = useState<boolean>(false)
	const [price, setPrice] = useState<number>(0)
	const { no } = useParams<{ no: string }>()

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value)
		setPrice(isNaN(value) ? 0 : value)
	}

	const onCheck = () => {
		if (!check) {
			// 체크할 때는 일단 선택만 하고 price는 나중에 업데이트
			setSelectReward('free', { price: price, projectId: Number(no) }, 0)
		}
	}

	// price가 변경될 때마다 체크되어 있으면 데이터 업데이트
	useEffect(() => {
		if (check) {
			setSelectReward('free', { price: price, projectId: Number(no) }, 0)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [price, check, no])

	useEffect(() => {
		if (checked === 0) {
			setCheck(true)
		} else {
			setCheck(false)
		}
	}, [checked])

	return (
		<div className={`p-6 rounded-xl border-2 transition-all duration-300 ${check ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
			<div className='flex flex-row mb-6 items-center gap-3'>
				<input
					type='checkbox'
					onChange={onCheck}
					checked={check}
					className={`appearance-none border-2 border-gray-300 rounded-md p-1 w-8 h-8 cursor-pointer transition-all duration-200 ${
						check
							? "border-transparent bg-purple-500 bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e\")] bg-full bg-center bg-no-repeat shadow-sm"
							: 'hover:border-gray-400'
					}`}
				/>
				<span className={`text-lg font-bold transition-colors duration-200 ${check ? 'text-purple-600' : 'text-gray-400'}`}>💝 자유로운 후원</span>
			</div>
			<div className='pl-1'>
				<p className={`text-sm mb-3 transition-colors duration-200 ${check ? 'text-gray-700' : 'text-gray-400'}`}>원하시는 금액을 입력해주세요</p>
				<div className='flex items-center gap-2'>
					<input
						type='number'
						className={`flex-1 px-4 py-3 outline-none border-2 rounded-lg text-lg font-bold transition-all duration-200 ${
							check ? 'border-purple-500 bg-white text-purple-600 focus:ring-2 focus:ring-purple-300' : 'border-gray-200 bg-gray-50 text-gray-300'
						}`}
						value={price || ''}
						onChange={handlePriceChange}
						disabled={!check}
						min={0}
						placeholder='0'
					/>
					<span className={`text-xl font-bold transition-colors duration-200 ${check ? 'text-purple-600' : 'text-gray-300'}`}>P</span>
				</div>
			</div>
		</div>
	)
}

export default FundingFree

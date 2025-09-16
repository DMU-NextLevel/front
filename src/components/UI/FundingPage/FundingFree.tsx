import { JSX, useEffect, useRef, useState } from 'react'

interface props {
	checked: Number | null
	setSelectReward: React.Dispatch<React.SetStateAction<Number | null>>
}

const FundingFree = ({ checked, setSelectReward }: props): JSX.Element => {
	const [check, setCheck] = useState<boolean>(false)

	const onCheck = () => {
		if (checked === 0) {
			setSelectReward(null)
		} else {
			setSelectReward(0)
		}
	}

	useEffect(() => {
		if (checked === 0) {
			setCheck(true)
		} else {
			setCheck(false)
		}
	}, [checked])

	return (
		<div className='m-5'>
			<div className='w-4/5 border-b-4 border-gray-100 rounded-3xl mb-5 mx-auto' />
			<div className='flex flex-row mb-4 items-center gap-2.5'>
				<input
					type='checkbox'
					onChange={onCheck}
					checked={check}
					className={`appearance-none border-2 border-gray-300 rounded-md p-1 w-8 h-8 cursor-pointer ${
						check
							? "border-transparent bg-purple-500 bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e\")] bg-full bg-center bg-no-repeat"
							: ''
					}`}
				/>
				<span className={`text-base font-bold ${check ? 'text-purple-500' : 'text-gray-300'}`}>자유로운 후원</span>
			</div>
			<div>
				<input className={`w-2/5 outline-none border-none border-b-2 ${check ? 'border-purple-500' : 'border-gray-300'} pb-1.5 mb-1.5 text-base font-bold`} />
				<span className={`font-bold ${check ? 'text-purple-500' : 'text-gray-300'}`}>P</span>
			</div>
		</div>
	)
}

export default FundingFree

import React, { JSX, useEffect, useState } from 'react'

interface props {
	id: Number
	price: string
	title: string
	description: string
	date: string
	checked: Number | null
	setSelectReward: React.Dispatch<React.SetStateAction<Number | null>>
}

const FundingReward = ({ id, price, title, description, date, checked, setSelectReward }: props): JSX.Element => {
	const [check, setCheck] = useState<boolean>(false)

	const onCheck = () => {
		if (checked === id) {
			setSelectReward(null)
		} else {
			setSelectReward(id)
		}
	}

	useEffect(() => {
		if (checked === id) {
			setCheck(true)
		} else {
			setCheck(false)
		}
	}, [checked, id])

	return (
		<div className='m-5'>
			<div className='w-4/5 border-b-4 border-gray-100 rounded-3xl mb-5 mx-auto' />
			<div className='flex flex-row gap-2.5 items-center'>
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
				<span className={`font-bold text-xl text-purple-500 ${check ? 'opacity-100' : 'opacity-50'}`}>{price}</span>
			</div>
			<p className={`font-bold text-xl text-purple-500 ${check ? 'opacity-100' : 'opacity-50'}`}>{title}</p>
			<p className={`text-gray-500 ${check ? 'opacity-100' : 'opacity-50'}`}>{description}</p>
			<p className={`text-gray-500 ${check ? 'opacity-100' : 'opacity-50'}`}>{date}</p>
		</div>
	)
}

export default FundingReward

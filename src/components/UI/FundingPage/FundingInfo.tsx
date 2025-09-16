import React, { JSX } from 'react'
import ExamImage from '../../../assets/images/nextlevel.png'
import LikeImage from '../../../assets/images/Like.svg'

interface props {
	setPayOpen: React.Dispatch<React.SetStateAction<boolean>>
	title: string
	percent: string
	image: string
	description: string
	amount: number
	peopleNum: number
	likeNum: number
}

const FundingInfo = ({ setPayOpen, title, percent, image, description, amount, peopleNum, likeNum }: props): JSX.Element => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL

	const PayClick = () => {
		setPayOpen(true)
	}

	return (
		<div className='flex flex-col w-[90%] rounded-2xl border-4 border-gray-100 p-[5%]'>
			<img src={`${baseUrl}/img/${image}`} className='w-full h-75' />
			<div className='flex items-center h-12 gap-2.5'>
				<p className='flex min-w-[50px] w-auto h-2.5 p-2.5 m-0 bg-gray-100 items-center justify-center text-xs font-bold rounded-xl'>고양이</p>
				<p className='flex min-w-[50px] w-auto h-2.5 p-2.5 m-0 bg-gray-100 items-center justify-center text-xs font-bold rounded-xl'>장난감</p>
			</div>
			<p className='text-xl font-bold my-1.5'>{title}</p>
			<p className='text-sm my-1.5 text-gray-500'>{description}</p>
			<div className='flex flex-col my-2.5'>
				<p className='my-1.5'>
					<span className='text-purple-500 font-bold text-xl mr-1.5'>{peopleNum}</span>명 참여
				</p>
				<p className='my-1.5'>
					<span className='font-bold text-xl mr-1.5'>{amount}</span>원 달성
				</p>
			</div>
			<div className='flex w-full h-[75px] gap-5'>
				<div className='flex flex-col items-center'>
					<img src={LikeImage} className='w-12 h-12 mb-1.5 hover:cursor-pointer' />
					<p className='flex justify-center text-sm m-0 text-gray-500'>{likeNum}</p>
				</div>
				<button className='bg-purple-500 text-white border-none rounded-xl text-xl font-bold w-full h-12 hover:cursor-pointer' onClick={PayClick}>
					스타터와 함께하기
				</button>
			</div>
		</div>
	)
}

export default FundingInfo

import React, { JSX, useState } from 'react'
import ExamImage from '../../../assets/images/nextlevel.png'
import LikeImage from '../../../assets/images/Like.svg'
import { api } from '../../../AxiosInstance'
import { useParams } from 'react-router-dom'
import { FundingOptionManageModal } from './modals/FundingOptionManageModal'

interface props {
	setPayOpen: React.Dispatch<React.SetStateAction<boolean>>
	title: string
	percent: number
	image: string
	description: string
	amount: number
	peopleNum: number
	likeNum: number
	tag: []
	isAuthor: boolean
}

const FundingInfo = ({ setPayOpen, title, percent, image, description, amount, peopleNum, likeNum, tag, isAuthor }: props): JSX.Element => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const { no } = useParams<{ no: string }>()
	const [isOptionModalOpen, setIsOptionModalOpen] = useState(false)

	const PayClick = () => {
		setPayOpen(true)
	}

	const handleOptionManage = () => {
		setIsOptionModalOpen(true)
	}

	const handleLike = async () => {
		try {
			await api.post('/social/user/like', {
				like: true,
				projectId: no,
			})
		} catch (e) {
			console.log(e)
			alert('좋아요 실패')
		}
	}

	return (
		<div className='flex flex-col w-[90%] rounded-2xl border-4 border-gray-100 p-[5%] shadow-md hover:shadow-xl transition-all duration-300'>
			<img src={`${baseUrl}/img/${image}`} className='w-full h-75 rounded-lg' alt='' />
			<div className='flex items-center h-12 gap-2.5'>
				{tag.map((tag, index) => (
					<p
						key={index}
						className='flex min-w-[50px] w-auto h-2.5 p-2.5 m-0 bg-purple-100 text-purple-700 items-center justify-center text-xs font-bold rounded-xl transition-all duration-200 hover:bg-purple-200'>
						{tag}
					</p>
				))}
			</div>
			<p className='text-xl font-bold my-1.5'>{title}</p>
			<p className='text-sm my-1.5 text-gray-500'>{description}</p>
			<div className='flex flex-col my-2.5'>
				<p className='my-1.5'>
					<span className='text-purple-500 font-bold text-xl mr-1.5'>{peopleNum.toLocaleString()}</span>명 참여
				</p>
				<p className='my-1.5'>
					<span className='font-bold text-xl mr-1.5'>{amount.toLocaleString()}</span>원 달성
				</p>
			</div>
			<div className='flex w-full h-[75px] gap-5'>
				<div className='flex flex-col items-center group'>
					<img src={LikeImage} className='w-12 h-12 mb-1.5 hover:cursor-pointer transition-transform duration-200 group-hover:scale-110' onClick={handleLike} alt='좋아요' />
					<p className='flex justify-center text-sm m-0 text-gray-500'>{likeNum}</p>
				</div>
				<div className='flex gap-2.5 ml-auto w-full'>
					<button
						className='bg-purple-500 hover:bg-purple-600 text-white border-none rounded-xl text-sm font-bold w-full h-12 hover:cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'
						onClick={PayClick}>
						스타터와 함께하기
					</button>
					{isAuthor && (
						<button
							className='border-purple-500 text-purple-500 border-2 rounded-xl text-sm font-bold w-1/3 h-12 hover:cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'
							onClick={handleOptionManage}>
							...
						</button>
					)}
				</div>
			</div>

			{/* 옵션 관리 모달 */}
			<FundingOptionManageModal isOpen={isOptionModalOpen} onClose={() => setIsOptionModalOpen(false)} projectId={no || ''} />
		</div>
	)
}

export default FundingInfo

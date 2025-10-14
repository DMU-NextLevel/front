import React, { JSX, useState } from 'react'
import UserImage from '../../../assets/images/default_profile.png'
import FollowImage from '../../../assets/images/Heart.svg'
import StarterScore from './StarterScore'
import { useNavigate } from 'react-router-dom'
import { useFollow } from '../../../apis/social/useFollow'

const baseUrl = process.env.REACT_APP_API_BASE_URL

interface props {
	starter: {
		id: number
		nickName: string
		img: {
			id: number
			uri: string
		}
		followCount: number
		isFollow: boolean
	} | undefined
}

const StarterInfo = ({ starter }: props): JSX.Element => {
	const [isFollowed, setIsFollowed] = useState<boolean>(starter?.isFollow ?? false)
	const navigate = useNavigate()
	const { follow } = useFollow()

	const handleFllow = async () => {
		follow({ targetId: starter?.id ?? 0, follow: !isFollowed })
		setIsFollowed((prev) => !prev)
	}

	const moveToSocial = () => {
		navigate(`/socialfeed/${starter?.id}`)
	}

	return (
		<div className='flex flex-col justify-center p-[5%] w-[90%] min-h-[120px] border-4 border-gray-100 rounded-2xl gap-8 shadow-md hover:shadow-xl transition-all duration-300 bg-neutral-50'>
			<div className='flex w-full h-[30%] items-center'>
				<div className='flex items-center cursor-pointer' onClick={moveToSocial}>
					<img
						src={
							starter?.img && starter?.img.uri
								? `${baseUrl}/img/${starter.img.uri}`
								: UserImage
						}
						className='w-10 h-10 rounded-full ring-2 ring-purple-200'
						alt='프로필'
					/>
					<div className='ml-2.5'>
						<p className='text-base font-bold m-0'>{starter?.nickName}</p>
						<p className='text-xs m-0 text-purple-500'>{starter?.followCount} 명 팔로우 중</p>
					</div>
				</div>
				<button
					className={`flex flex-row w-24 h-10 border-none rounded-xl items-center justify-center gap-2.5 ml-auto hover:cursor-pointer transition-all duration-200 ${
						isFollowed ? 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30' : 'bg-gray-100 hover:bg-purple-50 hover:text-purple-500'
					}`}
					onClick={handleFllow}>
					<img src={FollowImage} alt='❤️' className={`w-5 transition-transform duration-200 ${isFollowed ? 'scale-110' : ''}`} />
					<p>{isFollowed ? '팔로잉' : '팔로우'}</p>
				</button>
			</div>
			<div className='flex w-full h-[30%] items-center gap-4'>
				<StarterScore title='평판' score={80} />
				<StarterScore title='소통' score={10} />
				<StarterScore title='인기' score={100} />
			</div>
		</div>
	)
}

export default StarterInfo

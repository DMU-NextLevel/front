import React, { JSX, useState } from 'react'
import UserImage from '../../../assets/images/default_profile.png'
import FollowImage from '../../../assets/images/Heart.svg'
import StarterScore from './StarterScore'

interface props {
	starter: string | undefined
}

const StarterInfo = ({ starter }: props): JSX.Element => {
	const [isFollowed, setIsFollowed] = useState<boolean>(false)
	const [follower, setFollower] = useState<number>(0)

	const handleFllow = () => {
		setIsFollowed((prev) => !prev)
	}

	return (
		<div className='flex flex-col justify-center p-[5%] w-[90%] min-h-[120px] border-4 border-gray-100 rounded-2xl gap-8 shadow-md'>
			<div className='flex w-full h-[30%] items-center'>
				<img src={UserImage} className='w-10 h-10 rounded-full' />
				<div className='ml-2.5'>
					<p className='text-base font-bold m-0'>{starter}</p>
					<p className='text-xs m-0 text-purple-500'>{follower} 명 팔로우 중</p>
				</div>
				<button
					className={`flex flex-row w-25 h-10 border-none rounded-xl items-center justify-center gap-2.5 ml-auto hover:cursor-pointer ${
						isFollowed ? 'bg-purple-500' : 'bg-gray-100'
					}`}
					onClick={handleFllow}>
					<img src={FollowImage} alt='❤️' className='w-5' />
					<p>팔로우</p>
				</button>
			</div>
			<div className='flex w-full h-[30%] items-center'>
				<StarterScore title='평판' score={80} />
				<StarterScore title='소통' score={10} />
				<StarterScore title='인기' score={100} />
			</div>
		</div>
	)
}

export default StarterInfo

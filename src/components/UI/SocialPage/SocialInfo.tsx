import { useParams } from 'react-router-dom'
import { useFollow } from '../../../apis/social/useFollow'
import UserImage from '../../../assets/images/default_profile.png'
import { useState } from 'react'

interface SocialInfoProps {
	nickName: string
	followCount: number
	img: string
	isFollow: boolean
}

export const SocialInfo = ({ nickName, followCount, img, isFollow }: SocialInfoProps) => {
	const { id } = useParams()
	const { follow } = useFollow()
    const [isFollowing, setIsFollowing] = useState(isFollow)

	const handleFollow = async () => {
		follow({ targetId: Number(id), follow: !isFollow })
		setIsFollowing(!isFollowing)
	}

	return (
		<div className='px-6 pt-6 pb-4'>
			<div className='flex bg-gradient-to-r from-purple-50 to-blue-50 p-5 items-center gap-6 shadow-lg rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow duration-300'>
				<img className='w-16 h-16 rounded-full border-3 border-white shadow-md hover:scale-110 transition-transform duration-200' src={img ? img : UserImage} alt='프로필 이미지' />
				<div className='flex flex-col gap-1'>
					<p className='font-bold text-xl text-gray-800'>{nickName}</p>
					<div className='flex items-center gap-2'>
						<p className='text-sm text-gray-600 font-medium'>팔로워</p>
						<p className='text-sm font-semibold text-purple-600'>{followCount}명</p>
					</div>
				</div>
				<button
					className={`
							px-7 py-2.5 rounded-full ml-auto font-semibold shadow-md
							hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200
							${
								isFollowing
									? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
									: 'bg-transparent border-2 border-purple-500 text-purple-600 hover:bg-purple-500/50 hover:text-white'
							}
						`}
					onClick={handleFollow}>
					{isFollowing ? '팔로잉' : '팔로우'}
				</button>
			</div>
		</div>
	)
}

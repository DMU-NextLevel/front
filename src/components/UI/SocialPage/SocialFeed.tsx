import UserImage from '../../../assets/images/default_profile.png'
import { SocialLikeButton } from './SocialLikeButton'

interface SocialFeedProps {
    nickName: string
    content: string
    img: string[] | null
    date: string
    like: number
    type: 'image' | 'text'
}

export const SocialFeed = ({ nickName, content, img, date, like, type }: SocialFeedProps) => {
    return (
			<div className='bg-white rounded-2xl p-5 border border-gray-200 mx-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
				<div className='flex items-center gap-4 mb-4'>
					<img src={UserImage} alt='프로필 이미지' className='w-12 h-12 rounded-full border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-200' />
					<div className='flex flex-col justify-center'>
						<p className='font-bold text-gray-800 text-base'>{nickName}</p>
						<p className='text-gray-400 text-sm'>{date}</p>
					</div>
				</div>
				<div className='flex flex-col gap-4'>
					<p className='text-gray-700 text-base leading-relaxed px-1'>{content}</p>
					{type === 'image' && img && img.length > 0 && (
						<div className='overflow-hidden rounded-xl'>
							<img src={img[0]} alt='피드 이미지' className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' />
						</div>
					)}
					<SocialLikeButton like={like} />
				</div>
			</div>
		)
}
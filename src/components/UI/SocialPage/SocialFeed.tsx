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
        <div className='bg-[#fffcf5] rounded-2xl p-4 border-2 border-[#b1e1ff] mx-8'>
            <div className='flex items-center gap-4'>
                <img src={UserImage} alt="프로필 이미지" className='w-10 h-10 rounded-full' />
                <div className='flex flex-col justify-center'>
                    <p className='font-bold'>{nickName}</p>
                    <p className='text-[#929292]'>{date}</p>
                </div>
            </div>
            <div className='flex flex-col gap-4 px-4 my-4'>
                <p className='text-base'>{content}</p>
                {type === 'image' && img && img.length > 0 && (
                    <img src={img[0]} alt="피드 이미지" className='w-full h-full object-cover rounded-2xl' />
                )}
                <SocialLikeButton like={like} />
            </div>
        </div>
    )
}
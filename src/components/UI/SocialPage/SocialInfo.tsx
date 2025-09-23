import UserImage from '../../../assets/images/default_profile.png'

export const SocialInfo = () => {
    return (
        <div className='rounded-2xl px-[36px] pt-[16px]'>
            <div className='flex bg-[#F5F5F5] p-[16px] items-center gap-8 shadow-[0_0_8px_0_rgba(0,0,0,0.1)]'>
                <img className='w-14 h-14 rounded-full ' src={UserImage} alt='프로필 이미지'/>
                <div>
                    <p className='font-bold text-[20px]'>닉네임</p>
                    <div className='flex items-center gap-2'>
                        <p className='text-sm text-gray-500'>팔로워</p>
                        <p className='text-sm text-gray-500'>xxx명</p>
                    </div>
                </div>
                <button className='bg-purple-500 text-white px-6 py-2 rounded-3xl ml-auto hover:cursor-pointer'>팔로우</button>
            </div>
        </div>
    )
}

import UserImage from '../../../assets/images/default_profile.png'

export const SocialInfo = () => {
    return (
			<div className='px-6 pt-6 pb-4'>
				<div className='flex bg-gradient-to-r from-purple-50 to-blue-50 p-5 items-center gap-6 shadow-lg rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow duration-300'>
					<img className='w-16 h-16 rounded-full border-3 border-white shadow-md hover:scale-110 transition-transform duration-200' src={UserImage} alt='프로필 이미지' />
					<div className='flex flex-col gap-1'>
						<p className='font-bold text-xl text-gray-800'>닉네임</p>
						<div className='flex items-center gap-2'>
							<p className='text-sm text-gray-600 font-medium'>팔로워</p>
							<p className='text-sm font-semibold text-purple-600'>xxx명</p>
						</div>
					</div>
					<button className='bg-gradient-to-r from-purple-500 to-purple-600 text-white px-7 py-2.5 rounded-full ml-auto font-semibold shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200'>
						팔로우
					</button>
				</div>
			</div>
		)
}

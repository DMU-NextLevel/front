import { useParams } from 'react-router-dom'
import { SocialFeed } from '../components/UI/SocialPage/SocialFeed'
import { SocialInfo } from '../components/UI/SocialPage/SocialInfo'
import { SocialFeedCreateModal } from '../components/UI/SocialPage/SocialFeedCreateModal'
import { useFeedList } from '../apis/social/useFeedList'
import { useAuth } from '../hooks/AuthContext'
import { useState } from 'react'
import { SocialCreateButton } from '../components/UI/SocialPage/SocialCreateButton'

const SocialPage = () => {
	const { id } = useParams()
	const { feedList, isLoading, error } = useFeedList(Number(id))
	const { user } = useAuth()
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<>
			<div className='w-full min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
				<div className='max-w-[640px] mx-auto min-h-screen bg-white shadow-2xl'>
					<SocialInfo
						nickName={feedList?.user.nickName ?? ''}
						followCount={feedList?.user.followCount ?? 0}
						img={feedList?.user.img.uri ?? ''}
						isFollow={feedList?.user.isFollow ?? false}
					/>

					<div className='flex justify-center items-center my-6 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400 py-4 shadow-lg backdrop-blur-sm'>
						<p className='font-bold text-white text-lg tracking-wide'>피드</p>
					</div>

					{isLoading && (
						<div className='flex justify-center items-center py-12'>
							<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
						</div>
					)}

					{error && <div className='mx-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center'>{error}</div>}

					{!isLoading && !error && feedList && (
						<div className='flex flex-col gap-6 pb-8'>
							{user?.nickName === feedList.user.nickName && (
								<div className='px-6'>
									<SocialCreateButton onClick={() => setIsModalOpen(true)} />
								</div>
							)}
							{feedList.socials && feedList.socials.length > 0 ? (
								feedList.socials.map((social) => (
									<SocialFeed
										key={social.id}
										id={social.id}
										nickName={feedList.user.nickName}
										content={social.text}
										img={social.imgs ? social.imgs.map((img) => img.uri).filter((uri) => uri !== null) : null}
										date={new Date().toISOString().split('T')[0]}
										like={social.socialLikeCount}
										type={social.imgs && social.imgs.length > 0 ? 'image' : 'text'}
										isLiked={social.isLiked}
										isAuthor={user?.nickName === feedList.user.nickName}
									/>
								))
							) : (
								<div className='flex flex-col items-center justify-center py-16 text-gray-400'>
									<p className='text-lg'>아직 작성된 피드가 없습니다.</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* 피드 생성 모달 */}
			<SocialFeedCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	)
}

export default SocialPage

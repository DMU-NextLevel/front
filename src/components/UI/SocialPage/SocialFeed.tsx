import { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useFeedLike } from '../../../apis/social/useFeedLike'
import UserImage from '../../../assets/images/default_profile.png'
import { SocialLikeButton } from './SocialLikeButton'
import { SocialFeedMenu } from './SocialFeedMenu'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SocialFeedProps {
	id: number
	nickName: string
	content: string
	img: string[] | null
	date: string
	like: number
	type: 'image' | 'text'
	isLiked: boolean
	isAuthor?: boolean
	userImg: string
}

const baseUrl = process.env.REACT_APP_API_BASE_URL

export const SocialFeed = ({ id, nickName, content, img, date, like, type, isLiked, isAuthor = false, userImg }: SocialFeedProps) => {
	const { likeFeed } = useFeedLike()
	const [likeCount, setLikeCount] = useState(like)
	const [likeStatus, setLikeStatus] = useState(isLiked)

	const handleLike = () => {
		likeFeed({ socialId: id, like: !likeStatus })
		setLikeCount(likeCount + (likeStatus ? -1 : 1))
		setLikeStatus(!likeStatus)
	}

	// 슬라이더 커스텀 화살표
	const CustomPrevArrow = (props: any) => {
		const { onClick } = props
		return (
			<button
				onClick={onClick}
				className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110'>
				<ChevronLeft className='w-5 h-5 text-gray-800' />
			</button>
		)
	}

	const CustomNextArrow = (props: any) => {
		const { onClick } = props
		return (
			<button
				onClick={onClick}
				className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110'>
				<ChevronRight className='w-5 h-5 text-gray-800' />
			</button>
		)
	}

	// 슬라이더 설정
	const sliderSettings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
		dotsClass: 'slick-dots !bottom-3',
		customPaging: () => <div className='w-2 h-2 bg-white/60 rounded-full hover:bg-white transition-all duration-200'></div>,
	}

	return (
		<div className='bg-white rounded-2xl p-5 border border-gray-200 mx-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
			<div className='flex items-center gap-4 mb-4'>
				<img src={`${baseUrl}/img/${userImg}`} alt='프로필 이미지' className='w-12 h-12 rounded-full border-2 border-purple-200 shadow-sm hover:scale-105 transition-transform duration-200' />
				<div className='flex flex-col justify-center flex-1'>
					<p className='font-bold text-gray-800 text-base'>{nickName}</p>
					<p className='text-gray-400 text-sm'>{date}</p>
				</div>

				{/* 더보기 버튼 (작성자만 표시) */}
				{isAuthor && <SocialFeedMenu feedId={id} content={content || ''} images={img || []} />}
			</div>
			<div className='flex flex-col gap-4'>
				{content && <p className='text-gray-700 text-base leading-relaxed px-1'>{content}</p>}

				{/* 이미지 슬라이더 */}
				{img && img.length > 0 && (
					<div className='relative overflow-hidden rounded-xl bg-gray-100'>
						{img.length === 1 ? (
							// 이미지가 1개일 때
							<div className='relative w-full' style={{ paddingBottom: '75%' }}>
								<img src={img[0]} alt='피드 이미지' className='absolute top-0 left-0 w-full h-full object-cover' />
							</div>
						) : (
							// 이미지가 여러 개일 때 슬라이더
							<Slider {...sliderSettings}>
								{img.map((image, index) => (
									<div key={index}>
										<div className='relative w-full' style={{ paddingBottom: '75%' }}>
											<img src={image} alt={`피드 이미지 ${index + 1}`} className='absolute top-0 left-0 w-full h-full object-cover' />
										</div>
									</div>
								))}
							</Slider>
						)}
					</div>
				)}

				<SocialLikeButton like={likeCount} likeStatus={likeStatus} onClick={handleLike} />
			</div>
		</div>
	)
}

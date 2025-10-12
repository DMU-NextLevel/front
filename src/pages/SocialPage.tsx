import { SocialFeed } from "../components/UI/SocialPage/SocialFeed"
import { SocialInfo } from "../components/UI/SocialPage/SocialInfo"

const dummyFeed = [
  {
    nickName: "테스트",
    content: "피드",
    img: null,
    date: "2025-01-01",
    type: 'image'
  },
  {
    nickName: "테스트",
    content: "피드",
    img: null,
    date: "2025-01-01",
    type: 'text'
  }
]

const SocialPage = () => {
  return (
		<div className='w-full min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50'>
			<div className='max-w-[640px] mx-auto min-h-screen bg-white shadow-2xl'>
				<SocialInfo />

				<div className='flex justify-center items-center my-6 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400 py-4 shadow-lg backdrop-blur-sm'>
					<p className='font-bold text-white text-lg tracking-wide'>피드</p>
				</div>

				<div className='flex flex-col gap-6 pb-8'>
					{dummyFeed.map((feed, idx) => (
						<SocialFeed key={feed.nickName + idx} nickName={feed.nickName} content={feed.content} img={feed.img} date={feed.date} like={0} type={feed.type as 'image' | 'text'} />
					))}
				</div>
			</div>
		</div>
	)
}

export default SocialPage

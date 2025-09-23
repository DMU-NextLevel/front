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
    <div className='w-full min-h-screen bg-subColor3'>
        <div className='max-w-[640px] mx-auto h-screen bg-[#fcfcfc]'>
            <SocialInfo />

            <div className='flex justify-center items-center my-10 bg-[#afb4ff] py-4 shadow-[0_4px_8px_4px_rgba(0,0,0,0.1)]'>
              <p className="font-bold">피드</p>
            </div>

            <div className='flex flex-col gap-8'>
              {dummyFeed.map((feed, idx) => (
                <SocialFeed
                  key={feed.nickName + idx}
                  nickName={feed.nickName}
                  content={feed.content}
                  img={feed.img}
                  date={feed.date}
                  like={0}
                  type={feed.type as "image" | "text"}
                />
              ))}
            </div>

        </div>
    </div>
  )
}

export default SocialPage

import React from 'react'
import noImage from '../../../assets/images/noImage.jpg'

export type Project = {
  id: string
  title: string
  category: string
  thumbnail: string
  author: string
  current: number
  goal: number
  daysLeft: number
  liked?: boolean
}

const mock: Project[] = [
  { id: '1', title: '초소형 휴대용 레이저 프린터', category: '테크/가전', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop', author: '브릭랩', current: 8400000, goal: 5000000, daysLeft: 12 },
  { id: '2', title: '접이식 카본 킥보드', category: '라이프스타일', thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop', author: '라이트무브', current: 22000000, goal: 10000000, daysLeft: 23, liked: true },
  { id: '3', title: 'AI 번역 이어폰', category: '테크/가전', thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4fc34929f04?q=80&w=1600&auto=format&fit=crop', author: '팀말렛', current: 3200000, goal: 8000000, daysLeft: 7 },
  { id: '4', title: '미니 드립커피 머신', category: '푸드/음료', thumbnail: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1600&auto=format&fit=crop', author: '드립잇', current: 5600000, goal: 6000000, daysLeft: 3 },
  { id: '5', title: '방수 러닝 백팩', category: '패션/잡화', thumbnail: 'https://images.unsplash.com/photo-1514477917009-389c76a86b68?q=80&w=1600&auto=format&fit=crop', author: '무브핏', current: 12000000, goal: 6000000, daysLeft: 19 },
  { id: '6', title: '캠핑 모듈 하우스', category: '여행/레저', thumbnail: 'https://images.unsplash.com/photo-1523419409543-8c1e9999178b?q=80&w=1600&auto=format&fit=crop', author: '오버랜드', current: 9800000, goal: 7000000, daysLeft: 28 },
]

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'

const formatWon = (n: number) => n.toLocaleString('ko-KR')

const ProjectGalleryModern: React.FC<{ projects?: Project[] }> = ({ projects = mock }) => {
  return (
    <section className='mt-10' data-aos='fade-up' data-aos-once='true'>
      <div className='flex items-end justify-between mb-4'>
        <h2 className='text-xl md:text-2xl font-bold'>지금 인기 프로젝트</h2>
        <a href='/search?order=RECOMMEND' className='text-sm text-purple-600 hover:underline'>더 보기</a>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {projects.map(p => {
          const rate = Math.min(100, Math.round((p.current / p.goal) * 100))
          return (
            <a key={p.id} href={`/project/${p.id}`} className='group block rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white hover:ring-purple-300 hover:shadow-lg transition'>
              <div className='relative h-48 sm:h-52 md:h-56 overflow-hidden'>
                <img
                  src={p.thumbnail || noImage}
                  alt={p.title}
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = noImage
                  }}
                />
                <button className='absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow'>
                  <i className={`bi ${p.liked ? 'bi-heart-fill text-pink-500' : 'bi-heart'}`} />
                </button>
                <div className='absolute inset-x-0 bottom-0 p-3'>
                  <span className='inline-flex items-center rounded-full text-xs px-2.5 py-1 bg-black/60 text-white backdrop-blur'>
                    {p.category}
                  </span>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='text-base md:text-[1.05rem] font-bold line-clamp-2 min-h-[2.6em]'>{p.title}</h3>
                <div className='mt-1 text-xs text-gray-500'>by {p.author}</div>
                <div className='mt-3'>
                  <div className='flex items-center justify-between text-sm font-semibold'>
                    <span className='text-purple-600'>{rate}%</span>
                    <span className='text-gray-600'>{formatWon(p.current)}원</span>
                  </div>
                  <div className='mt-2 h-2 rounded-full bg-gray-100 overflow-hidden'>
                    <div className={`h-full w-[${rate}%] ${gradients}`} style={{ width: `${rate}%` }} />
                  </div>
                  <div className='mt-2 text-xs text-gray-500'>{p.daysLeft}일 남음 · 목표 {formatWon(p.goal)}원</div>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectGalleryModern

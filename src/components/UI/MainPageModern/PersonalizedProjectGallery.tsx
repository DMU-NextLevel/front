import React, { useEffect, useState } from 'react'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import { useAuth } from '../../../hooks/AuthContext'
import noImage from '../../../assets/images/noImage.jpg'

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
const baseUrl = process.env.REACT_APP_API_BASE_URL

type ProjectItem = {
  id: number
  title: string
  titleImg: string
  completionRate: number
  recommendCount: number
  tags: string[]
  createdAt: string
  expired: string
  isExpired: boolean
  isRecommend: boolean
  // Optional textual fields for temporary intro fallback
  shortDescription?: string
  description?: string
  summary?: string
  intro?: string
}

const formatWon = (n: number) => n.toLocaleString('ko-KR')

const getRemainingText = (expiredDateStr?: string, createdDateStr?: string): string | null => {
  if (!expiredDateStr || !createdDateStr) return null
  const today = new Date()
  const expired = new Date(expiredDateStr)
  const created = new Date(createdDateStr)
  const diffTime = expired.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const createdDiff = today.getTime() - created.getTime()
  const createdHours = Math.floor(createdDiff / (1000 * 60 * 60))
  if (createdHours <= 24) return 'New'
  if (diffDays < 0) return '마감'
  return `${diffDays}일 남음`
}

const PersonalizedProjectGallery: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchProjectsFromServer({ order: 'RECOMMEND', desc: true, pageCount: 6 })
        if (Array.isArray(data)) setProjects((data as any).slice(0, 6))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className='mt-10' data-aos='fade-up'>
      <div className='flex items-end justify-between mb-4'>
        <div>
          <h2 className='text-xl md:text-2xl font-bold'>취향 맞춤 프로젝트</h2>
          <p className='mt-1 text-xs text-gray-500'>{isLoggedIn ? '회원님의 관심사와 유사한 프로젝트를 추천해드려요' : '인기 데이터를 바탕으로 취향과 가까운 프로젝트를 보여드려요'}</p>
        </div>
        <a href='/search?order=RECOMMEND' className='text-sm text-purple-600 hover:underline'>더 보기</a>
      </div>

      {loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='h-64 rounded-2xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
          ))}
        </div>
      )}

      {!loading && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {projects.slice(0, 6).map((p) => {
            const rate = Math.max(0, Math.min(100, Math.round(p.completionRate ?? 0)))
            const remain = getRemainingText(p.expired, p.createdAt)
            const tagText = Array.isArray(p.tags) && p.tags.length > 0 ? p.tags[0] : '추천'
            const imgSrc = p.titleImg ? `${baseUrl}/img/${p.titleImg}` : ''
            const introText = p.shortDescription || p.description || p.summary || p.intro || '간단한 소개가 준비 중이에요. 프로젝트 상세 페이지에서 더 많은 정보를 확인해 보세요.'
            return (
              <a key={p.id} href={`/project/${p.id}`} className='group block rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white hover:ring-purple-300 hover:shadow-lg transition'>
                <div className='relative w-full overflow-hidden' style={{ aspectRatio: '16 / 9' }}>
                  <img
                    src={imgSrc || noImage}
                    alt={p.title}
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = noImage
                    }}
                  />
                  <button className='absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow'>
                    <i className={`bi ${p.isRecommend ? 'bi-heart-fill text-pink-500' : 'bi-heart'}`} />
                  </button>
                  <div className='absolute inset-x-0 bottom-0 p-3 flex items-center gap-2'>
                    <span className='inline-flex items-center rounded-full text-xs px-2.5 py-1 bg-black/60 text-white backdrop-blur'>
                      {tagText}
                    </span>
                    {remain && (
                      <span className='inline-flex items-center rounded-full text-[11px] px-2 py-0.5 bg-white/80 text-gray-700 backdrop-blur'>
                        {remain}
                      </span>
                    )}
                  </div>
                </div>
                <div className='px-4 pt-3 pb-4'>
                  <h3 className='text-base md:text-[1.05rem] font-bold leading-tight line-clamp-2 mb-0'>{p.title}</h3>
                  <p className='mt-2 text-[13px] text-gray-500 leading-tight line-clamp-3'>{introText}</p>
                  <div className='mt-5'>
                    <div className='flex items-center justify-between text-sm font-semibold'>
                      <span className='text-purple-600'>{rate}% 달성</span>
                      <span className='text-gray-600'>추천 {p.recommendCount?.toLocaleString?.('ko-KR') ?? 0}</span>
                    </div>
                    <div className='mt-2 h-2 rounded-full bg-gray-100 overflow-hidden'>
                      <div className={`h-full ${gradients}`} style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default PersonalizedProjectGallery

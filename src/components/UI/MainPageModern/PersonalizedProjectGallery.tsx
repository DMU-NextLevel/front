import React, { useEffect, useState } from 'react'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import { useAuth } from '../../../hooks/AuthContext'
import noImage from '../../../assets/images/noImage.jpg'
import { api } from '../../../AxiosInstance'

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
  isLiked?: boolean // 좋아요 상태 추가
  author?: {
    name: string
    nickName: string
  }
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

  // 좋아요 토글 API 함수 (api 인스턴스, withCredentials만 사용)
  const toggleProjectLike = async (projectId: number, like: boolean) => {
    try {
      const url = `${baseUrl}/social/user/like`;
      const res = await api.post(url, { like, projectId }, { withCredentials: true })
      if (res.data.message === 'success') {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId ? { ...p, isLiked: like } : p
          )
        )
      }
    } catch (err) {
      console.error('좋아요 토글 실패', err)
    }
  }

  // 좋아요 버튼 클릭 핸들러
  const handleLikeToggle = async (projectId: number, current: boolean) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.')
      return
    }
    await toggleProjectLike(projectId, !current)
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await fetchProjectsFromServer({ order: 'RECOMMEND', desc: true, pageCount: 6 })
        if (Array.isArray(data)) {
          const sliced = (data as any).slice(0, 5)
          setProjects(sliced)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className='mt-10 py-5' data-aos='fade-up'>
      <div className='flex items-end justify-between mb-4'>
        <div>
          <h2 className='text-xl md:text-2xl font-bold'>인기 프로젝트</h2>
          <p className='mt-1 text-xs text-gray-500'>지금 가장 인기 있는 프로젝트들을 만나보세요</p>
        </div>
        <a href='/search?order=RECOMMEND' className='text-sm text-purple-600 hover:underline'>더 보기</a>
      </div>

      {loading && (
        <div className='grid grid-cols-1 lg:grid-cols-10 gap-10'>
          <div className='lg:col-span-6 h-96 rounded-2xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
          <div className='lg:col-span-4 space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-24 rounded-xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className='grid grid-cols-1 lg:grid-cols-10 gap-2'>
          {/* 좌측: 첫 번째 아이템 */}
          <div className='lg:col-span-5'>
            {projects.length > 0 && (
              <div className='group cursor-pointer overflow-hidden transition'>
                <div className='relative w-full overflow-hidden rounded-sm' style={{ aspectRatio: '16 / 9' }}>
                  <img
                    src={projects[0].titleImg ? `${baseUrl}/img/${projects[0].titleImg}` : noImage}
                    alt={projects[0].title}
                    className='absolute inset-0 w-full h-full object-cover rounded-sm transition-all duration-500 ease-out group-hover:scale-105'
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = noImage
                    }}
                  />

                  {/* 프로그래스 바 - 이미지 하단 border처럼 */}
                  <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
                    <div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${Math.max(0, Math.min(100, Math.round(projects[0].completionRate ?? 0)))}%` }} />
                  </div>
                </div>

                <div className='px-4 pt-2 pb-4'>
                  <div className='flex items-center justify-between mb-0'>
                    <h4 className='text-lg font-bold line-clamp-2 hover:underline transition-all cursor-pointer' onClick={() => window.location.href = `/project/${projects[0].id}`}>{projects[0].title}</h4>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleLikeToggle(projects[0].id, projects[0].isLiked ?? false)
                      }}
                      className='text-gray-400 hover:text-red-500 p-2 rounded-md'
                    >
                      <svg className={`w-5 h-5 ${projects[0].isLiked ? 'fill-current text-red-500' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                      </svg>
                    </button>
                  </div>

                  {/* 작성자 */}
                  <div className='text-xs text-gray-400 mb-1 font-bold'>
                    by {projects[0].author?.nickName || '익명'}
                  </div>

                  {/* 시작일과 진행률 */}
                  <div className='text-xs text-gray-600 mb-2 font-bold flex items-center gap-2'>
                    {(() => {
                      if (!projects[0].createdAt) return `${Math.round(projects[0].completionRate ?? 0)}% 진행`
                      const today = new Date()
                      const created = new Date(projects[0].createdAt)
                      const diffTime = today.getTime() - created.getTime()
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                      const startText = diffDays === 0 ? '오늘 시작' : `${diffDays}일전 시작`
                      const progressText = `${Math.round(projects[0].completionRate ?? 0)}% 진행`
                      return (
                        <>
                          <span className='flex items-center gap-1'>
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            {startText}
                          </span>
                          {' · '}
                          <span>{progressText}</span>
                        </>
                      )
                    })()}
                  </div>

                  <p className='text-sm text-gray-500 line-clamp-3 mb-2'>
                    {projects[0].shortDescription || projects[0].description || projects[0].summary || projects[0].intro || '프로젝트 소개가 준비 중입니다.'}
                  </p>

                  {/* 태그들 - 정보 아래에 배치 */}
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {Array.isArray(projects[0].tags) && projects[0].tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                      <span
                        key={`left-${tagIndex}`}
                        className='inline-flex items-center rounded-full text-xs px-2.5 py-1 bg-gray-100 text-gray-700'
                      >
                        {tag}
                      </span>
                    ))}
                    {getRemainingText(projects[0].expired, projects[0].createdAt) && (
                      <span className='inline-flex items-center rounded-full text-[11px] px-2 py-0.5 bg-white/80 text-gray-700 backdrop-blur'>
                        {getRemainingText(projects[0].expired, projects[0].createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 우측: 나머지 4개 */}
          <div className='lg:col-span-5 relative' style={{ top: '-16px', left: '16px' }}>
            <div className='grid grid-cols-2 gap-2'>
              {projects.slice(1, 5).map((p) => {
                const rate = Math.max(0, Math.min(100, Math.round(p.completionRate ?? 0)))
                const imgSrc = p.titleImg ? `${baseUrl}/img/${p.titleImg}` : ''
                return (
                  <div
                    key={p.id}
                    className='group bg-transparent rounded-sm overflow-visible relative hover:z-[9999] cursor-pointer'
                    style={{
                      '--expanded-height': '200px',
                      'transitionProperty': 'all',
                      'transitionDuration': '200ms',
                      'zIndex': 'var(--z-index, 0)',
                      '--z-index': '0'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      const element = e.currentTarget as HTMLElement;
                      if (element && element.style) {
                        element.style.setProperty('--z-index', '9999');
                      }
                    }}
                    onMouseLeave={(e) => {
                      const element = e.currentTarget as HTMLElement;
                      if (element && element.style) {
                        element.style.setProperty('--z-index', '0');
                      }
                    }}
                  >
                    {/* 호버 시 전체 확장된 카드의 통합 배경 */}
                    <div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 rounded-sm group-hover:rounded-b-none group-hover:shadow-2xl transition-all duration-300 ease-out z-10'></div>
                    {/* 호버 시 카드 하단 확장 배경 - 위에서 아래로 내려오는 슬라이드 효과 */}
                    <div
                      className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-sm max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-2xl z-10'
                      style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
                    >
                      {/* 실제 표시되는 내용 */}
                      <div className='pb-4 px-4 space-y-2'>
                        <p className='text-sm text-gray-600 leading-relaxed mt-0.5'>
                          {p.shortDescription || p.description || p.summary || p.intro || '프로젝트 소개가 준비 중입니다.'}
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {Array.isArray(p.tags) && p.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <span
                              key={`visible-${tagIndex}`}
                              className='inline-flex items-center text-xs font-medium text-white bg-gray-600 px-2.5 py-1 rounded-full'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className='relative z-10 p-4'>
                      <a href={`/project/${p.id}`} className='block'>
                        {/* 이미지와 프로그래스바 영역 */}
                        <div className='flex mb-4 gap-0 rounded-sm overflow-hidden'>
                          <div className='flex-1 relative overflow-hidden rounded-l-sm'>
                            <img
                              src={imgSrc || noImage}
                              alt={p.title}
                              className='w-full object-cover transition-all duration-500 ease-out group-hover:scale-105'
                              style={{ aspectRatio: '16 / 9' }}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = noImage
                              }}
                            />

                            {/* 프로그래스 바 - 이미지 하단 border처럼 */}
                            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
                              <div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${rate}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center justify-between mb-0'>
                          <h4 className='text-sm font-bold line-clamp-2 hover:underline transition-all cursor-pointer' onClick={() => window.location.href = `/project/${p.id}`}>{p.title}</h4>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleLikeToggle(p.id, p.isLiked ?? false)
                            }}
                            className='text-gray-400 hover:text-red-500 p-1 rounded-md ml-1'
                          >
                            <svg className={`w-4 h-4 ${p.isLiked ? 'fill-current text-red-500' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                            </svg>
                          </button>
                        </div>

                        {/* 작성자 */}
                        <div className='text-xs text-gray-400 mt-1 font-bold'>
                          by {p.author?.nickName || '익명'}
                        </div>

                        {/* 시작일과 진행률 */}
                        <div className='text-xs text-gray-600 mt-1 font-bold flex items-center gap-2'>
                          {(() => {
                            if (!p.createdAt) return `${Math.round(p.completionRate ?? 0)}% 진행`
                            const today = new Date()
                            const created = new Date(p.createdAt)
                            const diffTime = today.getTime() - created.getTime()
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                            const startText = diffDays === 0 ? '오늘 시작' : `${diffDays}일전 시작`
                            const progressText = `${Math.round(p.completionRate ?? 0)}% 진행`
                            return (
                              <>
                                <span className='flex items-center gap-1'>
                                  <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                  </svg>
                                  {startText}
                                </span>
                                {' · '}
                                <span>{progressText}</span>
                              </>
                            )
                          })()}
                        </div>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PersonalizedProjectGallery

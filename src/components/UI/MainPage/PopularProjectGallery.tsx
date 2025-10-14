import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import { useAuth } from '../../../hooks/AuthContext'
import noImage from '../../../assets/images/noImage.jpg'
import { api } from '../../../AxiosInstance'

// 스크롤바 숨김을 위한 스타일
const scrollbarHiddenStyle = {
	scrollbarWidth: 'none' as const, /* Firefox */
	msOverflowStyle: 'none' as const, /* IE and Edge */
} as React.CSSProperties

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'
const baseUrl = process.env.REACT_APP_API_BASE_URL

type ProjectItem = {
  id: number
  title: string
  content?: string // 프로젝트 소개글
  titleImg: {
    id: number
    uri: string
  }
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

const PopularProjectGallery: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(false)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [showMoreButton, setShowMoreButton] = useState(false)

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

  // 스크롤 핸들러
  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 1 // 끝에 도달했을 때
      setShowMoreButton(isNearEnd)
    }
  }

  // 좋아요 버튼 클릭 핸들러
  const handleLikeToggle = async (projectId: number, current: boolean) => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    await toggleProjectLike(projectId, !current)
      if (!current) {
        toast.success('위시리스트에 추가됐어요!', {
          duration: 4000,
          style: {
            animation: 'slideInRightToLeft 0.5s',
          },
        })
      } else {
        toast('위시리스트에서 제외했어요.', {
          duration: 3000,
          style: {
            animation: 'slideInRightToLeft 0.5s',
          },
        })
      }
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

  // 컴포넌트 마운트 시 WebKit 스크롤바 숨김 스타일 추가
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .webkit-scrollbar-hidden::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Update nav button enabled state on scroll/resize
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return

    const update = () => {
      setCanPrev(el.scrollLeft > 0)
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }

    // 초기 상태 업데이트를 위한 타이머
    const timer = setTimeout(update, 100)

    update()
    el.addEventListener('scroll', update, { passive: true })
    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      clearTimeout(timer)
      el.removeEventListener('scroll', update)
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', update)
    }
  }, [projects]) // projects가 로드된 후에 실행되도록 변경

  const getStep = () => {
    const el = sliderRef.current
    if (!el) return 0
    const first = el.querySelector<HTMLElement>(':scope > *')
    const gapPx = 4 // gap-1 ≈ 4px
    const w = first ? first.getBoundingClientRect().width : el.clientWidth * 0.9
    return Math.max(0, Math.round(w + gapPx))
  }

  const goPrev = () => {
    const el = sliderRef.current
    if (!el) return
    el.scrollBy({ left: -getStep(), behavior: 'smooth' })
  }

  const goNext = () => {
    const el = sliderRef.current
    if (!el) return
    el.scrollBy({ left: getStep(), behavior: 'smooth' })
  }

  return (
    <section className='py-4 sm:py-5 px-4 sm:px-6 md:px-8 lg:px-[15%]' data-aos='fade-up' data-aos-once='true'>
      <div className='flex items-end justify-start relative'>
        <div>
          <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-left'>인기 프로젝트</h2>
          <p className='mt-1 text-xs sm:text-sm text-gray-500 text-left'>지금 가장 인기 있는 프로젝트들을 만나보세요</p>
        </div>

        {/* Top-right nav buttons */}
        <div className='absolute top-0 right-0 flex items-center gap-2'>
          <button
            aria-label='Previous'
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 text-gray-700 shadow grid place-items-center hover:bg-white ${!canPrev ? 'opacity-40 cursor-default' : ''}`}
            onClick={goPrev}
            disabled={!canPrev}
          >
            <i className='bi bi-chevron-left' />
          </button>
          <button
            aria-label='Next'
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 text-gray-700 shadow grid place-items-center hover:bg-white ${!canNext ? 'opacity-40 cursor-default' : ''}`}
            onClick={goNext}
            disabled={!canNext}
          >
            <i className='bi bi-chevron-right' />
          </button>
        </div>
      </div>

      {loading && (
        <div className='grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 md:gap-10 mt-6'>
          <div className='lg:col-span-6 h-80 sm:h-96 rounded-2xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
          <div className='lg:col-span-4 space-y-3 sm:space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-20 sm:h-24 rounded-xl ring-1 ring-gray-200 bg-gray-50 animate-pulse' />
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <div className='relative overflow-visible mt-6'>
          <div
            ref={sliderRef}
            className='flex overflow-x-auto snap-x snap-proximity gap-1 pr-16 sm:pr-20 md:pr-24 pb-12 sm:pb-16 md:pb-20 webkit-scrollbar-hidden -ml-4'
            style={{
              ...scrollbarHiddenStyle,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {projects.slice(0, 5).map((p) => {
              const rate = Math.max(0, Math.min(100, Math.round(p.completionRate ?? 0)))
              const imgSrc = p.titleImg ? `${baseUrl}/img/${p.titleImg.uri}` : ''
              return (
                <div
                  key={p.id}
                  className='group bg-transparent rounded-sm overflow-visible relative hover:z-[9999] cursor-pointer snap-center shrink-0 w-full sm:w-1/2 md:w-[27%] lg:w-[27%] xl:w-[27%]'
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
                  <div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 group-hover:rounded-sm group-hover:shadow-lg transition-all duration-300 ease-out z-10'></div>
                  {/* 호버 시 카드 하단 확장 배경 - 위에서 아래로 내려오는 슬라이드 효과 */}
                  <div
                    className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-sm max-h-0 group-hover:max-h-[200px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-lg z-10'
                    style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
                  >
                    {/* 실제 표시되는 내용 */}
                    <div className='pb-4 px-4 space-y-2'>
                      <p className='text-sm text-gray-600 leading-relaxed mt-0.5'>
                        {p.content || p.shortDescription || p.description || p.summary || p.intro || '프로젝트 소개가 준비 중입니다.'}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {Array.isArray(p.tags) && p.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                          <span
                            key={`visible-${tagIndex}`}
                            className='inline-flex items-center text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 px-2.5 py-1 rounded-full transition-colors duration-200 cursor-pointer'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='relative z-10 p-3 sm:p-4'>
                    {/* <a href={`/project/${p.id}`} className='block'> */}
                      {/* 이미지와 프로그래스바 영역 */}
                      <div className='flex mb-3 sm:mb-4 gap-0 rounded-sm overflow-hidden'>
                        <div className='flex-1 relative overflow-hidden rounded-t-lg border border-gray-200'>
                          <img
                            src={imgSrc || noImage}
                            alt={p.title}
                            className='w-full object-cover rounded-t-lg border border-gray-200 transition-all duration-500 ease-out group-hover:scale-105 cursor-pointer'
                            style={{ aspectRatio: '16 / 9' }}
                            onClick={() => window.location.href = `/project/${p.id}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = noImage
                            }}
                          />
                          {/* 호버 시 그라데이션 오버레이 */}
                                                    {/* 그라데이션 오버레이 */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg'></div>

                          {/* 프로그래스 바 - 이미지 하단 border처럼 */}
                          <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden'>
                            <div className={`h-full ${gradients} transition-all duration-300`} style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between mb-0'>
                        <h4 className='text-xs sm:text-sm font-bold line-clamp-2 hover:underline transition-all'>
													<span className='cursor-pointer' onClick={() => window.location.href = `/project/${p.id}`}>{p.title}</span>
												</h4>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleLikeToggle(p.id, p.isLiked ?? false)
                          }}
                          className='text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md ml-1 transition-all duration-200'
                        >
                          <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${p.isLiked ? 'fill-current text-red-500' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
                              <span className='text-blue-600 font-semibold'>{progressText}</span>
                            </>
                          )
                        })()}
                      </div>
                    {/* </a> */}
                  </div>
                </div>
              )
            })}
            <div className='shrink-0 w-full sm:w-1/2 md:w-[27%] lg:w-[27%] xl:w-[27%] flex items-center justify-center'>
              <button
                className={`bg-white rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center text-gray-600 text-xl sm:text-2xl font-bold hover:bg-gray-50 shadow transition-opacity duration-300 ${showMoreButton ? 'opacity-100' : 'opacity-0'}`}
              >
                <i className='bi bi-chevron-right' />
                <span className='text-xs mt-1'>더보기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default React.memo(PopularProjectGallery)

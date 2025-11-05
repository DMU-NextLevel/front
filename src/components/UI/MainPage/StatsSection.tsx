import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../../AxiosInstance'

interface StatsData {
  totalFundingPrice: number
  totalSuccessProjectCount: number
  totalSupporterCount: number
  totalCreatorCount: number
}

const Stat: React.FC<{ label: string; value: number; suffix?: string; delay?: number }> = ({ label, value, suffix = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const duration = 1200
    const start = performance.now() + (delay || 0)
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [visible, value, delay])

  return (
    <div ref={ref} className='text-center'>
      <div className='text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#212529]'>
        {count.toLocaleString()}<span className='text-purple-600'>{suffix}</span>
      </div>
      <div className='mt-1 text-xs sm:text-sm text-gray-500'>{label}</div>
    </div>
  )
}

const StatsSection: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData>({
    totalFundingPrice: 0,
    totalSuccessProjectCount: 0,
    totalSupporterCount: 0,
    totalCreatorCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/summery/mainpage')
        if (response.data?.data) {
          setStatsData(response.data.data)
        }
      } catch (error) {
        console.error('통계 데이터 로딩 실패:', error)
        // 에러 시 기본값 유지
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className='px-4 sm:px-6 md:px-8 lg:px-[15%] bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300 py-8 sm:py-10 md:py-12' data-aos='fade-up' data-aos-once='true'>
        <header className='mb-4 md:mb-6 text-center'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#212529]'>
            함께 만든 성장의 숫자
          </h2>
          <p className='mt-1 text-xs sm:text-sm text-gray-500'>
            위더와 크리에이터, 그리고 서포터가 함께 이룬 성과입니다.
          </p>
        </header>
        <div className='rounded-2xl ring-1 ring-gray-200 bg-white p-4 sm:p-6 md:p-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='text-center animate-pulse'>
                <div className='h-8 bg-gray-200 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='px-4 sm:px-6 md:px-8 lg:px-[15%] bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-300 py-8 sm:py-10 md:py-12'  data-aos='fade-up' data-aos-once='true'>
      {/* Top copy */}
      <header className='mb-4 md:mb-6 text-center'>
        <h2 className='text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-[#212529]'>
          함께 만든 성장의 숫자
        </h2>
        <p className='mt-1 text-xs sm:text-sm text-gray-500'>
          위더와 크리에이터, 그리고 서포터가 함께 이룬 성과입니다.
        </p>
      </header>

      {/* Stats card */}
      <div className='rounded-2xl ring-1 ring-gray-200 bg-white p-4 sm:p-6 md:p-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
          <Stat label='누적 펀딩 금액' value={statsData.totalFundingPrice} suffix='원' />
          <Stat label='성공 프로젝트' value={statsData.totalSuccessProjectCount} />
          <Stat label='응원한 서포터' value={statsData.totalSupporterCount} />
          <Stat label='등록된 크리에이터' value={statsData.totalCreatorCount} />
        </div>

        {/* Bottom helper content */}
        <div className='mt-4 sm:mt-5 md:mt-6 flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs md:text-sm'>
          <div className='inline-flex items-center gap-1.5 text-gray-600'>
            <i className='bi bi-lightning-charge text-purple-600'></i>
            매일 새로운 프로젝트가 업데이트됩니다.
          </div>
          <span className='hidden md:inline text-gray-300'>|</span>
          <div className='inline-flex items-center gap-1.5 text-gray-600'>
            <i className='bi bi-shield-check text-purple-600'></i>
            신뢰할 수 있는 검수와 안전한 결제를 제공해요.
          </div>
          <span className='hidden md:inline text-gray-300'>|</span>
          <div className='inline-flex items-center gap-2'>
            <a href='/search?order=RECOMMEND' className='text-purple-600 hover:text-purple-700 font-semibold'>인기 프로젝트 보기</a>
            <span className='text-gray-300'>·</span>
            <a href='/creater' className='text-gray-700 hover:text-[#212529]'>크리에이터 시작하기</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection

import React, { useState, useRef, useEffect } from 'react'

export interface CategoryItem {
  label: string
  icon: string
  tag: string
  image: string
}

interface CategorySliderProps {
  categories: CategoryItem[]
  value: string
  onChange: (tag: string) => void
  className?: string
}

// 스크롤바 숨김을 위한 스타일
const scrollbarHiddenStyle = {
	scrollbarWidth: 'none' as const, /* Firefox */
	msOverflowStyle: 'none' as const, /* IE and Edge */
} as React.CSSProperties

// Apple-style product card slider for MainPage
const CategorySlider: React.FC<CategorySliderProps> = ({ categories, value, onChange, className = '' }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  // 컴포넌트 마운트 시ㄴ WebKit 스크롤바 숨김 스타일 추가
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
    window.addEventListener('resize', update)

    return () => {
      clearTimeout(timer)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [categories])

  const getStep = () => {
    const el = sliderRef.current
    if (!el) return 0
    const first = el.querySelector<HTMLElement>(':scope > *')
    const gapPx = 20 // gap-5 ≈ 20px
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
    <div className={`w-full ${className}`}>
      {/* Category Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">카테고리</h2>

        {/* Navigation Arrows - Top Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canPrev}
          >
            <i className="bi bi-chevron-left text-gray-700"></i>
          </button>
          <button
            onClick={goNext}
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canNext}
          >
            <i className="bi bi-chevron-right text-gray-700"></i>
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-visible">
        <div
          ref={sliderRef}
          className='flex overflow-x-auto snap-x snap-proximity gap-5 pt-1 pr-20 md:pr-24 pb-16 md:pb-20 webkit-scrollbar-hidden'
          style={{
            ...scrollbarHiddenStyle,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.tag}
              className='group block cursor-pointer rounded-2xl overflow-hidden bg-white hover:shadow-lg transition snap-center shrink-0 first:ml-px w-[70%] sm:w-[50%] md:w-[35%] lg:w-[25%] xl:w-[20%]'
              onClick={() => onChange(cat.tag)}
            >
              {/* Product Card - Apple Style */}
              <div className="bg-gradient-to-br from-white/95 to-indigo-50/90 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Product Image with Overlay */}
                <div className="relative h-64 bg-gradient-to-br from-indigo-100/80 to-purple-100/80 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300" />

                  {/* Text Overlay - Always visible */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-white">
                    <h3 className="text-xl font-bold text-center px-4 drop-shadow-lg">
                      {cat.label}
                    </h3>
                  </div>

                  {/* Icon Overlay - Show on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 shadow-lg">
                      <i className={`${cat.icon} text-2xl text-white`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategorySlider
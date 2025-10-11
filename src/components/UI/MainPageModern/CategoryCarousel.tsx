import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import {
  Cpu,
  Home,
  ShoppingBag,
  HeartPulse,
  Paintbrush,
  Gamepad2,
  BookOpen,
  PawPrint,
  Plane,
  CupSoda,
} from 'lucide-react'

const data: { label: string; tag: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { label: '테크/가전', tag: '1', Icon: Cpu },
  { label: '라이프스타일', tag: '2', Icon: Home },
  { label: '패션/잡화', tag: '3', Icon: ShoppingBag },
  { label: '뷰티/헬스', tag: '4', Icon: HeartPulse },
  { label: '취미/DIY', tag: '5', Icon: Paintbrush },
  { label: '게임', tag: '6', Icon: Gamepad2 },
  { label: '교육/키즈', tag: '7', Icon: BookOpen },
  { label: '반려동물', tag: '8', Icon: PawPrint },
  { label: '여행/레저', tag: '9', Icon: Plane },
  { label: '푸드/음료', tag: '10', Icon: CupSoda },
]

const CategoryCarousel: React.FC = () => {
  return (
    <section className='mt-8' data-aos='fade-up' data-aos-once='true'>
      <div className='flex items-end justify-between mb-3'>
        <h2 className='text-xl md:text-2xl font-semibold tracking-tight'>카테고리 탐색</h2>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation
        breakpoints={{
          320: { slidesPerView: 2.6, spaceBetween: 10 },
          640: { slidesPerView: 3.8, spaceBetween: 12 },
          768: { slidesPerView: 5, spaceBetween: 14 },
          1024:{ slidesPerView: 7, spaceBetween: 16 },
          1280:{ slidesPerView: 8, spaceBetween: 18 },
        }}
      >
        {data.map(({ label, tag, Icon }) => (
          <SwiperSlide key={tag}>
            <a
              href={`/search?tag=${tag}`}
              aria-label={`${label} 카테고리 보기`}
              className='group inline-flex items-center justify-center gap-2 w-full rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 transition'
            >
              <Icon className='h-4 w-4 text-neutral-700 group-hover:text-neutral-900' />
              <span className='font-medium'>{label}</span>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default CategoryCarousel

import React from 'react'

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'

const HeroSection: React.FC = () => {
  return (
    <section className={`relative overflow-hidden w-full ${gradients} text-white`} data-aos='fade-up'>
      {/* Animated blob background */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob' />
        <div className='absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000' />
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000' />
      </div>

      <div className='relative py-14 md:py-20 lg:py-24 px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]'>
        <div className='max-w-3xl'>
          <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-lg'>
            새로운 아이디어가 현실이 되는 곳
          </h1>
          <p className='mt-4 md:mt-5 text-base md:text-lg text-white/90'>
            위더에서 혁신적인 프로젝트를 발견하고 응원하세요. 테크, 라이프스타일, 디자인 등 다양한 분야의 크리에이터들이 기다리고 있어요.
          </p>
          <div className='mt-6 flex flex-col sm:flex-row gap-3'>
            <a href='/search?order=RECOMMEND' className='inline-flex items-center justify-center h-11 px-5 rounded-full bg-white text-gray-900 font-semibold shadow/50 hover:shadow transition-transform hover:-translate-y-0.5'>
              인기 프로젝트 보기
            </a>
            <a href='/creater' className='inline-flex items-center justify-center h-11 px-5 rounded-full bg-white/15 text-white font-semibold ring-1 ring-white/30 hover:bg-white/25 transition'>
              프로젝트 시작하기
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

import React from 'react'

const gradients = 'bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500'

const HeroSection: React.FC = () => {
  return (
    <section className={`relative overflow-hidden w-full ${gradients} text-white`} data-aos='fade-up'>
      <div className='absolute inset-0 opacity-30' style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.4), transparent 45%)' }} />
      <div className='relative py-14 md:py-20 lg:py-24 px-4 sm:px-6 md:px-[8%] lg:px-[10%] xl:px-[12%] 2xl:px-[15%]'>
        <div className='max-w-3xl'>
          <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight leading-tight'>
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
      <div className='absolute -right-24 -bottom-24 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-white/10 blur-3xl' />
    </section>
  )
}

export default HeroSection

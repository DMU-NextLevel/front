import React from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Plus, Target, Users } from 'lucide-react'
import CreaterVideo from '../assets/images/CreaterVideo.mp4'
import FundingHero from '../components/UI/CreaterPage/FundingHero'
import PricingPage from '../components/UI/CreaterPage/PricingPage'

const scrollToSection = (sectionId: string) => {
	const element = document.getElementById(sectionId)
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' })
	}
}

const Index: React.FC = () => {
	const handleScroll = (sectionId: string) => {
		scrollToSection(sectionId)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			<section className='-mt-10 py-20 px-4 text-center h-[520px] relative flex flex-col justify-between items-center'>
				<video src={CreaterVideo} autoPlay muted playsInline loop className='w-full h-full object-cover pointer-events-none absolute top-0 left-0 z-0' />
				<div>
					<h2 className='text-7xl font-bold text-white mb-0 z-10 relative'>당신의 꿈을 현실로</h2>
					<p className='relative text-xl text-white z-10 mb-6'>혁신적인 아이디어를 가지고 계신가요? 우리 플랫폼에서 후원자들과 함께 프로젝트를 성공시켜보세요.</p>
				</div>
				<div style={{ flex: 1 }}></div>
				<div className='flex gap-4 relative'>
					<a href='/project/create' className='no-underline'>
						<button className='bg-purple-500 text-white text-base py-3 px-6 border-none rounded-md flex items-center gap-2 font-medium cursor-pointer transition-all duration-300 ease hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-lg'>
							<Rocket />
							프로젝트 시작하기
						</button>
					</a>
				</div>
			</section>

			<nav className='py-4 px-[15%] flex bg-gray-100 items-center gap-4'>
				<a onClick={() => handleScroll('section-title')}>
					<nav className='py-4 px-8 bg-gray-200 rounded-xl cursor-pointer transition-all duration-300 ease hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-500'>
						{' '}
						위드유 소개
					</nav>
				</a>
				<a onClick={() => handleScroll('funding-hero')}>
					<nav className='py-4 px-8 bg-gray-200 rounded-xl cursor-pointer transition-all duration-300 ease hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-500'>
						자격 요건
					</nav>
				</a>
				<a onClick={() => handleScroll('pricing')}>
					<nav className='py-4 px-8 bg-gray-200 rounded-xl cursor-pointer transition-all duration-300 ease hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-500'>가격</nav>
				</a>
			</nav>
			<section id='section-title' className='py-16 px-[15%] bg-white xl:px-[10%] lg:px-[5%]'>
				<h3 className='text-3xl font-bold text-gray-800 text-center mb-12'>왜 위드유 플랫폼을 선택해야 할까요?</h3>
				<div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8'>
					<div className='bg-white border border-gray-200 rounded-lg py-8 px-6 text-center'>
						<div className='mb-4'>
							<Target color='#2563eb' className='w-12 h-12' />
						</div>
						<h4 className='text-xl font-bold mb-4'>명확한 목표 설정</h4>
						<p className='text-gray-500 text-sm'>체계적인 단계별 가이드로 프로젝트 목표를 명확히 설정하고 성공 확률을 높여보세요.</p>
					</div>

					<div className='bg-white border border-gray-200 rounded-lg py-8 px-6 text-center'>
						<div className='mb-4'>
							<Users color='#16a34a' className='w-12 h-12' />
						</div>
						<h4 className='text-xl font-bold mb-4'>활발한 커뮤니티</h4>
						<p className='text-gray-500 text-sm'>다양한 분야의 창작자들과 후원자들이 모인 활발한 커뮤니티에서 네트워킹하세요.</p>
					</div>

					<div className='bg-white border border-gray-200 rounded-lg py-8 px-6 text-center'>
						<div className='mb-4'>
							<Rocket color='#7c3aed' className='w-12 h-12' />
						</div>
						<h4 className='text-xl font-bold mb-4'>전문적인 지원</h4>
						<p className='text-gray-500 text-sm'>프로젝트 기획부터 마케팅까지, 전 과정에 걸쳐 전문적인 지원을 받을 수 있습니다.</p>
					</div>
				</div>
			</section>
			<main>
				<section id='funding-hero'>
					<FundingHero />
				</section>
				<section id='pricing'>
					<PricingPage />
				</section>
			</main>
		</div>
	)
}

export default Index

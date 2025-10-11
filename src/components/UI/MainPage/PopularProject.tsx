import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import noImage from '../../../assets/images/noImage.jpg'
const PopularProject = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL

	const ArrowRightCircleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = 'currentColor' }) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size}
			height={size}
			fill='currentColor'
			style={{ verticalAlign: 'middle' }}
			className='bi bi-arrow-right-circle'
			viewBox='0 0 16 16'>
			<path
				fill-rule='evenodd'
				d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z'
			/>
		</svg>
	)

	const navigate = useNavigate()
	const [projects, setProjects] = useState<any[]>([])
	useEffect(() => {
		const loadProjects = async () => {
			const data = await fetchProjectsFromServer({ order: 'RECOMMEND', desc: true, pageCount: 6 })
			console.log('📦 서버에서 받아온 프로젝트:', data)
			if (Array.isArray(data)) {
				setProjects(data)
			}
		}
		loadProjects()
	}, [])

	return (
		<div className='w-full lg:w-[70%] max-w-6xl py-6 md:py-8 lg:py-10 mx-auto'>
			<h2 className='text-xl md:text-2xl mb-3 md:mb-5 m-0 font-bold text-left'>인기 프로젝트</h2>
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 md:mb-5'>
				<p className='text-gray-600 text-sm md:text-base m-0 text-left'>당신을 위한 추천 프로젝트</p>
				<div>
					<a href='/search?order=RECOMMEND' className='text-gray-700 no-underline text-sm flex items-center gap-1 hover:text-purple-500'>
						추천 프로젝트 보러가기 <ArrowRightCircleIcon size={15} color='#' />
					</a>
				</div>
			</div>
			<div className='flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-5 pb-2 md:pb-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
				{projects.map((project) => (
					console.log(project.titleImg),
					<div key={project.id} className='group bg-transparent rounded-sm overflow-visible relative hover:z-[9999] cursor-pointer shrink-0 min-w-[240px] max-w-[240px] sm:min-w-0 sm:max-w-none snap-start'
						style={{
							transitionProperty: 'all',
							transitionDuration: '200ms',
							zIndex: 'var(--z-index, 0)',
							'--z-index': '0'
						} as React.CSSProperties}
						onMouseEnter={(e) => {
							const element = e.currentTarget as HTMLElement
							element.style.setProperty('--z-index', '9999')
						}}
						onMouseLeave={(e) => {
							const element = e.currentTarget as HTMLElement
							element.style.setProperty('--z-index', '0')
						}}
					>
						{/* 호버 시 전체 확장된 카드의 통합 배경 */}
						<div className='absolute inset-0 bg-white border border-transparent group-hover:border-gray-200 group-hover:rounded-sm group-hover:shadow-lg transition-all duration-300 ease-out z-10'></div>
						{/* 호버 시 카드 하단 확장 배경 */}
						<div
							className='absolute left-0 right-0 bg-white border-l border-r border-b border-gray-200 rounded-b-sm max-h-0 group-hover:max-h-[120px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shadow-lg z-10'
							style={{ top: '100%', marginTop: '-1px', overflow: 'hidden' }}
						>
							{/* 실제 표시되는 내용 */}
							<div className='pb-3 px-4 space-y-2'>
								<p className='text-sm text-gray-600 leading-relaxed mt-0.5'>
									{project.shortDescription || project.description || project.summary || project.intro || '프로젝트 소개가 준비 중입니다.'}
								</p>
							</div>
						</div>

						<div className='relative z-10 p-4'>
							<div className='w-full relative pb-[56.25%] overflow-hidden rounded-t-lg mb-3'>
								{project.titleImg.uri ? (
									<img
										src={project.titleImg.uri ? `${baseUrl}/img/${project.titleImg.uri}` : noImage}
										alt={project.title}
										onError={(e) => {
											e.currentTarget.onerror = null
											e.currentTarget.src = noImage
										}}
										className='absolute inset-0 w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105'
									/>
								) : (
									<div className='absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 rounded-t-lg'>이미지 없음</div>
								)}
							</div>
							<div>
								<p className='text-purple-600 text-xs sm:text-sm font-semibold mb-1'>{project.completionRate}% 달성</p>
								<h3 className='text-gray-800 text-sm md:text-base font-semibold m-0 line-clamp-2'>{project.title}</h3>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default PopularProject

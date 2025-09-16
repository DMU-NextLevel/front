import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import noImage from '../../../assets/images/noImage.jpg'
const RecommendedProject = () => {
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
		<div className='w-[70%] max-w-6xl py-10 mx-auto'>
			<h2 className='text-2xl mb-5 m-0 font-bold'>취향 맞춤 프로젝트</h2>
			<div className='flex justify-between items-center mb-5'>
				<p className='text-gray-600 text-base m-0'>당신을 위한 추천 프로젝트</p>
				<div>
					<a href='/search?order=RECOMMEND' className='text-gray-700 no-underline text-sm flex items-center gap-1 hover:text-purple-500'>
						추천 프로젝트 보러가기 <ArrowRightCircleIcon size={15} color='#' />
					</a>
				</div>
			</div>
			<div className='grid grid-cols-3 gap-5'>
				{projects.map((project) => (
					<div key={project.id} onClick={() => navigate(`/project/${project.id}`)} className='cursor-pointer'>
						<div className='w-full h-[200px] overflow-hidden rounded-lg mb-3'>
							{project.titleImg ? (
								<img
									src={project.titleImg ? `${baseUrl}/img/${project.titleImg}` : noImage}
									alt={project.title}
									onError={(e) => {
										e.currentTarget.onerror = null
										e.currentTarget.src = noImage
									}}
									className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
								/>
							) : (
								<div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-500'>이미지 없음</div>
							)}
						</div>
						<div>
							<p className='text-purple-600 text-sm font-semibold mb-1'>{project.completionRate}% 달성</p>
							<h3 className='text-gray-800 text-base font-semibold m-0'>{project.title}</h3>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default RecommendedProject





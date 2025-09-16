import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import noImage from '../../../assets/images/noImage.jpg'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'

const NewProject: React.FC = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const navigate = useNavigate()
	const [projects, setProjects] = useState<any[]>([])
	useEffect(() => {
		const loadProjects = async () => {
			const data = await fetchProjectsFromServer({ order: 'CREATED', desc: true, pageCount: 4 })
			console.log('📦 서버에서 받아온 프로젝트:', data)
			if (Array.isArray(data)) {
				setProjects(data)
			}
		}
		loadProjects()
	}, [])

	return (
		<div className='my-10'>
			<h2 className='text-2xl m-0 font-bold'>신규 프로젝트</h2>
			<div className='flex justify-between items-center mb-2.5'>
				<p className='text-sm text-gray-500 m-0 py-0'>신규 프로젝트를 만나보세요!</p>
				<a href='/search?order=USER' className='text-gray-700 no-underline text-sm hover:text-purple-500'>
					신규 프로젝트 더보기<i className='bi bi-arrow-right-circle ml-1'></i>
				</a>
			</div>
			{projects.length == 0 && <p>프로젝트가 없습니다.</p>}
			<div className='grid grid-cols-4 gap-5 mt-5'>
				{projects.map((item, index) => {
					const isLast = index === projects.length - 1
					return (
						<div key={item.id} className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100'>
							<a href={`/project/${item.id}`}>
								<div className='w-full h-[180px] overflow-hidden'>
									<img
										src={item.titleImg ? `${baseUrl}/img/${item.titleImg}` : noImage}
										alt={item.title}
										onError={(e) => {
											e.currentTarget.onerror = null
											e.currentTarget.src = noImage
										}}
										className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
									/>
								</div>
							</a>
							<div className='p-4'>
								<p className='text-purple-600 text-sm font-semibold mb-1'>{item.completionRate}% 달성</p>
								<a href={`/project/${item.id}`} className='no-underline'>
									<h3 className='text-gray-800 text-base font-medium mb-2 leading-tight'>{item.title}</h3>
								</a>
								<p className='text-gray-500 text-sm mb-3'>회사이름</p>
								<div className='flex gap-2'>
									{item.tags[0] && <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded'>{item.tags[0]}</span>}
									{item.tags[1] && <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded'>{item.tags[1]}</span>}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default NewProject

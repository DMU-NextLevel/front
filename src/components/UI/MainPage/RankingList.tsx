import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import noImage from '../../../assets/images/noImage.jpg'

const RankingList: React.FC = () => {
	const baseUrl = process.env.REACT_APP_API_BASE_URL
	const navigate = useNavigate()
	const [projects, setProjects] = useState<any[]>([])
	useEffect(() => {
		const loadProjects = async () => {
			const data = await fetchProjectsFromServer({ order: 'RECOMMEND', pageCount: 6 })
			console.log('📦 서버에서 받아온 프로젝트:', data)
			if (Array.isArray(data)) {
				setProjects(data)
			}
		}
		loadProjects()
	}, [])

	return (
		<div className='w-[30%] bg-white py-10 pr-0 pl-10 border-l border-gray-100 ml-10'>
			<h2 className='text-2xl font-bold mb-5 text-gray-800'>실시간 랭킹</h2>

			<div>
				{projects.map((item, index) => (
					<div onClick={() => navigate(`/project/${item.id}`)} key={item.id} className='flex items-start mb-3 justify-between cursor-pointer'>
						<div className='w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0'>{index + 1}</div>
						<div className='flex-1 mr-3'>
							<h3 className='text-gray-800 text-sm font-medium mb-1 leading-tight'>{item.title}</h3>
							<p className='text-purple-600 text-xs font-semibold'>{item.completionRate}% 달성</p>
						</div>
						<div className='w-12 h-12 flex-shrink-0'>
							{item.titleImg ? (
								<img
									src={item.titleImg ? `${baseUrl}/img/${item.titleImg}` : noImage}
									alt={item.title}
									onError={(e) => {
										e.currentTarget.onerror = null
										e.currentTarget.src = noImage
									}}
									className='w-full h-full object-cover rounded'
								/>
							) : (
								<div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded'>이미지 없음</div>
							)}
						</div>
					</div>
				))}
			</div>
			<div className='text-right mb-2.5 m-0'></div>
		</div>
	)
}

export default RankingList;

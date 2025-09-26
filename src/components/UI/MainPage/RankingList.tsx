import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { fetchProjectsFromServer } from '../../../hooks/fetchProjectsFromServer'
import noImage from '../../../assets/images/noImage.jpg'

type RankingListProps = {
	/**
	 * sidebar: 사용할 때 부모 레이아웃이 컬럼 폭을 관리 (7:3 등)
	 * standalone: 기존 메인 하단 섹션에서 단독 배치 (기본값)
	 */
	variant?: 'sidebar' | 'standalone'
}

const RankingList: React.FC<RankingListProps> = ({ variant = 'standalone' }) => {
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
		<div
			data-aos='fade-up'
			data-aos-duration='600'
			data-aos-easing='ease-out-cubic'
			data-aos-once='true'
			className={
				variant === 'sidebar'
					? 'w-full bg-transparent py-6 md:py-8 lg:py-10 pl-0 mt-6 lg:mt-0 h-full flex flex-col transform-gpu'
					: 'w-full lg:w-[30%] bg-transparent py-6 md:py-8 lg:py-10 mt-6 lg:mt-0 h-full flex flex-col transform-gpu'
			}
			style={{ willChange: 'transform' }}
		>
			<h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-3'>실시간 랭킹</h2>
			<ul className='space-y-2.5 flex-1'>
				{projects.map((item, index) => (
					<li key={item.id}>
						<button
							onClick={() => navigate(`/project/${item.id}`)}
							className='w-full flex items-start gap-2.5 px-1 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors'>
							<span className='inline-flex items-center justify-center w-7 h-7 text-purple-600 text-base font-bold'>
								{index + 1}
							</span>
							<div className='min-w-0 flex-1'>
								<p className='text-base md:text-[1.05rem] text-gray-800 font-medium leading-tight line-clamp-2'>
									{item.title}
								</p>
								<p className='mt-0.5 text-sm text-purple-600 font-semibold'>{item.completionRate}% 달성</p>
								{/* TODO: API 구현 후 item.description(또는 shortDescription/summary/intro)로 대체 */}
								{(() => {
									const desc =
										(item && (item.shortDescription || item.description || item.summary || item.intro)) ||
										'크리에이터의 스토리와 목표를 간단히 소개하는 영역입니다. 더보기에서 상세 내용을 확인해 보세요.'
									return (
										<p className='mt-0.5 text-[11px] md:text-xs text-gray-500 leading-snug line-clamp-2'>{desc}</p>
									)
								})()}
							</div>
							<div className='flex-shrink-0 w-24 sm:w-28 rounded-lg overflow-hidden bg-gray-50 ring-1 ring-gray-200 relative'>
								<div className='w-full' style={{ aspectRatio: '16 / 9' }}>
									{item.titleImg ? (
										<img
											src={item.titleImg ? `${baseUrl}/img/${item.titleImg}` : noImage}
											alt={item.title}
											onError={(e) => {
												e.currentTarget.onerror = null
												e.currentTarget.src = noImage
											}}
											className='absolute inset-0 w-full h-full object-cover'
										/>
									) : (
										<div className='absolute inset-0 flex items-center justify-center text-gray-400 text-[11px]'>이미지 없음</div>
									)}
								</div>
							</div>
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default RankingList;

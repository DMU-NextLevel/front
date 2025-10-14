import React, { JSX, useEffect, useRef, useState } from 'react'
import { FundingCommu, FundingNews, FundingStory } from './FundingStory'
import { ProjectCommunityData, ProjectNoticeData, ProjectStoryData } from '../../../types/project'

interface props {
	projectData: {
		story: ProjectStoryData | null
		notice: ProjectNoticeData | null
		community: ProjectCommunityData | null
	}
}

const FundingContent = ({ projectData }: props): JSX.Element => {
	const [activeSection, setActiveSection] = useState<'story' | 'news' | 'commu'>('story')

	const storyRef = useRef<HTMLDivElement>(null)
	const newsRef = useRef<HTMLDivElement>(null)
	const commuRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const getSectionPositions = () => {
		return {
			storyTop: storyRef.current?.offsetTop ?? 0,
			newsTop: newsRef.current?.offsetTop ?? 0,
			commuTop: commuRef.current?.offsetTop ?? 0,
		}
	}

	useEffect(() => {
		let ticking = false

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const container = containerRef.current
					if (!container) return

					const { scrollTop } = container
					const { storyTop, newsTop, commuTop } = getSectionPositions()

					const offset = 300

					if (scrollTop + offset < newsTop) {
						setActiveSection('story')
					} else if (scrollTop + offset < commuTop) {
						setActiveSection('news')
					} else {
						setActiveSection('commu')
					}

					ticking = false
				})
				ticking = true
			}
		}

		const container = containerRef.current
		if (container) {
			container.addEventListener('scroll', onScroll)
		}

		return () => {
			if (container) {
				container.removeEventListener('scroll', onScroll)
			}
		}
	}, [])

	// 탭 클릭 시 해당 탭 최 상단으로 이동
	const handleTabClick = (section: 'story' | 'news' | 'commu') => {
		const container = containerRef.current
		let targetRef: HTMLDivElement | null = null

		if (section === 'story') targetRef = storyRef.current
		else if (section === 'news') targetRef = newsRef.current
		else if (section === 'commu') targetRef = commuRef.current

		if (container && targetRef) {
			container.scrollTo({
				top: targetRef.offsetTop - 150,
				behavior: 'smooth',
			})
		}
	}

	return (
		<div className='flex flex-col w-4/5 border-4 border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-neutral-50'>
			<div className='flex flex-row w-full h-14'>
				<button
					className={`${activeSection === 'story' ? 'flex-[2]' : 'flex-1'} h-15 flex justify-center items-center ${
						activeSection === 'story' ? 'text-black' : 'text-gray-300'
					} text-lg font-bold cursor-pointer border-none rounded-3xl relative transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 ${
						activeSection === 'story' ? 'after:w-full' : 'after:w-0'
					} after:h-1 after:bg-purple-500 after:transition-all after:duration-300`}
					onClick={() => handleTabClick('story')}>
					스토리
				</button>
				<button
					className={`${activeSection === 'news' ? 'flex-[2]' : 'flex-1'} h-15 flex justify-center items-center ${
						activeSection === 'news' ? 'text-black' : 'text-gray-300'
					} text-lg font-bold cursor-pointer border-none rounded-3xl relative transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 ${
						activeSection === 'news' ? 'after:w-full' : 'after:w-0'
					} after:h-1 after:bg-purple-500 after:transition-all after:duration-300`}
					onClick={() => handleTabClick('news')}>
					새 소식
				</button>
				<button
					className={`${activeSection === 'commu' ? 'flex-[2]' : 'flex-1'} h-15 flex justify-center items-center ${
						activeSection === 'commu' ? 'text-black' : 'text-gray-300'
					} text-lg font-bold cursor-pointer border-none rounded-3xl relative transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 ${
						activeSection === 'commu' ? 'after:w-full' : 'after:w-0'
					} after:h-1 after:bg-purple-500 after:transition-all after:duration-300`}
					onClick={() => handleTabClick('commu')}>
					커뮤니티
				</button>
			</div>
			<div className='w-full h-[94vh] overflow-y-auto scroll-smooth' ref={containerRef}>
				<div className='w-full py-12 min-h-[600px] flex justify-center' ref={storyRef}>
					<FundingStory story={projectData?.story?.imgs} />
				</div>
				<div className='w-full py-12 min-h-[600px] flex justify-center' ref={newsRef}>
					<FundingNews notice={projectData?.notice?.notices} />
				</div>
				<div className='w-full py-12 min-h-[600px] flex justify-center' ref={commuRef}>
					<FundingCommu community={projectData?.community?.communities} />
				</div>
			</div>
		</div>
	)
}

export default FundingContent

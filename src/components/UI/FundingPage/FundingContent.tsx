import React, { JSX, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FundingCommu, FundingNews, FundingStory } from './FundingStory'

interface IProjectData {
	story: any[]
	notice: any[]
	community: any[]
}

interface props {
	projectData: IProjectData | null
}

const FundingContent = ( {projectData}:props ): JSX.Element => {
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
		<FundingContentWrapper>
			<TabBox>
				<TabButton isActive={activeSection === 'story'} onClick={() => handleTabClick('story')}>
					스토리
				</TabButton>
				<TabButton isActive={activeSection === 'news'} onClick={() => handleTabClick('news')}>
					새 소식
				</TabButton>
				<TabButton isActive={activeSection === 'commu'} onClick={() => handleTabClick('commu')}>
					커뮤니티
				</TabButton>
			</TabBox>
			<MainContent ref={containerRef}>
				<Section ref={storyRef}>
					<FundingStory story={projectData?.story} />
				</Section>
				<Section ref={newsRef}><FundingNews notice={projectData?.notice}/></Section>
				<Section ref={commuRef}><FundingCommu community={projectData?.community}/></Section>
			</MainContent>
		</FundingContentWrapper>
	)
}

export default FundingContent

const FundingContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 80%;
	border: 3px solid #f3f3f3;
	border-radius: 15px;
`

const MainContent = styled.div`
	width: 100%;
	height: 94vh;
	overflow-y: auto;
	scroll-behavior: smooth;
`

const Section = styled.div`
	width: 100%;
	padding: 50px 0;
	min-height: 600px;
	display: flex;
	justify-content: center;
`

const TabBox = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`

const TabButton = styled.button<{ isActive: boolean }>`
	flex: ${({ isActive }) => (isActive ? 2.0 : 1)};
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: white;
	color: ${({isActive}) => (isActive ? '' : '#cdcdcd' )};
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	border: none;
	border-radius: 20px;
	position: relative;
	transition: all 0.3s ease;

	&::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: ${({ isActive }) => (isActive ? '100%' : '0')};
		height: 4px;
		background-color: #a66cff;
		transition: width 0.3s ease;
	}
`

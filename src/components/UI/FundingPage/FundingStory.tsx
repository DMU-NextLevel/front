import React, { JSX } from 'react'
import styled from 'styled-components'
import NewsContent from './NewsContent'
import FundingMessage from './FundingMessage'

const baseUrl = process.env.REACT_APP_API_BASE_URL

interface storyProps {
	story: any[] | undefined
}

interface newsProps {
	notice: any[] | undefined
}

interface commuProps {
	community: any[] | undefined
}

export const FundingStory = ({ story }: storyProps): JSX.Element => {
	return (
		<InfoWrapper>
			<StoryInfo>📢 프로젝트 스토리</StoryInfo>
			<Bar />
			<div style={{minHeight:'800px'}}>
				{story?.map((story) => (
					<StoryContent key={story.id} src={`${baseUrl}/image/${story}`} />
				))}
			</div>
		</InfoWrapper>
	)
}

export const FundingNews = ({ notice }: newsProps): JSX.Element => {
	const exam = [
		{ id: 1, title: 'oooo 프로젝트 시작', content: '테스트테스트' },
		{
			id: 2,
			title: '프로젝트 FAQ 궁금해 하실 부분들을 말씀드릴게요',
			content: `안녕하세요, oooo입니다. 여러부늘이 관심을 가져주시고 계시는 저희 프로젝트에 대해 설명드리겠습니다 \n\n\n이건이거구요 저건저거구요`,
		},
	]

	return (
		<InfoWrapper>
			<StoryInfo>우리 프로젝트는 현재 이렇게 진행중이에요</StoryInfo>
			<Bar />
			{exam.map((news) => (
				<NewsContent title={news.title} content={news.content} />
			))}
		</InfoWrapper>
	)
}

export const FundingCommu = ({ community }: commuProps): JSX.Element => {
	const exam = [
		{
			isSender: false,
			message: '제가 찾던 아이템이에요! 너무 맘에 듭니다 혹시 사용시간은 얼마나 될까요?',
			date: '2025.01.01',
			userName: '위더',
		},
		{
			isSender: true,
			message: '저희 프로젝트에 관심을 가져주셔서 감사합니다! 저희 제품은 한번 충전으로 3일동안 사용 가능합니다!',
			date: '2025.01.01',
			userName: '스타터',
		},
	]

	return (
		<CommuWrapper>
			<StoryInfo>저희 소통해요</StoryInfo>
			<Bar />
			{exam.map((commu) => (
				<FundingMessage isSender={commu.isSender} message={commu.message} date={commu.date} userName={commu.userName} />
			))}
		</CommuWrapper>
	)
}

const InfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 90%;
`

const Bar = styled.div`
	width: 80%;
	border-bottom:3px solid #f3f3f3;
	border-radius: 20px;
	margin-bottom: 20px;
	margin-left: auto;
	margin-right: auto;
`

const CommuWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width:90%;
	padding-bottom: 600px;
`

const StoryInfo = styled.p`
	font-size: 20px;
	font-weight: bold;
	margin-right: auto;
`

const StoryContent = styled.img`
	width: 100%;
`


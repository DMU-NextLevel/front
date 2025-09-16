import React, { JSX } from 'react'
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
		<div className="flex flex-col items-center w-[90%]">
			<p className="text-xl font-bold mr-auto">📢 프로젝트 스토리</p>
			<div className="w-4/5 border-b-4 border-gray-100 rounded-3xl mb-5 mx-auto" />
			<div style={{ minHeight: '800px' }}>
				{story?.map((story) => (
					<img key={story.id} src={`${baseUrl}/img/${story}`} className="w-full" />
				))}
			</div>
		</div>
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
		<div className="flex flex-col items-center w-[90%]">
			<p className="text-xl font-bold mr-auto">우리 프로젝트는 현재 이렇게 진행중이에요</p>
			<div className="w-4/5 border-b-4 border-gray-100 rounded-3xl mb-5 mx-auto" />
			{exam.map((news) => (
				<NewsContent title={news.title} content={news.content} />
			))}
		</div>
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
		<div className="flex flex-col w-[90%] pb-[600px]">
			<p className="text-xl font-bold mr-auto">저희 소통해요</p>
			<div className="w-4/5 border-b-4 border-gray-100 rounded-3xl mb-5 mx-auto" />
			{exam.map((commu) => (
				<FundingMessage isSender={commu.isSender} message={commu.message} date={commu.date} userName={commu.userName} />
			))}
		</div>
	)
}


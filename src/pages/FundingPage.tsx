import React, { JSX, useEffect, useState } from 'react'
import FundingInfo from '../components/UI/FundingPage/FundingInfo'
import StarterInfo from '../components/UI/FundingPage/StarterInfo'
import FundingContent from '../components/UI/FundingPage/FundingContent'
import FundingModal from '../components/UI/FundingPage/FundingModal'
import Modal from '../components/layout/Modal'
import { api } from '../AxiosInstance'
import { useParams, useSearchParams } from 'react-router-dom'
import { useProjectFetch } from '../apis/useProjectFetch'

interface IUserData {
	title: string | undefined
	description: string | undefined
	image: string | undefined
	peopleNum: number | undefined // 참여 수
	amount: number | undefined //총액
	likeNum: number | undefined //추천수
	starter: string | undefined
	completionRate: number | undefined //달성률
}

interface IProjectData {
	story: any[]
	notice: any[]
	community: any[]
}

const FundingPage = (): JSX.Element => {
	const { no } = useParams<{ no: string }>()
	const [payOpen, setPayOpen] = useState<boolean>(false)
	const [searchParams] = useSearchParams()
	const [userData, setUserData] = useState<IUserData | null>(null)
	const [projectData, setProjectData] = useState<IProjectData | null>(null)
	const percent = searchParams.get('percent') ?? ''
	const { story, notice, community } = useProjectFetch({ projectId: no ?? '' })

	// 프로젝트 상세조회
	useEffect(() => {
		try {
			api.get(`/public/project/${no}`).then((res) => {
				setUserData({
					title: res.data.data.title,
					description: res.data.data.content,
					image: res.data.data.titleImg,
					peopleNum: res.data.data.fundingCount,
					amount: res.data.data.sum,
					likeNum: res.data.data.recommendCount,
					starter: res.data.data.authorNickName,
					completionRate: res.data.data.completionRate,
				})
			})
		} catch (e: any) {
			console.log(e)
			alert('프로젝트 정보 불러오기 실패')
		}
	}, [no])

	useEffect(() => {
		console.log(projectData)
	}, [projectData])

	return (
		<div className='flex pl-[2%] gap-[2%] mx-[15%]'>
			<div className='flex flex-col items-center w-[26%] min-w-[380px] gap-[2%]'>
				<FundingInfo
					setPayOpen={setPayOpen}
					title={userData?.title ?? ''}
					percent={percent ?? ''}
					image={userData?.image ?? ''}
					description={userData?.description ?? ''}
					amount={userData?.amount ?? 0}
					peopleNum={userData?.peopleNum ?? 0}
					likeNum={userData?.likeNum ?? 0}
				/>
				<StarterInfo starter={userData?.starter} />
			</div>
			<FundingContent projectData={{ story, notice, community }} />
			{payOpen && (
				<Modal onClose={() => setPayOpen(false)}>
					<FundingModal />
				</Modal>
			)}
		</div>
	)
}

export default FundingPage

import React, { JSX, useEffect, useState } from 'react'
import styled from 'styled-components'
import FundingInfo from '../components/UI/FundingPage/FundingInfo'
import StarterInfo from '../components/UI/FundingPage/StarterInfo'
import FundingContent from '../components/UI/FundingPage/FundingContent'
import FundingModal from '../components/UI/FundingPage/FundingModal'
import Modal from '../components/layout/Modal'
import { testApi } from '../AxiosInstance'
import { useParams, useSearchParams } from 'react-router-dom'

interface IUserData {
	title: string | undefined
	description: string | undefined
	image: string | undefined
	peopleNum : Number | undefined	// 참여 수
	amount: Number | undefined	//총액
	likeNum: Number | undefined	//추천수
	starter: string | undefined
	completionRate: Number | undefined	//달성률
}

const FundingPage = (): JSX.Element => {
	const {no} = useParams<{no:string}>()
	const [payOpen, setPayOpen] = useState<boolean>(false)
	const [searchParams] = useSearchParams()
	const [userData, setUserData] = useState<IUserData | null>(null)
	const percent = searchParams.get('percent')

	// 프로젝트 상세조회
	useEffect(() => {
		try {
			testApi.get(`/public/project/${no}`).then((res) => {
				setUserData({
					title: res.data.data.title,
					description: res.data.data.content,
					image: res.data.data.titleImg,
					peopleNum: res.data.data.fundingCount,
					amount: res.data.data.sum,
					likeNum: res.data.data.recommendCount,
					starter: res.data.data.authorNickName,
					completionRate: res.data.data.completionRate
				})
			})

		} catch(e:any) {
			console.log(e)
			alert('프로젝트 정보 불러오기 실패')
		}
	},[no])

	return (
		<FundingPageWrapper>
			<ColumBox>
				<FundingInfo
					setPayOpen={setPayOpen}
					title={userData?.title ?? ''}
					percent={percent ?? ''}
					image={userData?.image ?? ''}
					description={userData?.description ?? ''}
				/>
				<StarterInfo starter={userData?.starter} />
			</ColumBox>
			<FundingContent />
			{payOpen && (
				<Modal onClose={() => setPayOpen(false)}>
					<FundingModal />
				</Modal>
			)}
		</FundingPageWrapper>
	)
}

export default FundingPage

const FundingPageWrapper = styled.div`
	display: flex;
	padding-left: 2%;
	gap: 2%;
	margin: 0px 15%;
`

const ColumBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 26%;
	min-width: 380px;
	gap: 2%;
`
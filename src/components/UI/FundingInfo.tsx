import React, { JSX } from "react"
import styled from "styled-components"
import ExamImage from "../../assets/images/NextLevel.png"
import LikeImage from "../../assets/images/Like.svg"
import StarterInfo from './StarterInfo'

const FundingInfo = (): JSX.Element => {
	return (
		<FundingInfoWrapper>
				<InfoImage src={ExamImage} />
				<InfoTagWrapper>
					<Tag>고양이</Tag>
					<Tag>장난감</Tag>
				</InfoTagWrapper>
				<Title>글로벌 1위! 미국 2년 연속 1등 브랜드의 펫 공기털청기!</Title>
				<Description>
					이건 공기 청정기가 아닌 털청기입니다! 공기 청정은 기본, 공중에 날리는 털까지 모두 포집해버리니까요. 홈런펫 털청기로 집사와 주인님의 호흡기까지 건강하게 관리해보세요.
				</Description>
				<Rate>
					<PeopleNum>
						<span>194</span>명 참여
					</PeopleNum>
					<Amount>
						<span>47,756,000</span>원 달성
					</Amount>
				</Rate>
				<RowBox>
					<ColumBox>
						<Like src={LikeImage} />
						<Liker>2,551</Liker>
					</ColumBox>
					<PayButton>스타터와 함께하기</PayButton>
				</RowBox>
		</FundingInfoWrapper>
	)
}

export default FundingInfo

const FundingInfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 90%;
	border-radius: 15px;
	border: 3px solid #f3f3f3;
	padding: 5%;
`

const InfoImage = styled.img`
    width:100%;
    height: 300px;`

const InfoTagWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 50px;
    gap: 10px;    
`

const Tag = styled.p`
    display: flex;
    min-width: 50px;
    width: auto;
    height: 10px;
    padding: 10px;
    margin: 0;
    background-color : #f3f3f3;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    border-radius: 10px;
    `

const Title = styled.p`
    font-size: 20px;
    font-weight: bold;
    margin: 5px 0;
`

const Description = styled.p `
    font-size: 14px;
    margin: 5px 0;
    color: #8c8c8c;
`

const Rate = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
`

const PeopleNum = styled.p`
    margin: 5px 0;
    span {
    color: #A66CFF;
    font-weight: bold;
    font-size: 20px;
    margin-right: 5px;}
`

const Amount = styled.p`
margin: 5px 0;
    span {
    font-weight: bold;
    font-size: 20px;
    margin-right:5px;
    }
`

const RowBox = styled.div`
    display: flex;
    width:100%;
    height: 75px;
    gap: 20px;
`

const ColumBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Like = styled.img`
    width: 50px;
    height:50px;
    margin-bottom: 5px;
    &:hover {
        cursor: pointer;}
`

const Liker = styled.p`
    display: flex;
    justify-content: center;
    font-size: 14px;
    margin: 0;
    color: #8c8c8c;
`

const PayButton = styled.button`
    background-color: #A66CFF;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    height: 50px;
    &:hover {
        cursor: pointer;}
`


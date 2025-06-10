import React, { JSX, useState } from "react";
import styled from "styled-components";
import UserImage from '../../../assets/images/default_profile.png'
import FollowImage from '../../../assets/images/Heart.svg'
import StarterScore from './StarterScore'

interface props {
	starter: string | undefined
}

const StarterInfo = ({starter}:props): JSX.Element => {
	const [isFollowed, setIsFollowed] = useState<boolean>(false)
	const [follower, setFollower] = useState<number>(0)

	const handleFllow = () => {
		setIsFollowed((prev) => !prev)
	}

	return (
		<StarterInfoWrapper>
			<RowBox>
				<StarterProfile src={UserImage} />
				<div style={{ marginLeft: '10px' }}>
					<StarterName>{starter}</StarterName>
					<StarterFollower>{follower} 명 팔로우 중</StarterFollower>
				</div>
				<FollowStarter onClick={handleFllow} isFollowed={isFollowed}>
					<img src={FollowImage} alt='❤️' />
					<p>팔로우</p>
				</FollowStarter>
			</RowBox>
			<RowBox>
				<StarterScore title='평판' score={80} />
				<StarterScore title='소통' score={10} />
				<StarterScore title='인기' score={100} />
			</RowBox>
		</StarterInfoWrapper>
	)
}

export default StarterInfo

const StarterInfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 5%;
	width: 90%;
	min-height: 120px;
	border: 3px solid #f3f3f3;
	border-radius: 15px;
	gap: 30px;
`

const StarterProfile = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
`

const StarterName = styled.p`
	font-size: 16px;
	font-weight: bold;
	margin: 0px;
`

const StarterFollower = styled.p`
	font-size: 12px;
	margin: 0px;
	color: #a66cff;
`

const FollowStarter = styled.button<{ isFollowed: boolean }>`
	display: flex;
	flex-direction: row;
	width: 100px;
	height: 40px;
	border: none;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	gap: 10px;
	margin-left: auto;
	img {
		width: 20px;
	}
	&:hover {
		cursor: pointer;
	}
	background-color: ${({ isFollowed }) => (isFollowed ? '#a66cff' : '#f3f3f3')};
`

const RowBox = styled.div`
    display: flex;
    width:100%;
    height:30%;
    align-items: center;
`
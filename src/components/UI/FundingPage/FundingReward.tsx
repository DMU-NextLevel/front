import React, { JSX } from "react";
import styled from "styled-components";

interface props {
    price: string,
    title: string,
    description: string,
    date: string
}

const FundingReward = ( {price, title, description, date}:props ):JSX.Element => {
    return(
        <FundingRewardWraper>
            <Bar/>
            <Row>
                <CheckBox type="checkbox"/>
                <Price>{price}</Price>
            </Row>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <Date>{date}</Date>
        </FundingRewardWraper>
    )
}

export default FundingReward

const FundingRewardWraper = styled.div`
    margin: 20px;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

const CheckBox = styled.input`
    box-sizing: border-box;
    background-clip: content-box;
    padding: 0.25em;
    width:1.5em;
    height:1.5em;
    border-radius: 10%;
    cursor: pointer;
    &:checked {
        background-color: #A66CFF;
    }
`

const Price = styled.span`
    font-weight: bold;
    font-size: 20px;
`

const Title = styled.p`
    font-weight: bold;
    font-size: 20px;
`

const Description = styled.p`
    color: grey;
`

const Date = styled.p`
    color: grey;
`

const Bar = styled.div`
	width: 80%;
	border-bottom:3px solid #f3f3f3;
	border-radius: 20px;
	margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
`
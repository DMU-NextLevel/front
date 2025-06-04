import React, { JSX, useEffect, useState } from "react";
import styled from "styled-components";

interface props {
    id: Number,
    price: string,
    title: string,
    description: string,
    date: string
    checked: Number|null
    setSelectReward: React.Dispatch<React.SetStateAction<Number|null>>
}

const FundingReward = ( {id, price, title, description, date, checked, setSelectReward}:props ):JSX.Element => {
    const [check, setCheck] = useState<boolean>(false)

    const onCheck = () => {
       if (checked === id) {
            setSelectReward(null)
        } else {
            setSelectReward(id)
        }
    }

    useEffect(() => {
        if(checked === id) {
            setCheck(true)
        } else {
            setCheck(false)
        }
    },[checked, id])

    return(
        <FundingRewardWraper>
            <Bar/>
            <Row>
                <CheckBox type="checkbox" onChange={onCheck} checked={check}/>
                <Price checked = {check}>{price}</Price>
            </Row>
            <Title checked = {check}>{title}</Title>
            <Description checked={check}>{description}</Description>
            <Date checked={check}>{date}</Date>
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
    gap: 10px;
    align-items: center;
`

const CheckBox = styled.input`
    appearance: none;
    border: 1.5px solid gainsboro;
    border-radius: 0.35rem;
    padding: 0.25em;
    width: 2em;
    height: 2em;
    cursor: pointer;
    &:checked {
            border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #a66cff;
`

const Price = styled.span<{checked:boolean}>`
    font-weight: bold;
    font-size: 20px;
    color: #a66cff;
    opacity: ${({checked}) => checked ? '1' : '0.5'};
`

const Title = styled.p<{checked:boolean}>`
    font-weight: bold;
    font-size: 20px;
    color: #a66cff;
    opacity: ${({checked}) => checked ? '1' : '0.5'};
`

const Description = styled.p<{checked:boolean}>`
    color: grey;
    opacity: ${({checked}) => checked ? '1' : '0.5'};
`

const Date = styled.p<{checked:boolean}>`
    color: grey;
    opacity: ${({checked}) => checked ? '1' : '0.5'};
`

const Bar = styled.div`
	width: 80%;
	border-bottom:3px solid #f3f3f3;
	border-radius: 20px;
	margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
`
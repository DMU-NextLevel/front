import { JSX, useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface props {
    checked: Number|null
    setSelectReward: React.Dispatch<React.SetStateAction<Number|null>>
}

const FundingFree = ({checked, setSelectReward}:props):JSX.Element => {
    const [check, setCheck] = useState<boolean>(false)

    const onCheck = () => {
       if (checked === 0) {
            setSelectReward(null)
        } else {
            setSelectReward(0)
        }
    }

    useEffect(() => {
        if(checked === 0) {
            setCheck(true)
        } else {
            setCheck(false)
        }
    },[checked])

    return (
			<FundingFreeWrapper>
					<Bar />
					<Row>
						<CheckBox type='checkbox' onChange={onCheck} checked={check}/>
						<Title checked = {check}>자유로운 후원</Title>
					</Row>
					<div>
						<Amount checked={check} />
						<Point checked={check}>P</Point>
					</div>
			</FundingFreeWrapper>
		)
}

export default FundingFree

const FundingFreeWrapper = styled.div`
    margin: 20px;
`

const Bar = styled.div`
    width: 80%;
    border-bottom:3px solid #f3f3f3;
    border-radius: 20px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
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
    }
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    align-items: center;
    gap: 10px;
`

const Amount = styled.input<{checked:boolean}>`
	width: 40%;
	outline: none;
	border: none;
	border-bottom: 2px solid ${({checked}) => checked ? '#a66cff' : '#cdcdcd'};
	padding-bottom: 5px;
	margin-bottom: 5px;
	font-size: 16px;
	font-weight: bold;
`

const Title = styled.span<{checked:boolean}>`
	font-size: 16px;
	font-weight: bold;
    color: ${({checked}) => checked ? '#a66cff' : '#cdcdcd'};
`

const Point = styled.span<{checked:boolean}>`
    font-weight: bold;
    color: ${({checked}) => checked ? '#a66cff' : '#cdcdcd'};
`
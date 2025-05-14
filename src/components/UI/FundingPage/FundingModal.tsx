import React, { JSX, useEffect, useState } from "react"
import styled from "styled-components"
import FundingReward from "./FundingReward"
import FundingFree from "./FundingFree"
import FundingPay from "./FundingPay"

const exam = [
    {
        id: 1,
        price: '20000P',
        title: '제목인데요?',
        description: `설명인데요?`,
        date: '2025년 3월 말 제공 예정'
    }
]

const FundingModal = ():JSX.Element => {
    const [step, setStep] = useState<Number>(1)
    const [isShow, setIsShow] = useState<boolean>(false)

    useEffect(() => {
        if(step === 1) {
            setIsShow(false)
        } else if (step === 2) {
            setIsShow(true)
        }
    },[step])

    const nextClick = () => {
        setStep(2)
    }

    const moveStep = (step:number) => {
        setStep(step)
    }

    return(
        <FundingModalWrapper>
            <PayStep>
                <Circle isActive={step === 1} onClick={() => moveStep(1)}>리워드</Circle>
                <Bar/>
                <Circle isActive={step === 2} onClick={() => moveStep(2)}>결제</Circle>
            </PayStep>
            <Reward>
                {!isShow ? (
                    <>
                        <FundingFree/>
                        {exam.map((reward) => (
                            <FundingReward
                                price={reward.price}
                                title={reward.title}
                                description={reward.description}
                                date={reward.date}
                            />
                        ))}
                        <ModalButton onClick={nextClick}>다음</ModalButton>
                    </>
                ) : (
                    <>
                        <FundingPay/>
                        <ModalButton>함께하기</ModalButton>
                    </>

                )}
            </Reward>

        </FundingModalWrapper>
    )
}

export default FundingModal

const FundingModalWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    border: none;
    border-radius : 60px;
    height : 80vh;
    background-color:white;
    width: 30vw;
    padding: 30px;
`

const PayStep = styled.div`
    width: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    gap: 1vw;
`

const Reward = styled.div`
    width: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 8px;
        max-height: 10px;
        border-radius: 10px;
        background: none;
    }
    &::-webkit-scrollbar-thumb {
        max-height: 10px;
        border-radius: 20px;
        background: #aaaaaa;
    }
`

const ModalButton = styled.button`
    width: 30%;
    height: 40px;
    border: none;
    background-color: #a66cff;
    color: white;
    font-weight: bold;
    font-size: 18px;
    margin-top: 30px;
    cursor: pointer;
    margin-left: 35%;
    border-radius: 10px;
`

const Circle = styled.div<{ isActive:boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width:80px;
    height:80px;
    font-weight: bold;
    color: ${({isActive}) => isActive ? '' : '#c9c9c9'};
    border-radius:50%;
    border: ${({isActive}) => isActive ? '3px dashed #a66cff' : '2px dashed #c9c9c9'};
    margin: 5px;
`

const Bar = styled.div`
    width: 15%;
    height: 0px;
    border-bottom:3px dashed #f3f3f3;
    border-radius: 20px;
`
import { JSX } from "react";
import styled from "styled-components";

const FundingFree = ():JSX.Element => {
    return(
        <FundingFreeWrapper>
            <Bar/>
            <Row>
                <CheckBox type="checkbox"/>
                <Title>자유로운 후원</Title>
            </Row>
            <div>
                <Amount/>
                <span>P</span>
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

const Row = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
`

const Amount = styled.input`
    width: 40%;
    outline:none;
    border: none;
    border-bottom: 2px solid;
    padding-bottom: 5px;
    font-size: 16px;
`

const Title = styled.span`
    font-size: 20px;
    font-weight: bold;
`
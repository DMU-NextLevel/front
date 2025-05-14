import { JSX, useState } from "react";
import styled from "styled-components";

const FundingPay = ():JSX.Element => {


	const termsList = [
		'[필수] 구매조건, 결제 진행 및 결제 대행 서비스 동의',
		'[필수] 개인정보 제3자 제공 동의',
		'[필수] 책임 규정에 대한 동의',
	]
    const [allAgree, setAllAgree] = useState(false)
    const [checkedTerms, setCheckedTerms] = useState(new Array(termsList.length).fill(false))

    const handleTermChange = (index: number) => {
		const updated = [...checkedTerms]
		updated[index] = !updated[index]
		setCheckedTerms(updated)
		setAllAgree(updated.every(Boolean))
	}

    return (
        <FundingPayWrapper>
            <SelectedItem>
                <Reward>선택한 리워드</Reward>
                <RewardDes>리워드 설명</RewardDes>
                <div style={{display : 'flex', justifyContent: 'space-between'}}>
                    <p>옵션</p>
                    <p>수량 : a개 00000P</p>
                </div>
            </SelectedItem>
            <CouponDiv>
                <p>쿠폰</p>
                <select>
                    <option>쿠폰을 선택해주세요.</option>
                </select>
            </CouponDiv>
            <PriceDiv>
                <PriceTab>
                    <span>리워드 금액</span>
                    <span>10,000P</span>
                </PriceTab>
                <PriceTab>
                    <span>쿠폰 금액</span>
                    <span>0P</span>
                </PriceTab>
                <PriceTab2>
                    <span>총 결제 금액</span>
                    <span>10,000P</span>
                </PriceTab2>
            </PriceDiv>
            <AlertTab>
               <p style={{fontWeight: 'bold'}}>‼️후원 유의사항</p>
               <p>• 지금 결제를 한 경우에도 프로젝트가 종료되기 전까지 언제든 결제를 취소할 수 있어요.</p>
               <p>• 결제를 시도하기 전에 포인트가 충분한지 확인해주세요,</p>
            </AlertTab>
            <TermsDiv>
                <p style={{fontSize: '20px', fontWeight: 'bold', color:'black'}}>약관동의</p>
                {termsList.map((text, idx) => (
						<CheckboxWrapper key={idx}>
							<input type='checkbox' checked={checkedTerms[idx]} onChange={() => handleTermChange(idx)} /> {text}
						</CheckboxWrapper>
					))}
            </TermsDiv>
        </FundingPayWrapper>
    )
}

export default FundingPay

const FundingPayWrapper = styled.div`
    margin: 20px;
`

const Bar = styled.div`
    width: 15%;
    height: 0px;
    border-bottom:3px solid #f3f3f3;
    border-radius: 20px;
`

const SelectedItem = styled.div`
    border-top: 3px solid #f3f3f3;
    border-bottom: 3px solid #f3f3f3;
`

const Reward = styled.p`
    color: #a66cff;
    font-weight: bold;
`

const RewardDes = styled.p`
    color: #8c8c8c;
`

const CouponDiv = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background-color:rgb(241, 241, 241);
    margin-top: 10px;
`

const PriceDiv = styled.div`
    margin: 30px 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #f3f3f3;
`

const PriceTab = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
`

const PriceTab2 = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-weight: bold;
    font-size: 20px;
`

const AlertTab = styled.div`
    background-color: #f3f3f3;
    color: #8c8c8c;
    padding: 5px 20px;
`
const CheckboxWrapper = styled.div`
	margin-bottom: 16px;
`

const TermsDiv = styled.div`
    margin: 30px 0;
    font-size: 16px;
    color: #8c8c8c;
`
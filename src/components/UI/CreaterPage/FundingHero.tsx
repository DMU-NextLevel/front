import React from 'react';
import styled from 'styled-components';
import MovingCategories from './MovingCategories';

const HeroContainer = styled.div`
  min-height: 300px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin-bottom: 0;
`;

const SubTitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 400;
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HighlightText = styled.span`
  color: #06b6d4;
`;

const Description = styled.p`
  font-size: 1.5rem;
  color: #475569;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FundingHero = () => {
  return (
    <HeroContainer>
      <ContentWrapper>
        <SubTitle>저도 자격이 될까요?</SubTitle>
        <MainTitle>
          위드유 펀딩 서비스는<br />
          <HighlightText>개인, 개인 사업자, 법인 사업자</HighlightText>까지<br />
          누구나 이용할 수 있습니다.
        </MainTitle>
        <Description></Description>
      </ContentWrapper>
      <MovingCategories />
    </HeroContainer>
  );
};

export default FundingHero;

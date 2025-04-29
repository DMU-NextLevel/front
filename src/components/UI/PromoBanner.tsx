import React from 'react';
import styled from 'styled-components';

const BannerWrapper = styled.div`
  background: linear-gradient(to bottom, #a064ff, #b1e1ff);
  padding: 40px 100px;
  border-radius: 8px;
  text-align: left; 
  margin: 0;
`;

const Title = styled.h2`
  color: white;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Description = styled.p`
  color: white;
  font-size: 20px;
  line-height: 1.5;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: white;
`;
const Button = styled.button`
  background-color: #B1E1FF;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
  justify-content: between-space;
  &:hover {
    background-color: #a064ff;
  }
`;

const PromoBanner = () => {
  return (
    <BannerWrapper>
      <Title>좋은 아이디어를 수익화 해보는건 어떤가요?</Title>
      <ContentWrapper>
        <Description>
          프로젝트를 등록해서 스타터가 되어보세요! <br />
          저희가 당신과 함께 하겠습니다, <Highlight>withU</Highlight>
          
        </Description>
        <Button>프로젝트 등록하기</Button>
      </ContentWrapper>
    </BannerWrapper>
  );
};

export default PromoBanner;
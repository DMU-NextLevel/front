import React from 'react';
import styled from 'styled-components';

const BannerWrapper = styled.div`
  background: linear-gradient(to bottom, #a064ff, #b1e1ff);
  padding: 40px 20px;
  border-radius: 8px;
  width: 120%;
  text-align: left;
  max-width: 950px;
  margin: 120px auto 200px 20px;
`;

const Title = styled.h2`
  color: white;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 16px;
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

const PromoBanner = () => {
  return (
    <BannerWrapper>
      <Title>좋은 아이디어를 수익화 해보는건 어떤가요?</Title>
      <Description>
        프로젝트를 등록해서 스타터가 되어보세요! <br />
        저희가 당신과 함께 하겠습니다, <Highlight>withU</Highlight>
      </Description>
    </BannerWrapper>
  );
};

export default PromoBanner;
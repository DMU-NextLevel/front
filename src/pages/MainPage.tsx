// MainPage.tsx

import React from "react";
import styled from "styled-components";
import MainBanner from "../components/UI/MainBanner";
import RecommendProject from "../components/UI/RecommendProject";
import PromoBanner from "../components/UI/PromoBanner";


const MainPage: React.FC = () => {
  return (
    <MainWrapper>
        <MainBanner />
        <RecommendProject />
        <PromoBanner />
    </MainWrapper>
  );
};

export default MainPage;


const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 40px 24px;              // 좌우 여백 조정
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
`;



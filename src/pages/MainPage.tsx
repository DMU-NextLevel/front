// MainPage.tsx

import React from "react";
import styled from "styled-components";
import MainBanner from "../components/UI/MainBanner";
import RecommendProject from "../components/UI/RecommendProject";
import PromoBanner from "../components/UI/PromoBanner";
import RankingList from "../components/UI/RankingList";
import FollowProjectBanner from "../components/UI/FollowProjectBanner";
import RealTimeFeed from "../components/UI/RealTimeFeed";


const MainPage: React.FC = () => {
  return (
    <MainWrapper>
        <MainBanner />
        <RecommendProject />
        <RankingList />
        <RealTimeFeed />
        <FollowProjectBanner />
        <PromoBanner />
    </MainWrapper>
  );
};

export default MainPage;


const MainWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-left: 0;        // 👈 왼쪽 정렬
  margin-right: auto;    // 👈 오른쪽 여백만 자동
  padding: 40px 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;




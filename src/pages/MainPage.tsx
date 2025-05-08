import React from "react";
import styled from "styled-components";
import MainBanner from "../components/UI/MainBanner";
import RecommendProject from "../components/UI/RecommendProject";
import PromoBanner from "../components/UI/PromoBanner";
import RankingList from "../components/UI/RankingList";
import FollowProjectBanner from "../components/UI/FollowProjectBanner";
import RealTimeFeed from "../components/UI/RealTimeFeed";
import CategoryNav from "../components/UI/CategoryNav";

const MainPage: React.FC = () => {
  return (
    
    <MainWrapper>
        <MainBanner />
        <MainContentWrapper>
          <MainContentLine1>
            <RecommendProject />
            <RankingList />
          </MainContentLine1>
          <RealTimeFeed />
          <PromoBanner />
        </MainContentWrapper>
    </MainWrapper>
  );
};

export default MainPage;


const MainWrapper = styled.div`

  margin-left: 0;        // 👈 왼쪽 정렬
  margin-right: auto;    // 👈 오른쪽 여백만 자동
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const MainContentWrapper = styled.div`
  margin: 0 15%;
  padding: 20px 0;

  @media (max-width: 1500px) {
    margin: 0 10%;
  }
  @media (max-width: 1200px) {
    margin: 0 5%;
`;

const MainContentLine1 = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`;



import React, { useState } from "react";
import styled from "styled-components";
import MainBanner from "../components/UI/MainBanner";
import RecommendProject from "../components/UI/RecommendProject";
import PromoBanner from "../components/UI/PromoBanner";
import RankingList from "../components/UI/RankingList";
import FollowProjectBanner from "../components/UI/FollowProjectBanner";
import RealTimeFeed from "../components/UI/RealTimeFeed";
import CategoryNav from "../components/UI/CategoryNav";
import CategorySelector from "./CategorySelector";

const categories = [
  { label: '전체', icon: 'bi bi-circle', tag: '' },
  { label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
  { label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
  { label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
  { label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
  { label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
  { label: '게임', icon: 'bi bi-controller', tag: '6' },
  { label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
  { label: '반려동물', icon: 'bi bi-star', tag: '8' },
  { label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
  { label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
];


const MainPage: React.FC = () => {
  const [tag, setTag] = useState('');

  return (
    
    <MainWrapper>
        <MainBanner />
        
        <MainContentWrapper>
          <CategorySelector categories={categories} />
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



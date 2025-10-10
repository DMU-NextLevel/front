import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import MainBanner from "../components/UI/MainPage/MainBanner";
import RecommendProject from "../components/UI/MainPage/RecommendProject";
import PromoBanner from "../components/UI/MainPage/PromoBanner";
import RankingList from "../components/UI/MainPage/RankingList";
import FollowProjectBanner from "../components/UI/MainPage/FollowProjectBanner";
import CategorySelector from "../components/UI/MainPage/CategorySelector";
import CategoryBar from "../components/UI/shared/CategoryBar";
import NewProject from "../components/UI/MainPage/NewProject";
import HeroSection from "../components/UI/MainPageModern/HeroSection";
// Removed "카테고리 탐색" selector section
import PersonalizedProjectGallery from "../components/UI/MainPageModern/PersonalizedProjectGallery";
import StatsSection from "../components/UI/MainPageModern/StatsSection";
import BloomProjectGallery from "../components/external/Bloom/ProjectGalleryLite";
import BloomStatistics from "../components/external/Bloom/StatisticsLite";

const categories = [

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
  const navigate = useNavigate();

  return (
  <div className="w-full max-w-none flex flex-col box-border text-gray-700">
      {/* Modern hero and sections */}
      
      <div className="w-full px-0">
        <HeroSection />
      </div>
      
      <div className="w-full px-0">
        {/* New CategoryBar placed above existing CategorySelector */}
        <div className="mt-4 mx-[15%]">
          <CategoryBar
            categories={categories}
            value={tag}
            onChange={(t: string) => {
              setTag(t)
              navigate(`/search?tag=${t}`)
            }}
            className="px-0 py-0"
          />
        </div>

        {/* Use the clean CategorySelector directly below stats (누적펀딩 금액 아래) */}
        <div className="mt-6" />
      </div>

      {/* 취향 맞춤 프로젝트 전체 너비 */}
      <div className="mt-2 mx-[15%]">
        <PersonalizedProjectGallery />
      </div>

      <hr className="h-px bg-gray-100 border-none w-full" />

      <div className="w-full bg-gray-50">
        {/* Legacy sections retained below while we transition */}
        <div className="mt-10" />

        <StatsSection />

  <hr className="h-px bg-gray-100 border-none w-full" />
        {/* 인기 프로젝트 섹션 제거 (요청에 따라) */}
        <NewProject />
  <hr className="h-px bg-gray-100 border-none w-full" />
  <br/>
        {/* <PromoBanner /> */}
      </div>

      {/* External (Bloom) sections appended below */}
      {/* <div className="w-full px-0">
        <div className="mt-16" />
        <BloomProjectGallery />
        <BloomStatistics />
      </div> */}
    </div>
  );
};

export default MainPage;
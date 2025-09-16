import React, { useState } from "react";
import MainBanner from "../components/UI/MainPage/MainBanner";
import RecommendProject from "../components/UI/MainPage/RecommendProject";
import PromoBanner from "../components/UI/MainPage/PromoBanner";
import RankingList from "../components/UI/MainPage/RankingList";
import FollowProjectBanner from "../components/UI/MainPage/FollowProjectBanner";
import RealTimeFeed from "../components/UI/MainPage/RealTimeFeed";
import CategorySelector from "../components/UI/MainPage/CategorySelector";
import NewProject from "../components/UI/MainPage/NewProject";

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
    <div className="ml-0 mr-auto flex flex-col box-border text-gray-700">
      <MainBanner />

      <div className="mx-[15%] p-0 xl:mx-[10%] lg:mx-[2%]">
        <CategorySelector categories={categories} />
        <hr className="absolute left-0 right-0 h-px bg-gray-100 border-none mx-auto" />
        <div className="w-full flex justify-between mx-auto p-0 box-border">
          <RecommendProject />
          <RankingList />
        </div>
        <hr className="absolute left-0 right-0 h-px bg-gray-100 border-none mx-auto" />
        <NewProject />
        <hr className="absolute left-0 right-0 h-px bg-gray-100 border-none mx-auto" />
        <br/>
        <RealTimeFeed />
        <PromoBanner />
      </div>
    </div>
  );
};

export default MainPage;
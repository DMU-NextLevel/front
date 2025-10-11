import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import MainBanner from "../components/UI/MainPage/MainBanner";
import RecommendProject from "../components/UI/MainPage/RecommendProject";
import PromoBanner from "../components/UI/MainPage/PromoBanner";
import RankingList from "../components/UI/MainPage/RankingList";
import FollowProjectBanner from "../components/UI/MainPage/FollowProjectBanner";
import CategorySelector from "../components/UI/MainPage/CategorySelector";
import CategorySlider from "../components/UI/MainPageModern/CategorySlider";
import NewProject from "../components/UI/MainPage/NewProject";
import HeroSection from "../components/UI/MainPageModern/HeroSection";
// Removed "카테고리 탐색" selector section
import PersonalizedProjectGallery from "../components/UI/MainPageModern/PersonalizedProjectGallery";
import StatsSection from "../components/UI/MainPageModern/StatsSection";
import BloomProjectGallery from "../components/external/Bloom/ProjectGalleryLite";
import BloomStatistics from "../components/external/Bloom/StatisticsLite";

const categories = [

  { label: '테크/가전', icon: 'bi bi-cpu', tag: '1', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '라이프스타일', icon: 'bi bi-house', tag: '2', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '패션/잡화', icon: 'bi bi-bag', tag: '3', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '취미/DIY', icon: 'bi bi-brush', tag: '5', image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '게임', icon: 'bi bi-controller', tag: '6', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '교육/키즈', icon: 'bi bi-book', tag: '7', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '반려동물', icon: 'bi bi-star', tag: '8', image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '여행/레저', icon: 'bi bi-airplane', tag: '9', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
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


        {/* Use the clean CategorySelector directly below stats (누적펀딩 금액 아래) */}
        <div className="mt-6" />
      </div>

      {/* 취향 맞춤 프로젝트 전체 너비 */}
      <div className="mt-2">
        <PersonalizedProjectGallery />
      </div>

                  {/* 인터렉티브 배너 섹션 */}
      <div className="w-full py-12 bg-gray-50">
                {/* New CategoryBar placed above existing CategorySelector */}
        <div className="mt-2 mx-[15%]">
          <CategorySlider
            categories={categories}
            value={tag}
            onChange={(t: string) => {
              setTag(t)
              navigate(`/search?tag=${t}`)
            }}
            className="px-0 py-0"
          />
        </div>
      </div>


      <hr className="h-px bg-gray-100 border-none w-full" />

      <div className="w-full bg-gray-50">
        {/* Legacy sections retained below while we transition */}
        <div className="mt-10" />

        <StatsSection />

  <hr className="h-px bg-gray-100 border-none w-full" />
        {/* 신규 프로젝트 섹션 */}
        <div className=" py-16 px-[15%]">
          <div className="max-w-7xl  mx-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-center">
              {/* 좌측 텍스트 */}
              <div className="lg:col-span-3 text-center lg:text-left  rounded-2xl ring-1 ring-gray-200 overflow-hidden bg-white hover:ring-purple-300 hover:shadow-lg transition p-8 flex flex-col justify-center s">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  신규 프로젝트
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  새로운 프로젝트를 만나보세요!
                </p>
              </div>

              {/* 우측 슬라이드 */}
              <div className="lg:col-span-7 w-full min-h-[400px]">
                <NewProject />
              </div>
            </div>
          </div>
        </div>

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
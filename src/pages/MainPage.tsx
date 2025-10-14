import React, { useEffect } from "react";
import AOS from 'aos'
import 'aos/dist/aos.css'
import RecommendedProject from "../components/UI/MainPage/RecommendedProject";
import FeatureOverview from "../components/UI/MainPage/FeatureOverview";
import CategorySelector from "../components/UI/MainPage/CategorySelector";
import NewProject from "../components/UI/MainPage/NewProject";
import HeroSection from "../components/UI/MainPage/HeroSection";
import PopularProjectGallery from "../components/UI/MainPage/PersonalizedProjectGallery";
import CustomizedProjectGallery from "../components/UI/MainPage/CustomizedProjectGallery";
import StatsSection from "../components/UI/MainPage/StatsSection";
import LoginSection from "../components/UI/MainPage/LoginSection";

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
  useEffect(() => {
    AOS.init({
      once: true, // 애니메이션이 한번만 실행되도록 설정
      duration: 600,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
  <div className="w-full max-w-none flex flex-col box-border text-gray-700">
      {/* Modern hero and sections */}
      
      <div className="w-full px-0">
        <HeroSection />
  
      </div>
      
      {/* 띄모양 배너 */}
      <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-sm md:text-base text-gray-700 font-medium">
            ✓ 모금 시작 시 수수료 없음 &nbsp;&nbsp; ✓ 5분 만에 시작 &nbsp;&nbsp; ✓ 신용카드 불필요 &nbsp;&nbsp; ✓ 누구나 쉽게 시작 가능
          </div>
        </div>
      </div>
      
              <div className="my-5 mx-[15%]">
          <CategorySelector
            categories={categories}
          />
        </div>
      
      <div className="w-full px-0">


        {/* Use the clean CategorySelector directly below stats (누적펀딩 금액 아래) */}
        <div className="mt-6" />
      </div>

      {/* 추천 프로젝트 섹션 */}
      <div className="mt-8">
        <RecommendedProject />
      </div>

      {/* 구분선 */}
      <hr className="h-px bg-gray-200 border-none w-full" />

      {/* 취향 맞춤 프로젝트 전체 너비 */}
      <div className="mt-8">
        <PopularProjectGallery />
      </div>

      {/* 구분선 */}
      <hr className="h-px bg-gray-200 border-none w-full" />

      {/* 취향 맞춤 프로젝트 섹션 */}
      <div className="mt-8">
        <CustomizedProjectGallery />
      </div>

      {/* 구분선 */}
      <hr className="h-px bg-gray-200 border-none w-full" />

      {/* 신규 프로젝트 섹션 */}
      <div className="mt-8 py-16 px-[15%]">
        <div>
          {/* 우측 슬라이드 */}
          <div className="w-full min-h-[400px]">
            <NewProject />
          </div>
        </div>
      </div>

                  {/* 인터렉티브 배너 섹션 */}
          
      <hr className="h-px bg-gray-100 border-none w-full" />
          
      <div className="w-full bg-gray-50">
        {/* Legacy sections retained below while we transition */}
        
        <div className="" />
              <FeatureOverview />
        <StatsSection />

        <LoginSection />

  <hr className="h-px bg-gray-100 border-none w-full" />
      </div>


    </div>
  );
  
};

export default MainPage;
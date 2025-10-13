import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DotsLoader from '../Common/DotsLoader'

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  backgroundImage: string;
  accentColor: string;
}

const slideData: SlideData[] = [
  {
    id: 1,
    title: '새로운 아이디어가\n현실이 되는 곳',
    subtitle: '크라우드펀딩 플랫폼',
    description: '혁신적인 프로젝트를 발견하고 응원하세요.',
    primaryButton: {
      text: '프로젝트 둘러보기',
      link: '/search?order=RECOMMEND'
    },
    secondaryButton: {
      text: '프로젝트 시작하기',
      link: '/creater'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    accentColor: 'from-blue-600 to-purple-600'
  },
  {
    id: 2,
    title: '지속 가능한 미래를\n함께 만들어요',
    subtitle: '환경을 생각하는 프로젝트',
    description: '환경 친화적인 아이디어로 더 나은 세상을 만들어가요.',
    primaryButton: {
      text: '', // '지속가능 프로젝트',
      link: '' // '/search?tag=eco'
    },
    secondaryButton: {
      text: '', // '더 알아보기',
      link: '' // '/about'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    accentColor: 'from-green-600 to-teal-600'
  },
  {
    id: 3,
    title: '기술로 연결되는\n더 나은 일상',
    subtitle: '혁신적인 테크 프로젝트',
    description: '최신 기술로 더 편리하고 풍요로운 삶을 경험하세요.',
    primaryButton: {
      text: '테크 프로젝트 보기',
      link: '/search?tag=1'
    },
    secondaryButton: {
      text: '크리에이터 되기',
      link: '/creater'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    accentColor: 'from-indigo-600 to-purple-600'
  },
  {
    id: 4,
    title: '창작자의 꿈을\n응원합니다',
    subtitle: '크리에이티브한 아이디어',
    description: '예술, 디자인, 문화 콘텐츠까지. 당신의 열정이 세상을 움직입니다.',
    primaryButton: {
      text: '크리에이티브 프로젝트',
      link: '/search?tag=creative'
    },
    secondaryButton: {
      text: '커뮤니티 참여',
      link: '/community'
    },
    backgroundImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    accentColor: 'from-orange-600 to-red-600'
  }
];

const HeroSection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(slideData.length).fill(false));
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % slideData.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev - 1 + slideData.length) % slideData.length);
  };

  const goToSlide = (index: number) => {
    setCurrentImage(index);
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  // Dots 로딩 애니메이션
  useEffect(() => {
    // CSS 애니메이션으로 구현됨
  }, [imagesLoaded])

  // Scroll zoom effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload images for better UX
  useEffect(() => {
    slideData.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.backgroundImage;
      img.onload = () => handleImageLoad(index);
    });
  }, []);

  return (
    <div className="relative w-full bg-gray-100 -mt-14">
      <div ref={sliderRef} className="image-slider relative w-full h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
        {/* Images Container */}
        <div className="images absolute inset-0">
          {slideData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
              }`}
            >
              <img
                src={slide.backgroundImage}
                alt={slide.title}
                className="w-full h-full object-cover"
                onLoad={() => handleImageLoad(index)}
                style={{
                  transform: `scale(${1 + scrollY * 0.0002})`,
                  transition: 'transform 0.1s ease-out',
                  filter: index === 0 ? 'brightness(0.7)' : 'none',
                  opacity: imagesLoaded[index] ? 1 : 0
                }}
              />

              {/* 로딩 중 배경 */}
              {!imagesLoaded[index] && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black z-10"
                >
                  <div className="z-20">
                    <DotsLoader />
                    <p className="text-white text-sm font-medium mt-4 text-center">이미지 로딩 중...</p>
                  </div>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent flex items-start pt-[200px] sm:pt-[250px] md:pt-[300px] lg:pt-[350px]">
                <div className="px-4 sm:px-6 md:px-8 lg:px-[15%] py-6 sm:py-8 md:py-12 text-white max-w-none">
                  <div className="mb-3 sm:mb-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                      {slide.subtitle}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 leading-relaxed max-w-2xl">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {slide.primaryButton.text && (
                      <button
                        onClick={() => navigate(slide.primaryButton.link)}
                        className="group relative px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-blue-200 text-sm sm:text-base"
                      >
                        <span className="relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:text-blue-900">
                          {slide.primaryButton.text}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    )}
                    {slide.secondaryButton.text && (
                      <button
                        onClick={() => navigate(slide.secondaryButton.link)}
                        className="group relative px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-white font-semibold rounded-full backdrop-blur-sm hover:bg-gradient-to-r hover:from-white hover:to-gray-100 hover:text-gray-900 hover:shadow-2xl hover:shadow-white/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden text-sm sm:text-base"
                      >
                        <span className="relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:text-gray-900">
                          {slide.secondaryButton.text}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnails */}
        <div className="thumbnails absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2">
          {slideData.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.backgroundImage}
              alt={`Thumbnail ${index + 1}`}
              className={`w-12 h-8 sm:w-16 sm:h-10 object-cover cursor-pointer rounded border-2 transition-all duration-300 ${
                index === currentImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* 임시 로딩 토글 버튼 (테스트용) */}
        {/* <button
          onClick={toggleLoading}
          className="fixed bottom-6 right-6 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
          title="로딩 애니메이션 토글 (테스트용)"
        >
          {imagesLoaded[currentImage] ? '🔄 로딩 ON' : '⏸️ 로딩 OFF'}
        </button> */}
      </div>
    </div>
  )
}

export default React.memo(HeroSection)
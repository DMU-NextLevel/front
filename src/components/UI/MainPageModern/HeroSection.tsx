import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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
      text: '지속가능 프로젝트',
      link: '/search?tag=eco'
    },
    secondaryButton: {
      text: '더 알아보기',
      link: '/about'
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

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Scroll zoom effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-gray-100">
      <div ref={sliderRef} className="image-slider relative w-full h-[70vh] min-h-[500px] overflow-hidden">
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
                style={{
                  transform: `scale(${1 + scrollY * 0.0003})`,
                  transition: 'transform 0.1s ease-out'
                }}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-start pt-[250px]">
                <div className="px-[15%] py-8 md:py-12 text-white max-w-none">
                  <div className="mb-4">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                      {slide.subtitle}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate(slide.primaryButton.link)}
                      className="group relative px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-blue-200"
                    >
                      <span className="relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:text-blue-900">
                        {slide.primaryButton.text}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    <button
                      onClick={() => navigate(slide.secondaryButton.link)}
                      className="group relative px-8 py-3 border-2 border-white text-white font-semibold rounded-full backdrop-blur-sm hover:bg-gradient-to-r hover:from-white hover:to-gray-100 hover:text-gray-900 hover:shadow-2xl hover:shadow-white/40 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                      <span className="relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:text-gray-900">
                        {slide.secondaryButton.text}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Thumbnails */}
        <div className="thumbnails absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slideData.map((slide, index) => (
            <img
              key={slide.id}
              src={slide.backgroundImage}
              alt={`Thumbnail ${index + 1}`}
              className={`w-16 h-10 object-cover cursor-pointer rounded border-2 transition-all duration-300 ${
                index === currentImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div
          className="absolute bottom-4 flex gap-2 z-20"
          style={{ right: '15%' }}
        >
          <button
            onClick={prevSlide}
            className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            ‹
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
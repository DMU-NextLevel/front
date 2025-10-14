import React, { useState } from 'react';
import { Heart, Share2, TrendingUp, Clock, Users, Target } from 'lucide-react';
import noImage from '../../../assets/images/noImage.jpg';

type CategoryId = 'all' | 'tech' | 'lifestyle' | 'health';

const BloomProjectGallery: React.FC = () => {
  const [filter, setFilter] = useState<CategoryId>('all');
  const [likedProjects, setLikedProjects] = useState<number[]>([]);

  const categories: { id: CategoryId; name: string; icon: React.ComponentType<any> }[] = [
    { id: 'all', name: '전체', icon: Target },
    { id: 'tech', name: '테크', icon: TrendingUp },
    { id: 'lifestyle', name: '라이프스타일', icon: Heart },
    { id: 'health', name: '헬스케어', icon: Users },
  ];

  const projects = [
    {
      id: 1,
      title: '차세대 무선 이어폰',
      description: '혁신적인 노이즈 캔슬링 기술이 적용된 프리미엄 무선 이어폰',
      image: noImage,
      category: 'tech' as CategoryId,
      progress: 85,
      raised: 485000000,
      target: 250000000,
      backers: 1247,
      daysLeft: 15,
      creator: '이노베이트 테크',
      isHot: true,
    },
    {
      id: 2,
      title: '스마트 홀로그램 워치',
      description: '공상과학 영화 속 기술을 현실로, 홀로그램 디스플레이 스마트워치',
      image: noImage,
      category: 'tech' as CategoryId,
      progress: 45,
      raised: 290000000,
      target: 200000000,
      backers: 892,
      daysLeft: 23,
      creator: '퓨처 웨어',
      isHot: true,
    },
    {
      id: 3,
      title: '포터블 솔라 파워뱅크',
      description: '어디서나 깨끗한 에너지로 충전하는 친환경 파워뱅크',
      image: noImage,
      category: 'lifestyle' as CategoryId,
      progress: 92,
      raised: 138000000,
      target: 150000000,
      backers: 567,
      daysLeft: 31,
      creator: '그린 에너지',
      isHot: false,
    },
    {
      id: 4,
      title: 'AI 스마트 홈 허브',
      description: '집안의 모든 기기를 하나로 연결하는 차세대 스마트홈 솔루션',
      image: noImage,
      category: 'tech' as CategoryId,
      progress: 100,
      raised: 630000000,
      target: 300000000,
      backers: 2156,
      daysLeft: 8,
      creator: '스마트 리빙',
      isHot: true,
    },
    {
      id: 5,
      title: '접이식 노트북 스탠드',
      description: '어디서나 완벽한 작업환경을 만들어주는 휴대용 노트북 스탠드',
      image: noImage,
      category: 'lifestyle' as CategoryId,
      progress: 67,
      raised: 250000000,
      target: 150000000,
      backers: 834,
      daysLeft: 19,
      creator: '워크 스페이스',
      isHot: false,
    },
    {
      id: 6,
      title: 'AI 피트니스 트래커',
      description: '개인 맞춤형 운동 코칭을 제공하는 스마트 피트니스 밴드',
      image: noImage,
      category: 'health' as CategoryId,
      progress: 34,
      raised: 201000000,
      target: 150000000,
      backers: 678,
      daysLeft: 27,
      creator: '헬스 테크',
      isHot: false,
    },
  ];

  const filteredProjects =
    filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const toggleLike = (projectId: number) => {
    setLikedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const formatCurrency = (amount: number) => `${(amount / 100000000).toFixed(1)}억원`;

  return (
    <section id="bloom-projects" className="py-16 bg-white" data-aos="fade-up">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            인기 <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">프로젝트</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            혁신적인 아이디어들이 현실이 되는 과정을 지켜보세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = filter === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition-colors ${
                  active
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                {project.isHot && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    HOT
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-gray-200"
                    onClick={() => toggleLike(project.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedProjects.includes(project.id) ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white border border-gray-200">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <img
                  src={project.image || noImage}
                  onError={(e) => ((e.currentTarget.src = noImage))}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                  <p className="text-xs text-gray-400 mt-2">by {project.creator}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{project.progress}% 달성</span>
                    <span className="text-gray-500">{formatCurrency(project.raised)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(project.progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.backers.toLocaleString()}명</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{project.daysLeft}일 남음</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full h-10 rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-medium hover:opacity-90 transition-opacity">
                  프로젝트 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center justify-center rounded-md border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50">
            더 많은 프로젝트 보기
          </button>
        </div>
      </div>
    </section>
  );
};

export default BloomProjectGallery;

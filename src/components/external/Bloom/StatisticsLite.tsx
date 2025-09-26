import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
  prefix?: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="will-change-transform">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

const BloomStatistics: React.FC = () => {
  const stats = [
    {
      icon: Target,
      value: 50000,
      suffix: '+',
      label: '성공한 프로젝트',
      description: '혁신적인 아이디어들이 현실이 되었습니다',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      value: 2800000,
      suffix: '+',
      label: '총 후원자 수',
      description: '전 세계에서 함께하는 창작자들',
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      value: 1250,
      suffix: '억원',
      label: '총 펀딩 금액',
      description: '꿈을 현실로 만든 투자 금액',
      color: 'text-purple-500',
    },
    {
      icon: Award,
      value: 95,
      suffix: '%',
      label: '목표 달성률',
      description: '검증된 성공 확률',
      color: 'text-orange-500',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-transparent" data-aos="fade-up">
      <div className="mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">성공의 숫자</span>로 말하다
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            믿을 수 있는 플랫폼에서 만들어진 놀라운 성과들을 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon as any;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
                  <Counter end={stat.value} duration={2000} suffix={stat.suffix} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{stat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{stat.description}</p>
                <div className="mt-6 h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            'Forbes 선정 혁신 플랫폼',
            '벤처투자협회 인증',
            '국내 1위 펀딩 플랫폼',
            'ISO 27001 보안 인증',
          ].map((badge, i) => (
            <div
              key={i}
              className="px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium text-blue-700 border border-blue-200"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BloomStatistics;

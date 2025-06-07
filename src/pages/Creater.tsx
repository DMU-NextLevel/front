import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Rocket, Plus, Target, Users } from 'lucide-react';
import CreaterVideo from '../assets/images/CreaterVideo.mp4';
import FundingHero from '../components/UI/CreaterPage/FundingHero';
import PricingPage from '../components/UI/CreaterPage/PricingPage';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
`;


const CreateButton = styled.button`
  background: #2563eb;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;


const HeroSection = styled.section`
  padding: 5rem 1rem;
  text-align: center;
  height: 520px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  `;

const HeroTitle = styled.h2`
  font-size: 4.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0;
  z-index: 1;
  position: relative;
`;

const HeroDescription = styled.p`
  position: relative;
  font-size: 1.25rem;
  color: #fff;
  z-index: 1;
  margin-bottom: 1.5rem;
`;
const HeroVideo = styled.video`
	width: 100%;
	height: 100%;
	object-fit: cover;
	pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  position: relative;
  a {
    text-decoration: none;
  }
`;

const PrimaryButton = styled.button`
  background:#A66CFF;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background:rgb(137, 84, 218);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
  }
`;

const CreaterNav = styled.nav`
  padding: 15px 15%;
  display: flex;
  background:rgb(243, 243, 244);
  align-items: center;
  gap: 1rem;
`;
const CreaterNavItem = styled.nav`
  padding: 15px 30px;
  background:rgb(239, 239, 239);
  border-radius: 10px;
  cursor: pointer;
  transition : all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #06b6d4; 
  }
`;

const CardSection = styled.section`
  padding: 4rem 15%;
  background: white;

  @media (max-width: 1500px) {
    padding: 4rem 10%;
  }
  @media (max-width: 1200px) {
    padding: 4rem 5%;
  }
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 3rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem 1.5rem;
  text-align: center;
`;

const CardIcon = styled.div`
  margin-bottom: 1rem;
  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const CardTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
`;

const Index: React.FC = () => {
  const handleScroll = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <Container>
      

      <HeroSection >
        <HeroVideo src={CreaterVideo} autoPlay  muted playsInline loop />
        <div>
          <HeroTitle>당신의 꿈을 현실로</HeroTitle>
          <HeroDescription>
            혁신적인 아이디어를 가지고 계신가요? 우리 플랫폼에서 후원자들과 함께 프로젝트를 성공시켜보세요.
          </HeroDescription>
        </div>
        <div style={{flex: 1}}></div>
        <ButtonGroup>
          <a href="/project/create">
            <PrimaryButton>
              <Rocket />프로젝트 시작하기
            </PrimaryButton>
          </a>
        </ButtonGroup>
      </HeroSection>
      
      <CreaterNav>
        <a onClick={() => handleScroll('section-title')}><CreaterNavItem> 위드유 소개</CreaterNavItem></a>
        <a onClick={() => handleScroll('funding-hero')}><CreaterNavItem>자격 요건</CreaterNavItem></a>
        <a onClick={() => handleScroll('pricing')}><CreaterNavItem>가격</CreaterNavItem></a>
      </CreaterNav>
      <CardSection id="section-title">
        <SectionTitle>왜 위드유 플랫폼을 선택해야 할까요?</SectionTitle>
        <CardGrid>
          <FeatureCard>
            <CardIcon><Target color="#2563eb" /></CardIcon>
            <CardTitle>명확한 목표 설정</CardTitle>
            <CardDescription>
              체계적인 단계별 가이드로 프로젝트 목표를 명확히 설정하고 성공 확률을 높여보세요.
            </CardDescription>
          </FeatureCard>

          <FeatureCard>
            <CardIcon><Users color="#16a34a" /></CardIcon>
            <CardTitle>활발한 커뮤니티</CardTitle>
            <CardDescription>
              다양한 분야의 창작자들과 후원자들이 모인 활발한 커뮤니티에서 네트워킹하세요.
            </CardDescription>
          </FeatureCard>

          <FeatureCard>
            <CardIcon><Rocket color="#7c3aed" /></CardIcon>
            <CardTitle>전문적인 지원</CardTitle>
            <CardDescription>
              프로젝트 기획부터 마케팅까지, 전 과정에 걸쳐 전문적인 지원을 받을 수 있습니다.
            </CardDescription>
          </FeatureCard>
        </CardGrid>
      </CardSection>
      <main>
        <section id="funding-hero">
          <FundingHero />
        </section>
        <section id="pricing">
          <PricingPage />
        </section>
      </main>
    </Container>
  );
};

export default Index;

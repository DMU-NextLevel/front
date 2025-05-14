import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RecommendedProject = () => {
  const projects = [
    {
      id: 1,
      title: 'HoverAir X1: 셀프 비행 카메라',
      percent: 40,
      image: 'https://i.ebayimg.com/images/g/T9UAAOSweV9lXHQs/s-l400.jpg'
    },
    {
      id: 2,
      title: 'Drumi: 발로 작동하는 세탁기',
      percent: 20,
      image: 'https://img1.daumcdn.net/thumb/R800x0/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F255A414858B3CB532C&scode=mtistory2'
    },
    {
      id: 3,
      title: 'Nomad 에너지 드링크',
      percent: 100,
      image: 'https://www.yankodesign.com/images/design_news/2025/04/draft-coffeejack/coffeejack_v2_3.jpg'
    },
    {
      id: 4,
      title: 'COFFEEJACK V2: 휴대용 에스프레소 머신',
      percent: 55,
      image: 'https://cdn.homecrux.com/wp-content/uploads/2025/04/COFFEEJACK-V2-Portable-Espresso-machine-2.jpg'
    },
    {
      id: 5,
      title: 'Pebble Time: 스마트워치',
      percent: 75,
      image: 'https://i.kickstarter.com/assets/012/032/069/46817a8c099133d5bf8b64aad282a696_original.png?anim=false&fit=cover&gravity=auto&height=576&origin=ugc&q=92&sig=rOTB6R5uOmKTlUpnqYLqKALPN0hricwUTf950LCIVrI%3D&v=1463725702&width=1024'
    },
    {
      id: 6,
      title: 'Glyph: 몰입형 헤드셋',
      percent: 90,
      image: 'https://kr.aving.net/news/photo/201702/1375955_549261_1410.jpg'
    }
  ];

  const ArrowRightCircleIcon: React.FC<{ size?: number; color?: string }> = ({
      size = 24,
      color = 'currentColor',
    }) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" style={{ verticalAlign: 'middle' }} className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
    </svg>
  );

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/funding')
  }
  
  return (
    <Container>
      <Title>취향 맞춤 프로젝트</Title>
      <TextLine>
        <Text>당신을 위한 추천 프로젝트</Text>
        <LinkBlock>
          <LinkToRecommand href="/">추천 프로젝트 보러가기 <ArrowRightCircleIcon size={15} color="#" /></LinkToRecommand>
        </LinkBlock>
      </TextLine>
      <CardList>
        {projects.map((project) => (
          <ImageTextItem onClick={handleClick} key={project.id}>
            <ImageWrapper>
              {project.image ? (
                <StyledImage src={project.image} alt={project.title} />
              ) : (
                <NoImage>이미지 없음</NoImage>
              )}
            </ImageWrapper>
            <TextSection>
              <Percent>{project.percent}% 달성</Percent>
              <ProjectTitle>{project.title}</ProjectTitle>
            </TextSection>
          </ImageTextItem>
        ))}
      </CardList>
      
    </Container>
  );
};

export default RecommendedProject;

// ✅ styled-components 정리

const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  padding: 0px 0px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const TextLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 16px;
  color: #888;
  margin: 0;
  padding: 0 0px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 */
  gap: 40px;
`;

const ImageTextItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f0f0f0;
  display: grid;
  place-items: center;
  border-radius: 10px;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    filter: brightness(1.05);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const NoImage = styled.div`
  color: #888;
  font-size: 16px;
`;

const TextSection = styled.div`
  margin-top: 12px;
  padding: 0 4px;
`;

const Percent = styled.div`
  color: #A66CFF;
  font-weight: bold;
  font-size: 15px;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-top: 4px;
`;

const LinkBlock = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
`;


const LinkToRecommand = styled.a`
  font-size: 14px;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.6em 0.6em;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  background-image: linear-gradient(45deg,rgb(89, 50, 147) 50%, transparent 50%);
  background-position: 100%;
  background-size: 400%;
  transition: background-position 300ms ease-in-out, color 300ms ease-in-out;
  border-radius: 50px;

  &:hover {
    background-position: 0;
    color: #fff;
    text-decoration: none;
  }
`;
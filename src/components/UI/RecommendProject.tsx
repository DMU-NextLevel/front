import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchProjectsFromServer } from './fetchProjectsFromServer';
import noImage from '../../assets/images/noImage.jpg';
const RecommendedProject = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL

  const ArrowRightCircleIcon: React.FC<{ size?: number; color?: string }> = ({
      size = 24,
      color = 'currentColor',
    }) => (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" style={{ verticalAlign: 'middle' }} className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
    </svg>
  );

  const navigate = useNavigate()

  const [projects, setProjects] = useState<any[]>([]);
      useEffect(() => {
        const loadProjects = async () => {
          const data = await fetchProjectsFromServer({ order: "COMPLETION", pageCount: 6 });
          console.log("📦 서버에서 받아온 프로젝트:", data);
          if (Array.isArray(data)) {
            setProjects(data);
          }
        };
        loadProjects();
      }, []);

  return (
    <Container>
      <Title>취향 맞춤 프로젝트</Title>
      <TextLine>
        <Text>당신을 위한 추천 프로젝트</Text>
        <LinkBlock>
          <LinkToRecommand href="/search?order=RECOMMEND">추천 프로젝트 보러가기 <ArrowRightCircleIcon size={15} color="#" /></LinkToRecommand>
        </LinkBlock>
      </TextLine>
      <CardList>
        {projects.map((project) => (
          <ImageTextItem key={project.id} onClick={() => navigate(`/project/${project.id}`)}>
            <ImageWrapper>
              {project.titleImg ? (
                <StyledImage src={project.titleImg ? `${baseUrl}/img/${project.titleImg}` : noImage}
                alt={project.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = noImage;
                }} />
              ) : (
                <NoImage>이미지 없음</NoImage>
              )}
            </ImageWrapper>
            <TextSection>
              <Percent>{project.completionRate}% 달성</Percent>
              <ProjectTitle>{project.title}</ProjectTitle>
            </TextSection>
          </ImageTextItem>
        ))}
      </CardList>

    </Container>
  );
};

export default RecommendedProject;

const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  padding: 40px 0px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  margin: 0;
`;

const TextLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
  padding: 0 0px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3열 */
  gap: 20px;
`;

const ImageTextItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  cursor: pointer;
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
  border-radius: 10px;
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
  font-size: 16px;
`;

const ProjectTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-top: 4px;
  min-height: 40px;
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
  transition: all 0.1s;
  &:hover {
    text-decoration: none;
    cursor: pointer;
    color: #A66CFF;
    font-size: 14px;
  }
`;





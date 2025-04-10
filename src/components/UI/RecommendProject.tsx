import React from 'react';
import styled from 'styled-components';

const RecommendedProject = () => {
  const projects = [
    { id: 1, title: '프로젝트 1', percent: 40, image: '' },
    { id: 2, title: '프로젝트 2', percent: 20, image: '' },
    { id: 3, title: '프로젝트 3', percent: 100, image: '' },
  
  ];

  return (
    <Container>
      <Title>맞춤 추천 TOP3</Title>
      <CardList>
        {projects.map((project) => (
          <ImageTextItem key={project.id}>
            <ImageWrapper>
              {!project.image && <NoImage>이미지 없음</NoImage>}
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
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 25px;
  margin-bottom: 20px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 22%); /* 3열 */
  gap: 40px;
`;

const ImageTextItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;
  display: grid;
  place-items: center;
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

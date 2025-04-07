import React from 'react';
import styled from 'styled-components';

const RecommendedProject = () => {
  const projects = [
    {
      id: 1,
      title: '프로젝트 1',
      description: '"설명 1"',
      percent: 40,
      image: '', // 이미지 제거
    },
    {
      id: 2,
      title: '프로젝트 2',
      description: '"설명 2"',
      percent: 20,
      image: '', // 이미지 제거
    },
    {
      id: 3,
      title: '프로젝트 3',
      description: '"설명 3"',
      percent: 100,
      image: '', // 이미지 제거
       
    },
    {
      id: 4,
      title: '프로젝트 4',
      description: '"설명 4"',
      percent: 60,
      image: '', // 이미지 제거
     
    },
    {
      id: 5,
      title: '프로젝트 5',
      description: '"설명 5"',
      percent: 30,
      image: '', // 이미지 제거
      
    },
    {
      id: 6,
      title: '프로젝트 6',
      description: '"설명 6"',
      percent: 40,
      image: '', // 이미지 제거
      
    },
  ];

  return (
    <Container>
      <Title>맞춤 프로젝트 추천</Title>
      <CardList>
        {projects.map((project) => (
          <Card key={project.id}>
            {/* 이미지가 없으면 네모박스 */}
            <ImageWrapper>
              {!project.image && <NoImage>이미지 없음</NoImage>}
            </ImageWrapper>
            <Percent>{project.percent}% 달성</Percent>
            <ProjectTitle>{project.title}</ProjectTitle>
          </Card>
        ))}
      </CardList>
    </Container>
  );
};

export default RecommendedProject;

// 스타일드 컴포넌트
const Container = styled.div`
  width: 1200px; 
  margin: 0 auto; 
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 25px;
  margin-bottom: 20px;
`;

const CardList = styled.div`
  display: grid; 
  grid-template-columns: repeat(3, 395px); 
  gap : 120px;
  width: 100%; 
`;

const Card = styled.div`
  border: 1px solid #ddd;
  height: 310px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px; /* 네모박스 크기 설정 */
  background-color: #f0f0f0; /* 네모박스 배경색 */
  display: grid;
  justify-content: center;
  align-items: center;
`;

const NoImage = styled.div`
  color: #888;
  font-size: 18px;
`;

const Percent = styled.div`
  color: #A66CFF;
  font-weight: bold;
  margin-top: 12px;
`;

const ProjectTitle = styled.div`
  font-weight: 600;
  font-size : 20px;
  margin-top: 8px;
`;






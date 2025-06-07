import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchProjectsFromServer } from './fetchProjectsFromServer';



const RankingList:React.FC = () => {

  const navigate = useNavigate()
  const [projects, setProjects] = useState<any[]>([]);
        useEffect(() => {
          const loadProjects = async () => {
            const data = await fetchProjectsFromServer({ order: "RECOMMEND", pageCount: 6 });
            console.log("📦 서버에서 받아온 프로젝트:", data);
            if (Array.isArray(data)) {
              setProjects(data);
            }
          };
          loadProjects();
        }, []);

  return (
    <Wrapper>
      <Title>실시간 랭킹</Title>
      
      <List>
        {projects.map((item, index) => (
          <ImageTextItem onClick={() => navigate(`/project/${item.id}`)} key={item.id}>
            <RankNumber>{index + 1}</RankNumber>
            <Info>
              <ProjectTitle>{item.title}</ProjectTitle>
              <Percent>{item.percent}% 달성</Percent>
            </Info>
            <ImageWrapper>
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <NoImage>이미지 없음</NoImage>
              )}
            </ImageWrapper>
          </ImageTextItem>
          
          
        ))}
      </List>
      <div style={{ textAlign: 'right', marginBottom: '10px', margin: '0' }}>
        
      </div>
    </Wrapper>
  );
};



// 전체 컨테이너
const Wrapper = styled.div` 
  width: 30%;
  background: #fff;
  padding: 40px 0px 0px 40px;
  border-left: 1px solid rgb(246, 246, 246);
  margin-left : 40px;
`;

// 랭킹 박스
const ImageTextItem = styled.div`
  display: flex;
  align-items: flex-start;  
  margin-bottom: 12px;
  justify-content: space-between;
  margin-bottom: 12px;
  cursor: pointer;
  `;

// 랭킹 숫자
const RankNumber = styled.div`
  font-weight: bold;
  font-size: 22px;
  width: 20px;
  color: #333;
  margin-top: 6px;
  margin-right: 10px;
`;


// 제목
const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 20px 0;
  
`;

// 리스트 전체
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
`;

// 개별 아이템
const Item = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

// 이미지 감싸는 박스
const ImageWrapper = styled.div`
  width: 100px;
  height: 70px;
  background-color: #f0f0f0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  margin-right: 12px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 3px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }
  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
    filter: brightness(1.05);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;


const NoImage = styled.div`
  text-align: center;
`;

// 텍스트 영역
const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  margin-right: 10px;
`;

// 달성률
const Percent = styled.span`
  color: #7b61ff;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

// 제목
const ProjectTitle = styled.span`
  font-size: 14px;
  line-height: 1.3;
  
`;

export default RankingList;

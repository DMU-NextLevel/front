import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import noImage from '../../assets/images/noImage.jpg';
const projects = [
    {
        "id": 14,
        "title": "[골프]양피와 합피의 장점을 갖춘! 신소재로 제작 큐티프렌즈 골프장갑!",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "테크 가전",
            "패션 잡화"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:16.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    },
    {
        "id": 12,
        "title": "[골프]양피와 합피의 장점을 갖춘! 신소재로 제작 큐티프렌즈 골프장갑!",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "테크 가전",
            "라이프 스타일"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:13.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    },
    {
        "id": 13,
        "title": "[골프]양피와 합피의 장점을 갖춘! 신소재로 제작 큐티프렌즈 골프장갑!",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "테크 가전",
            "라이프 스타일"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:13.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    },
    {
        "id": 11,
        "title": "[퍼팅연습기] 놓칠 수 없는 레이저 퍼팅으로 쓰리펏은 이제 그만 퍼티스트 II",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "테크 가전",
            "라이프 스타일"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:04.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    },
    {
        "id": 10,
        "title": "[퍼팅연습기] 놓칠 수 없는 레이저 퍼팅으로 쓰리펏은 이제 그만 퍼티스트 II",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "테크 가전",
            "라이프 스타일"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:03.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    },
    {
        "id": 9,
        "title": "[퍼팅연습기] 놓칠 수 없는 레이저 퍼팅으로 쓰리펏은 이제 그만 퍼티스트 II",
        "titleImg": "d8eda9d53210b78cnull.jpg",
        "completionRate": 0.0,
        "likeCount": 0,
        "tags": [
            "라이프 스타일",
            "패션 잡화"
        ],
        "pageCount": null,
        "totalCount": 14,
        "userCount": 0,
        "viewCount": 0,
        "createdAt": "2025-06-04T06:16:00.000+00:00",
        "isLiked": false,
        "expired": "2025-07-02T15:00:00.000+00:00",
        "isExpired": false
    }
  ];


const NewProject: React.FC = () => {
const navigate = useNavigate()

    const handleClick = (project:any) => {
    const query = new URLSearchParams({
        title: project.title,
        percent: project.completionRate.toString(),
        image: project.titleImg
    }).toString()
    navigate(`/funding/${project.id}?${query}`)
    console.log(project)
    }
    
  return (
    <Container>
        <Title>신규 프로젝트</Title>

        <CardList>
        {projects.slice(0, 4).map((item, index) => {
          const isLast = index === projects.length - 1;
          return (
            <Card key={item.id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <CardTopWrapper>
                    <StyledImage 
                      src={item.titleImg ? `https://api.nextlevel.r-e.kr/img/${item.titleImg}` : noImage}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = noImage;
                      }}
                    />
                  </CardTopWrapper>
                  {/* id:{item.id}|
                  page:{item.pageCount} */}
                  <CardContent>
                    <InfoRow>{item.completionRate}% 달성</InfoRow>
                    <TitleRow>{item.title}</TitleRow>
                    <CreaterRow>회사이름</CreaterRow>
                    {/* <InfoRow>추천 수: {item.recommendCount}</InfoRow> */}
                    <TagLow>
                    {item.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                    </TagLow>
                    
                  </CardContent>
                  </div> 
              </div>
            </Card>
          );
        })}
      </CardList>
        {/* <CardList>
        {projects.slice(0, 4).map((project) => (
          <ImageTextItem onClick={() => {handleClick(project)}} key={project.id}>
            <ImageWrapper>
              {project.titleImg ? (
                <StyledImage src={`https://api.nextlevel.r-e.kr/img/${project.titleImg}`} alt={project.title} />
              ) : (
                <StyledImage src={noImage} alt={project.title} />
              )}
            </ImageWrapper>
            <TextSection>
              <Percent>{project.completionRate}% 달성</Percent>
              <ProjectTitle>{project.title}</ProjectTitle>
            </TextSection>
          </ImageTextItem>
        ))}
      </CardList> */}

      
    </Container>
  );
};

export default NewProject;


const Container = styled.div`
  margin-top: 20px;

`;

const Title = styled.h2`
  font-size: 24px;
  margin : 0;
  margin-bottom: 20px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 3열 */
  gap: 20px;
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
  border-radius: 10px;
  object-fit: cover;
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

const InfoRow = styled.div`
  color: #A66CFF;
  font-weight: bold;
  font-size: 16px;
`;

const TitleRow = styled.div`
  font-weight: 500;
  font-size: 14px;
  margin-top: 4px;
  min-height: 40px;
`;

const CreaterRow = styled.div`
  font-size: 12px;
  color: #999;
  margin: 4px 0 0 0;
  cursor: pointer;
  hover {
    color: #A66CFF;
    font-weight: bold;
    transition: all 0.2s ease;
  }
`;  

const TagLow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #f2f2f2;
  padding: 4px 6px;
  font-size: 10px;
  border-radius: 6px;
  color: #555;
  &:hover {
    background: #A66CFF;
    color: white;
    font-weight: bold;
    transition: all 0.2s ease;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
`;
  

const CardTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeartIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

const Tooltip = styled.div<{ percent: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  z-index: 1;
`;


const CardContent = styled.div`
  padding: 8px;
`; 

const Thumbnail = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
`;
  
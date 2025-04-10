import React from 'react';
import styled from 'styled-components';

// 더미 데이터
const projects = [
  { id: 1, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 100, image: '' },
  { id: 2, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 50, image: '' },
  { id: 3, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 100, image: '' },
  { id: 4, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 70, image: '' },
  { id: 5, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 40, image: '' },
  { id: 6, title: '테스트용 펀딩품목입니다. 자유롭게 사용하세요.', percent: 80, image: '' },
];

// 전체 컨테이너
const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 70px;
  width: 300px;
  background: #fff;
  padding: 10px;
`;

// 랭킹 박스
const ImageTextItem = styled.div`
  display: flex;
  align-items: flex-start;  // 👈 숫자와 이미지 모두 위쪽 정렬
  gap: 12px;                // 숫자와 이미지 사이 간격
  margin-bottom: 12px
  `;

// 랭킹 숫자
const RankNumber = styled.div`
  font-weight: bold;        // 👈 "굵은 숫자" 적용
  font-size: 22px;
  width: 30px;
  text-align: center;
  color: #333;
  align-self: center;   
  margin-top: 6px;          // (선택) 미세한 위치 조정
`;


// 제목
const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

// 리스트 전체
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
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
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  margin-right: 12px;
  flex-shrink: 0;
`;

const NoImage = styled.div`
  text-align: center;
`;

// 텍스트 영역
const Info = styled.div`
  display: flex;
  flex-direction: column;
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

const RankingList = () => {
  return (
    <Wrapper>
      <Title>실시간 랭킹</Title>
      <List>
        {projects.map((item, index) => (
          <ImageTextItem key={item.id}>
            <RankNumber>{index + 1}</RankNumber> {/* 숫자 컴포넌트 추가 */}
            <ImageWrapper>
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <NoImage>이미지 없음</NoImage>
              )}
            </ImageWrapper>
            <Info>
              <ProjectTitle>{item.title}</ProjectTitle>
              <Percent>{item.percent}% 달성</Percent>
            </Info>
          </ImageTextItem>
        ))}
      </List>
    </Wrapper>
  );
};


export default RankingList;

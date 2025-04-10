  import React, { useEffect, useRef, useState } from "react";
  import styled, { keyframes } from "styled-components";

  const RealTimeFeed: React.FC = () => {
    const [feeds, setFeeds] = useState<string[]>([
      "🔥 사용자 A님이 프로젝트 B에 후원!",
      "🔥새로운 프로젝트 'X' 등록 완료!",
      "⏰ 프로젝트 1 마감까지 10분 남음!",
      "⭐ 프로젝트 5의 첫번째 후원자가 등장했어요!",
      "📈 프로젝트 Y 목표치 120% 달성!",
    ]);

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
      // 추후 fetch로 실시간 데이터 받아오는 부분으로 확장 가능
    }, []);

    return (
      <Container>
        <Title>실시간 피드 🔄</Title>
        <FeedListWrapper>
          <FeedList ref={listRef}>
            {feeds.map((feed, index) => (
              <FeedItem key={index}>{feed}</FeedItem>
            ))}
          </FeedList>
        </FeedListWrapper>
      </Container>
    );
  };

  export default RealTimeFeed;


  const Container = styled.div`
    width: 70%;
    background-color: #fdfdfd;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 5%;
    margin-left: 15.5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  `;

  const Title = styled.h3`
    font-size: 18px;
    margin-bottom: 12px;
    color: #333;
  `;

  const scrollUp = keyframes`
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  `;

  const FeedListWrapper = styled.div`
    height: 100px;
    overflow: hidden;
    position: relative;
    

    &:hover ul {
      animation-play-state: paused;
    }
  `;

  const FeedList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    animation: ${scrollUp} 12s linear infinite;
  `;

  const FeedItem = styled.li`
    padding: 8px 0;
    font-size: 14px;
    color: #555;
  `;

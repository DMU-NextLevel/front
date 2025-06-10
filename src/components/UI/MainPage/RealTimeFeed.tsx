import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// 아이콘 컴포넌트
const FeedIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "donation":
      return <IconSpan color="#FF5722">🔥</IconSpan>;
    case "new":
      return <IconSpan color="#4CAF50">✨</IconSpan>;
    case "deadline":
      return <IconSpan color="#FF9800">⏰</IconSpan>;
    case "milestone":
      return <IconSpan color="#9C27B0">🎉</IconSpan>;
    case "achievement":
      return <IconSpan color="#2196F3">📈</IconSpan>;
    case "popular":
      return <IconSpan color="#E91E63">❤️</IconSpan>;
    case "update":
      return <IconSpan color="#607D8B">📝</IconSpan>;
    default:
      return <IconSpan color="#795548">📌</IconSpan>;
  }
};

// 피드 아이템 타입 정의
interface FeedItem {
  id: number;
  type: string;
  message: string;
  timestamp: Date;
}

const RealTimeFeed: React.FC = () => {
  const [feeds, setFeeds] = useState<FeedItem[]>([
    { id: 1, type: "donation", message: "사용자 민준님이 프로젝트 '꿈꾸는 바다'에 50,000원 후원!", timestamp: new Date() },
    { id: 2, type: "new", message: "새로운 프로젝트 '도시 정원 가꾸기' 등록 완료!", timestamp: new Date() },
    { id: 3, type: "deadline", message: "프로젝트 '움직이는 그림책' 마감까지 3시간 남음!", timestamp: new Date() },
    { id: 4, type: "milestone", message: "프로젝트 '친환경 텀블러'의 첫번째 후원자가 등장했어요!", timestamp: new Date() },
    { id: 5, type: "achievement", message: "프로젝트 '제주 바다 지키기' 목표치 120% 달성!", timestamp: new Date() },
    { id: 6, type: "popular", message: "지금 인기 급상승! '영화 제작 프로젝트'를 확인해보세요", timestamp: new Date() },
    { id: 7, type: "update", message: "프로젝트 '친환경 패키지'가 새 소식을 업데이트했어요", timestamp: new Date() },
    { id: 8, type: "donation", message: "사용자 지수님이 프로젝트 '음악 교실'에 30,000원 후원!", timestamp: new Date() },
    { id: 9, type: "milestone", message: "프로젝트 '동물 보호소'가 100번째 후원자를 맞이했어요!", timestamp: new Date() },
    { id: 10, type: "new", message: "주목할 만한 신규 프로젝트 '미래 기술 전시회' 오픈!", timestamp: new Date() },
    { id: 11, type: "popular", message: "오늘의 HOT 프로젝트: '전통 공예 살리기'", timestamp: new Date() },
    { id: 12, type: "achievement", message: "프로젝트 '어린이 도서관'이 목표 금액 달성까지 98% 진행 중!", timestamp: new Date() },
  ]);

  const listRef = useRef<HTMLUListElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // 시간 경과에 따라 새 피드 추가하는 시뮬레이션 (실제 서비스에서는 WebSocket 등으로 대체)
    const interval = setInterval(() => {
      if (!isPaused) {
        const newTypes = ["donation", "new", "deadline", "milestone", "achievement", "popular", "update"];
        const newMessages = [
          "사용자 서연님이 프로젝트 '유기견 보호소'에 후원했어요!",
          "프로젝트 '독립 영화제'가 마감 임박! 지금 확인하세요",
          "축하합니다! '청년 창업 지원' 프로젝트가 목표 달성!",
          "새로운 프로젝트 '가상현실 체험관'이 론칭했어요",
          "프로젝트 '도시 숲 만들기'에 100번째 후원자 등장!",
          "지금 주목받는 프로젝트 '전통 음식 보존하기'",
          "사용자 현우님이 프로젝트 '환경 다큐멘터리'에 후원!"
        ];
        
        const randomType = newTypes[Math.floor(Math.random() * newTypes.length)];
        const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)];
        
        setFeeds(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            type: randomType, 
            message: randomMessage, 
            timestamp: new Date() 
          }
        ]);
      }
    }, 5000); // 5초마다 새 피드 추가
    
    return () => clearInterval(interval);
  }, [isPaused]);

  // 현재 시간 기준 상대적 시간 표시 함수
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <Container>
      <TitleWrapper>
        <Title>실시간 피드</Title>
        <RefreshIcon>🔄</RefreshIcon>
      </TitleWrapper>
      <FeedListWrapper 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <FeedList ref={listRef} $isPaused={isPaused}>
          {feeds.map((feed) => (
            <FeedItemContainer key={feed.id}>
              <FeedIcon type={feed.type} />
              <FeedContent>
                <FeedText>{feed.message}</FeedText>
                <FeedTime>{getRelativeTime(feed.timestamp)}</FeedTime>
              </FeedContent>
            </FeedItemContainer>
          ))}
        </FeedList>
      </FeedListWrapper>
      <BottomGradient />
    </Container>
  );
};

export default RealTimeFeed;

const Container = styled.div`
  background-color: #ffffff;
  border: 1px solid #e8eaf6;
  border-radius: 16px;
  padding: 20px;
  margin : 30px 0;
  box-shadow: 0 6px 16px rgba(0, 10, 50, 0.08);
  position: relative;
  overflow: hidden;
  height: 100px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #263238;
  margin: 0;
`;

const RefreshIcon = styled.span`
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    transform: rotate(180deg);
  }
`;

const scrollUp = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-100% + 180px));
  }
`;

const FeedListWrapper = styled.div`
  height: 180px;
  overflow: hidden;
  position: relative;
`;

const FeedList = styled.ul<{ $isPaused: boolean }>`
  list-style: none;
  margin: 0;
  padding: 0;
  animation: ${scrollUp} 20s linear infinite;
  animation-play-state: ${props => props.$isPaused ? 'paused' : 'running'};
`;

const FeedItemContainer = styled.li`
  padding: 12px 8px;
  display: flex;
  align-items: flex-start;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin-bottom: 4px;
  
  &:hover {
    background-color: #f5f7fa;
    transform: translateX(4px);
  }
`;

const IconSpan = styled.span<{ color: string }>`
  font-size: 18px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: ${props => `${props.color}15`};
  border-radius: 50%;
  flex-shrink: 0;
`;

const FeedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FeedText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #37474f;
  line-height: 1.4;
`;

const FeedTime = styled.span`
  font-size: 12px;
  color: #90a4ae;
  margin-top: 2px;
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  pointer-events: none;
`;
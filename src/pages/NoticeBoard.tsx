import React, { useState, KeyboardEvent } from 'react';
import styled from 'styled-components';

type Notice = {
  title: string;
  date: string;
  image?: string;
};

const notices: Notice[] = [
  { title: "[약관/개인] 개인정보처리방침 개정 안내 [와디즈]", date: "2025.05.27" },
  { title: "[와디즈 페이퍼스] 투자서비스 금융정보 안내", date: "2025.05.22" },
  {
    title: "‘헬스 사피, 웨이브 프로틴’… 와디즈 ‘성실 인센티브펀딩’ 1시간 만에 1.2억원 몰려",
    date: "2025.05.19",
    image: "https://placehold.co/80x80?text=헬스+사피"
  },
  {
    title: "와디즈, 와이즈 취미 기술 박람회서 ‘글로벌 교육투자팀 전략’ 제시",
    date: "2025.05.17",
    image: "https://placehold.co/80x80?text=교육투자팀"
  },
  {
    title: "와디즈, 여신자 최다 ‘취향 발견’ 큐레이션 마이- 관련 결제액 3배 이상 증가",
    date: "2025.05.16",
    image: "https://placehold.co/80x80?text=취향+발견"
  },
  {
    title: "[지원사업] 한국 벤처 기획자 후속 메이커 모집 (~6/21)까지 상시 모집 및 선정",
    date: "2025.05.15",
    image: "https://placehold.co/80x80?text=벤처+모집"
  },
  {
    title: "AI 노트클래스 콘텐츠 오픈 완료… 와디즈, ‘학익형’ 트렌드 확산",
    date: "2025.05.15",
    image: "https://placehold.co/80x80?text=AI+노트"
  },
  {
    title: "[기획전] 와디즈 퍼스트테크 입점팀 참여 메이커 모집 (~7/8)",
    date: "2025.05.14",
    image: "https://placehold.co/80x80?text=퍼스트테크"
  },
  {
    title: "“불황에도 통했다”… ‘프리미엄’ 제품 와디즈서 언어이 훨풍",
    date: "2025.05.14",
    image: "https://placehold.co/80x80?text=프리미엄"
  },
  {
    title: "[기획전] 스포츠·아웃도어 생활 참여 메이커 모집 (~6/10)",
    date: "2025.05.09",
    image: "https://placehold.co/80x80?text=아웃도어"
  },
];

const Container = styled.div`

  margin: 0 auto;
  padding: 40px 15%;
  font-family: 'sans-serif';
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const SearchContainer = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 20%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #000;
  }
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 0;
  border-bottom: 1px solid #e5e7eb;
`;

const NoticeText = styled.div`
  flex: 1;
`;

const NoticeTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;  

const NoticeDate = styled.p`
  font-size: 13px;
  color: #6b7280;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-left: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  gap: 8px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  font-size: 14px;
  background: ${({ active }) => (active ? '#000' : '#f3f4f6')};
  color: ${({ active }) => (active ? '#fff' : '#1f2937')};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #111827;
    color: #fff;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
  font-size: 16px;
`;

const PAGE_SIZE = 5;

const NoticeBoard: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Container>
      <Title>공지사항</Title>

      

      {filteredNotices.length === 0 ? (
        <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
      ) : (
        <>
          <NoticeList>
            {currentNotices.map((notice, index) => (
              <NoticeItem key={index}>
                <NoticeText>
                  <NoticeTitle>{notice.title}</NoticeTitle>
                  <NoticeDate>{notice.date}</NoticeDate>
                </NoticeText>
                {notice.image && (
                  <Thumbnail src={notice.image} alt={`공지사항 썸네일 - ${notice.title}`} />
                )}
              </NoticeItem>
            ))}
          </NoticeList>

          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, i) => (
                <PageButton
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
            </Pagination>
          )}
        </>
      )}
      <br/>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="제목 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch}>검색</Button>
        <Button onClick={handleReset}>초기화</Button>
      </SearchContainer>
    </Container>
  );
};

export default NoticeBoard;

import React, { useState, useEffect, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { api } from '../AxiosInstance';
import { useUserRole } from '../hooks/useUserRole';
import noImage from '../assets/images/noImage.jpg';

type Notice = {
  id: number;
  title: string;
  createdAt: string;
  imgs: string[];
};

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
  padding: 20px 0;
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
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const { isLoggedIn } = useAuth();
  const { role, loading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/public/notice')
      .then(res => {
        if (res.data.message === 'success') {
          setNoticeList(res.data.data);
        }
      })
      .catch(err => {
        console.error('공지 불러오기 실패:', err);
      });
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreate = () => {
    navigate('/notice/write');
  };

  const handleNoticeClick = (notice: Notice) => {
    navigate(`/notice/${notice.id}`, { state: notice });
  };

  const filteredNotices = noticeList.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + PAGE_SIZE);

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <Title>공지사항</Title>

      {filteredNotices.length === 0 ? (
        <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
      ) : (
        <>
          <NoticeList>
            {currentNotices.map((notice) => (
              <NoticeItem key={notice.id} onClick={() => handleNoticeClick(notice)} style={{ cursor: 'pointer' }}>
                <NoticeText>
                  <NoticeTitle>{notice.title}</NoticeTitle>
                  <NoticeDate>{formatDate(notice.createdAt)}</NoticeDate>
                </NoticeText>
                {notice.imgs?.length > 0 && (
                  <Thumbnail
                    src={`${baseUrl}/img/${notice.imgs[0]}`}
                    alt={`공지 썸네일 - ${notice.title}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = noImage;
                    }}
                  />
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

      {!loading && role === 'ADMIN' && (
        <Button onClick={handleCreate}>공지사항 작성</Button>
      )}

      <br />
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

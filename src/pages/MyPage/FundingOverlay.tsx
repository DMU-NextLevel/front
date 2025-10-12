import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import axios from 'axios';

interface FundingItem {
  id: number;
  title: string;
  image: string;
  category: string;
  status: string;
  author: string;
  completionRate: number;
  totalPrice: number;
  optionFunding: {
    optionDesc: string;
    optionPrice: number;
    count: number;
    total: number;
  }[];
  freeFunding?: number;
  createdAt: string;
}

interface FundingOverlayProps {
  onClose: () => void;
}

const FundingOverlay: React.FC<FundingOverlayProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'전체' | '진행중' | '완료' | '취소'>('전체');
  const [fundingList, setFundingList] = useState<FundingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);

  // ✅ API 연동
  useEffect(() => {
    const fetchFundingList = async () => {
      try {
        const res = await axios.post('/api/projects/list', {
          page: 0,
          pageCount: 10,
          type: 'FUNDING',
          status: 'PROGRESS',
        });

        if (res.data.message === 'success') {
          const mapped: FundingItem[] = res.data.data.projects.map((item: any) => {
            const project = item.project;
            const optionFunding = item.optionFunding || [];

            // 옵션별 총합 계산
            const options = optionFunding.map((opt: any) => {
              const total = opt.optionFunding.reduce(
                (sum: number, f: any) => sum + (f.price || 0),
                0
              );
              return {
                optionDesc: opt.option.description,
                optionPrice: opt.option.price,
                count: opt.optionFunding.reduce(
                  (sum: number, f: any) => sum + (f.count || 0),
                  0
                ),
                total,
              };
            });

            // 자유후원 금액
            const free = item.freeFunding?.price || 0;

            // 전체 합산
            const totalPrice =
              options.reduce(
                (
                  sum: number,
                  o: { optionDesc: string; optionPrice: number; count: number; total: number }
                ) => sum + o.total,
                0
              ) + free;

            return {
              id: project.id,
              title: project.title,
              image: project.titleImg?.uri || 'https://via.placeholder.com/200',
              category: project.tags?.[0] || '기타',
              status: project.status,
              author: project.author?.nickName || '',
              completionRate: project.completionRate || 0,
              totalPrice,
              optionFunding: options,
              freeFunding: free,
              createdAt: item.freeFunding?.createdAt || project.createdAt,
            };
          });

          setFundingList(mapped);
        }
      } catch (err) {
        console.error('펀딩 내역 불러오기 실패:', err);
        Swal.fire('오류', '펀딩 내역을 불러올 수 없습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFundingList();
  }, []);

  // 뒤 화면 스크롤 막기
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 상태 컬러
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROGRESS':
        return '#4caf50';
      case 'SUCCESS':
        return '#2196f3';
      case 'FAIL':
        return '#f44336';
      case 'END':
        return '#9e9e9e';
      default:
        return '#000';
    }
  };

  // 탭별 필터링
  const filteredFundings =
    activeTab === '전체'
      ? fundingList
      : activeTab === '진행중'
      ? fundingList.filter(item => item.status === 'PROGRESS')
      : activeTab === '완료'
      ? fundingList.filter(item => ['SUCCESS', 'FAIL', 'END'].includes(item.status))
      : fundingList.filter(item => item.status === 'STOPPED');

  // 검색어 필터링
  const searchedFundings = filteredFundings.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Overlay>
      <OverlayContent>
        <OverlayHeader>
          <h2>펀딩 내역</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </OverlayHeader>

        <ScrollableContent>
          <Tabs>
            <TabGroup>
              {['전체', '진행중', '완료', '취소'].map(tab => (
                <Tab
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab}
                </Tab>
              ))}
            </TabGroup>
          </Tabs>

          <SearchBox
            type="text"
            placeholder="펀딩명 검색"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <div>펀딩 내역을 불러오는 중입니다...</div>
            </LoadingContainer>
          ) : searchedFundings.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>펀딩 내역이 없습니다.</EmptyText>
              <EmptySubText>새로운 프로젝트에 펀딩해보세요!</EmptySubText>
            </EmptyState>
          ) : (
            <>
              <FundingList>
                {searchedFundings.slice(0, visibleCount).map(funding => (
                  <FundingItem key={funding.id}>
                    <FundingImage src={funding.image} alt={funding.title} />
                    <FundingInfo>
                      <FundingTitle>{funding.title}</FundingTitle>
                      <FundingMeta>
                        <FundingAmount>
                          총 결제 금액: {funding.totalPrice.toLocaleString()}원
                        </FundingAmount>
                        <FundingDate>
                          {new Date(funding.createdAt).toLocaleDateString()}
                        </FundingDate>
                        <FundingStatus color={getStatusColor(funding.status)}>
                          {funding.status}
                        </FundingStatus>
                      </FundingMeta>

                      {funding.optionFunding.map((opt, i) => (
                        <OptionBox key={i}>
                          {opt.optionDesc} × {opt.count}개 —{' '}
                          {(opt.total || 0).toLocaleString()}원
                        </OptionBox>
                      ))}

                      {funding.freeFunding && funding.freeFunding > 0 && (
                        <FreeBox>자유후원: {funding.freeFunding.toLocaleString()}원</FreeBox>
                      )}

                      <FundingCategory>{funding.category}</FundingCategory>
                    </FundingInfo>
                  </FundingItem>
                ))}
              </FundingList>

              {searchedFundings.length > 5 && (
                <MoreButton
                  onClick={() => {
                    if (visibleCount < searchedFundings.length) {
                      setVisibleCount(searchedFundings.length);
                    } else {
                      setVisibleCount(5);
                    }
                  }}
                >
                  {visibleCount < searchedFundings.length ? '더보기 ▼' : '접기 ▲'}
                </MoreButton>
              )}
            </>
          )}
        </ScrollableContent>
      </OverlayContent>
    </Overlay>
  );
};

export default FundingOverlay;

/* ---------------------- Styled Components ---------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const OverlayContent = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;

  h2 {
    margin: 0;
    font-size: 1.4rem;
    color: #333;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0 10px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }
`;

const ScrollableContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 25px;
  flex: 1;
`;

const Tabs = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: -1px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  color: ${({ active }) => (active ? '#a66cff' : '#666')};
  border-bottom: 2px solid ${({ active }) => (active ? '#a66cff' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #a66cff;
  }
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 20px;
  outline: none;

  &:focus {
    border-color: #a66cff;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #a66cff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const EmptyText = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
`;

const EmptySubText = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.95rem;
`;

const FundingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FundingItem = styled.div`
  display: flex;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const FundingImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 15px;
`;

const FundingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FundingTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.05rem;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
`;

const FundingMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const FundingAmount = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
`;

const FundingDate = styled.span`
  color: #777;
  font-size: 0.9rem;
`;

const FundingStatus = styled.span<{ color: string }>`
  background-color: ${({ color }) => `${color}15`};
  color: ${({ color }) => color};
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const OptionBox = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 4px;
`;

const FreeBox = styled.div`
  font-size: 0.9rem;
  color: #8b5cf6;
  margin-top: 4px;
`;

const FundingCategory = styled.span`
  background-color: #f0f0f0;
  color: #666;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-top: auto;
`;

const MoreButton = styled.button`
  margin: 20px auto 0 auto;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.2s;

  &:hover {
    border-color: #a66cff;
    color: #a66cff;
  }
`;




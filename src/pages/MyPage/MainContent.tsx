import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { api } from '../../AxiosInstance';
import { useNavigate } from 'react-router-dom';

interface Props {
  userInfo: { name: string, nickname: string };
  fundingCount: number;
  point: number;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  onHandleClick?: (label: string) => void;
}

interface Project {
  id: number;
  title: string;
  titleImg?: { uri: string };
  completionRate: number;
  likeCount: number;
}

interface Coupon {
  id: number;
  name: string;
  percent: number;
}

const MainContent: React.FC<Props> = ({
  userInfo,
  fundingCount,
  point,
  selectedFilter,
  setSelectedFilter,
  onHandleClick,
}) => {
  //const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const API_URL = process.env.REACT_APP_API_BASE_URL
  const navigate = useNavigate()
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [couponCount, setCouponCount] = useState<number>(0);

  // ✅ 최근 본 프로젝트 API
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const response = await api.post(`/social/user/project`, {
          type: 'VIEW',
          status: 'PROGRESS',
        });
        setRecentProjects(response.data.data?.projects || []);
      } catch (error) {
        console.error('최근 본 프로젝트 불러오기 실패:', error);
      }
    };
    fetchRecentProjects();
  }, [API_URL]);

  // ✅ 쿠폰 API 연동
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get(`/social/coupon`);
        const list: Coupon[] = response.data.data || [];
        setCouponCount(list.length);
      } catch (error) {
        console.error('쿠폰 데이터 불러오기 실패:', error);
      }
    };
    fetchCoupons();
  }, [API_URL]);

  return (
    <Main>
      <Greeting>
        <h2>{userInfo.nickname}님 안녕하세요.</h2>
        <InviteBox>당신의 아이디어, 펀딩으로 연결하세요!</InviteBox>

        <StatGrid>
          {['펀딩+', '스토어', '지지서명', '알림신청', '포인트', '쿠폰'].map((label) => {
            let value: React.ReactNode = null;

            if (label === '지지서명' || label === '알림신청') {
              value = <button onClick={() => onHandleClick?.(label)}>보기</button>;
            } else if (label === '포인트') {
              value = <strong>{point.toLocaleString()}P</strong>;
            } else if (label === '펀딩+') {
              value = <strong>{fundingCount}</strong>;
            } else if (label === '스토어') {
              value = <strong>0</strong>;
            } else if (label === '쿠폰') {
              value = <strong>{couponCount}장</strong>;
            }

            return (
              <StatItem key={label}>
                <span>{label}</span>
                {value}
              </StatItem>
            );
          })}
        </StatGrid>
      </Greeting>

      <SectionTitle>최근 본 프로젝트 👀</SectionTitle>

      <ProductList>
        {recentProjects.length > 0 ? (
          recentProjects.map((p) => (
            <ProductCardNormal key={p.id} onClick={() => navigate(`/project/${p.id}`)}>
              <img
                src={
                  p.titleImg?.uri
                    ? `${API_URL}/img/${p.titleImg.uri}`
                    : 'https://via.placeholder.com/200x180?text=No+Image'
                }
                alt={p.title}
              />
              <div className="discount">{p.title}</div>
              <ProgressBar>
                <ProgressFill style={{ width: `${p.completionRate}%` }} />
              </ProgressBar>
              <ProgressText>달성률 {p.completionRate}%</ProgressText>
            </ProductCardNormal>
          ))
        ) : (
          <EmptyText>최근 본 프로젝트가 없습니다.</EmptyText>
        )}
      </ProductList>
    </Main>
  );
};

export default MainContent;

/* ---------------------- Styled Components ---------------------- */
const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: 40px 15px;
  background: #fff;
  overflow-x: hidden;
`;

const Greeting = styled.div`
  margin-bottom: 30px;

  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 12px;
  }
`;

const InviteBox = styled.div`
  background: #a66cff;
  padding: 16px;
  border-radius: 10px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #fff;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const StatItem = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;

  span {
    display: block;
    margin-bottom: 6px;
    color: #666;
  }

  button,
  strong {
    background: none;
    border: none;
    font-weight: bold;
    font-size: 15px;
    color: #333;
    cursor: pointer;
  }
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 14px;
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  padding-bottom: 20px;
  width: 100%;
  max-width: 100%;
`;

const ProductCardNormal = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  text-align: center;
  padding: 12px;
  transition: transform 0.2s;
  cursor: pointer;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
  }

  .discount {
    font-weight: bold;
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #a66cff;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const EmptyText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #999;
  grid-column: 1 / -1;
`;

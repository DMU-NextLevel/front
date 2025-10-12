import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

interface Creator {
  id: number;
  name: string;
  category?: string;
  avatar: string;
  isFollowing: boolean; // 내가 팔로우 중인지 여부
}

const FollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [creators, setCreators] = useState<Creator[]>([]);
  //const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  // ✅ 탭 전환 시 API 호출 (팔로잉 / 팔로워 각각)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          activeTab === 'following' ? '/api/following' : '/api/followers';
        const res = await axios.get(`${API_URL}${endpoint}`);

        const list = res.data.data.map((item: any) => ({
          id: item.user.id,
          name: item.user.nickName,
          avatar: item.user.img?.uri
            ? `${API_URL}/images/${item.user.img.uri}`
            : 'https://via.placeholder.com/50',
          isFollowing: item.isFollow, // 서버의 isFollow 필드 그대로 사용
        }));

        setCreators(list);
      } catch (err) {
        console.error(`${activeTab} 목록 불러오기 실패:`, err);
      }
    };

    fetchData();
  }, [activeTab]);

  // ✅ 팔로우 / 언팔로우 요청 API (POST /api/follow)
  const handleFollowToggle = async (id: number, isFollowing: boolean) => {
    try {
      const res = await axios.post(`${API_URL}/api/follow`, {
        targetId: id,
        follow: !isFollowing, // true → 팔로우, false → 언팔로우
      });

      if (res.data.message === 'success') {
        setCreators(prev =>
          prev.map(c =>
            c.id === id ? { ...c, isFollowing: !c.isFollowing } : c
          )
        );
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const { status, data } = err.response;
        console.error(`에러 (${status}): ${data.message}`);
      } else {
        console.error('팔로우 상태 변경 실패:', err);
      }
    }
  };

  // ✅ 스크롤 잠금 관련 (UX 유지)
  const handleMouseEnter = () => {
    document.body.style.overflow = 'hidden';
  };
  const handleMouseLeave = () => {
    document.body.style.overflow = '';
  };
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <h1>{activeTab === 'following' ? '팔로잉' : '팔로워'}</h1>
      </Header>

      {/* ✅ 탭 메뉴 */}
      <TabMenu>
        <TabItem
          active={activeTab === 'following'}
          onClick={() => setActiveTab('following')}
        >
          내가 팔로우한 크리에이터
        </TabItem>
        <TabItem
          active={activeTab === 'followers'}
          onClick={() => setActiveTab('followers')}
        >
          나를 팔로우한 크리에이터
        </TabItem>
      </TabMenu>

      {/* ✅ 목록 영역 */}
      <CreatorList onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {creators.length > 0 ? (
          creators.map((creator) => (
            <CreatorItem key={creator.id}>
              <CreatorInfo>
                <Avatar src={creator.avatar} alt={creator.name} />
                <div>
                  <CreatorName>{creator.name}</CreatorName>
                  {creator.category && (
                    <CreatorCategory>{creator.category}</CreatorCategory>
                  )}
                </div>
              </CreatorInfo>
              <FollowButton
                following={creator.isFollowing}
                onClick={() => handleFollowToggle(creator.id, creator.isFollowing)}
              >
                {creator.isFollowing ? '팔로잉' : '팔로우'}
              </FollowButton>
            </CreatorItem>
          ))
        ) : (
          <EmptyText>
            {activeTab === 'followers'
              ? '아직 나를 팔로우한 사용자가 없습니다.'
              : '아직 내가 팔로우한 사용자가 없습니다.'}
          </EmptyText>
        )}
      </CreatorList>
    </Container>
  );
};

export default FollowingPage;

/* ---------------------- Styled Components ---------------------- */
const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background: linear-gradient(135deg, #8a2be2 0%, #a66cff 100%);
  color: white;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 auto;
    letter-spacing: -0.5px;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  cursor: pointer;
  position: absolute;
  left: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }
`;

const TabMenu = styled.div`
  display: flex;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
`;

const TabItem = styled.div<{ active: boolean }>`
  flex: 1;
  text-align: center;
  padding: 18px 0;
  font-size: 15px;
  color: ${({ active }) => (active ? '#8a2be2' : '#888')};
  font-weight: ${({ active }) => (active ? '600' : '500')};
  border-bottom: 3px solid ${({ active }) => (active ? '#a66cff' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #8a2be2;
  }
`;

const CreatorList = styled.div`
  flex-shrink: 0;
  background: #fff;
  overflow-y: auto;
  max-height: 450px;
  padding: 15px 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #d0c0ff #f8f9fa;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c5b4ff;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f8f9fa;
  }
`;

const CreatorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  border-radius: 12px;
  background: #fff;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #e0e0e0;
  }
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
  min-width: 0;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CreatorName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CreatorCategory = styled.div`
  font-size: 13px;
  color: #666;
  background: #f8f9fa;
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
`;

const FollowButton = styled.button<{ following: boolean }>`
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid ${({ following }) => (following ? '#e0e0e0' : '#8a2be2')};
  background-color: ${({ following }) => (following ? '#fff' : '#8a2be2')};
  color: ${({ following }) => (following ? '#666' : '#fff')};
  min-width: 90px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    ${({ following }) =>
      !following && 'background: #7b1fa2; border-color: #7b1fa2;'}
    ${({ following }) =>
      following && 'background: #f8f9fa; color: #555; border-color: #ddd;'}
  }
`;

const EmptyText = styled.div`
  text-align: center;
  color: #999;
  padding: 60px 0;
`;


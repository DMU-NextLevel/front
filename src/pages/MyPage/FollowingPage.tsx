import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface Creator {
  id: number;
  name: string;
  category: string;
  isFollowing: boolean;
  avatar: string;
}

const FollowingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');

  const [creators, setCreators] = useState<Creator[]>([
    { id: 1, name: '김민수', category: '테크/가전', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: '이지은', category: '패션/잡화', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 3, name: '박준호', category: '취미/DIY', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 4, name: '최유진', category: '교육/키즈', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 5, name: '홍길동', category: '푸드/리뷰', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 6, name: '김하늘', category: '여행/라이프', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 7, name: '이서준', category: '자동차/테크', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 8, name: '한지원', category: '헬스/운동', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 9, name: '정우성', category: '라이프/브이로그', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
    { id: 10, name: '강채원', category: '뷰티/패션', isFollowing: true, avatar: 'https://via.placeholder.com/50' },
  ]);

  const handleFollowToggle = (id: number) => {
    setCreators(creators.map(creator => 
      creator.id === id 
        ? { ...creator, isFollowing: !creator.isFollowing } 
        : creator
    ));
  };

  // ✅ 마우스 들어오면 body 스크롤 잠그기
  const handleMouseEnter = () => {
    document.body.style.overflow = 'hidden';
  };

  // ✅ 마우스 나가면 스크롤 다시 허용
  const handleMouseLeave = () => {
    document.body.style.overflow = '';
  };

  // 혹시 컴포넌트가 언마운트될 때도 안전하게 복원
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <h1>팔로잉</h1>
      </Header>
      
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

      <CreatorList 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {creators.map(creator => (
          <CreatorItem key={creator.id}>
            <CreatorInfo>
              <Avatar src={creator.avatar} alt={creator.name} />
              <div>
                <CreatorName>{creator.name}</CreatorName>
                <CreatorCategory>{creator.category}</CreatorCategory>
              </div>
            </CreatorInfo>
            <FollowButton 
              following={creator.isFollowing}
              onClick={() => handleFollowToggle(creator.id)}
            >
              {creator.isFollowing ? '팔로잉' : '팔로우'}
            </FollowButton>
          </CreatorItem>
        ))}
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
  max-height: 450px; /* 5명만 보이게 */
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
    ${({ following }) => !following && 'background: #7b1fa2; border-color: #7b1fa2;'}
    ${({ following }) => following && 'background: #f8f9fa; color: #555; border-color: #ddd;'}
  }
`;

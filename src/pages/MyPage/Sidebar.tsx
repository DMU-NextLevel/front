import React from 'react';
import styled from 'styled-components';

interface SidebarProps {
  activeTab: '서포터' | '메이커';
  setActiveTab: (tab: '서포터' | '메이커') => void;
  userInfo: { name: string };
  profileImage: string | null;
  onOpenSettings: () => void;
  onOpenRecent: () => void;
  onOpenPoint: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userInfo,
  profileImage,
  onOpenSettings,
  onOpenRecent,
  onOpenPoint,
}) => {
  return (
    <Container>
      {/* 탭 버튼 */}
      <TopTab>
        <TabButton active={activeTab === '서포터'} onClick={() => setActiveTab('서포터')}>
          서포터
        </TabButton>
        <TabButton active={activeTab === '메이커'} onClick={() => setActiveTab('메이커')}>
          메이커
        </TabButton>
      </TopTab>

      {/* 프로필 영역 */}
      <ProfileBox>
        <AvatarImg
          src={
            profileImage ||
            'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA2MjVfMTkz%2FMDAxNzE5MjkxMTA5MzY4.6JsIEfv3ged1X5Tm8X64E27sIL935yGSV-9T_pNE9sUg.txCrKMz0Emxy98jwwxnmWi8mqcU91uaLyXx88Z1X1iQg.JPEG%2FB7A00E50-ABFD-43A4-AE4C-9901F147A4DC.jpeg&type=sc960_832'
          }
          alt="프로필"
        />
        <Name>{userInfo.name}</Name>
        <SettingsBtn onClick={onOpenSettings}>내 정보 설정</SettingsBtn>
      </ProfileBox>

      {/* 탭에 따라 다른 메뉴 */}
      {activeTab === '서포터' ? (
        <ActivityMenu>
          <MenuButton onClick={onOpenRecent}>최근본</MenuButton>
          <MenuButton onClick={onOpenPoint}>포인트 충전</MenuButton>
          <MenuButton>좋아요</MenuButton>
          <MenuButton>팔로잉</MenuButton>
          <MenuButton>펀딩 목록</MenuButton>
        </ActivityMenu>
      ) : (
        <ActivityMenu>
          <MenuButton>내 프로젝트</MenuButton>
          <MenuButton>정산 관리</MenuButton>
          <MenuButton>문의 답변</MenuButton>
        </ActivityMenu>
      )}
    </Container>
  );
};

export default Sidebar;

const Container = styled.aside`
  width: 260px;
  background: #fff;
  padding: 30px 20px;
  border-right: 1px solid #eee;
`;

const TopTab = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 30px;
`;

const TabButton = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 20px;
  background: ${({ active }) => (active ? '#a66cff' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#999')};
  font-weight: bold;
  cursor: pointer;
`;

const ProfileBox = styled.div`
  text-align: center;
  margin: 30px 0;
`;

const AvatarImg = styled.img`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-weight: bold;
  margin: 10px 0;
  font-size: 16px;
`;

const SettingsBtn = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: white;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
  }
`;

const ActivityMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  font-size: 15px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #ecebf5;
  }
`;

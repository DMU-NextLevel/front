import React, { useState } from 'react';
import styled from 'styled-components';

const Header = styled.header`
  width: 100%;
  height: 60px;
  background: #f9fafb;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 40px;
  position: relative;
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
`;

const ProfilePopup = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 50px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 20px;
  z-index: 100;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  transform: translateY(${({ visible }) => (visible ? '0' : '-10px')});
  transition: all 0.25s ease;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const Banner = styled.div`
  background: linear-gradient(to right, #5e60ce, #4361ee);
  border-radius: 10px 10px 0 0;
  padding: 20px;
  text-align: center;
  color: white;
`;

const BannerImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: 10px;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 17px;
  margin-top: 10px;
`;

const Email = styled.div`
  font-size: 14px;
  color: #374151;
  margin-top: 10px;
`;

const Department = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
`;

const Settings = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 12px;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #4b5563;
  cursor: pointer;

  i {
    font-size: 18px;
    margin-bottom: 4px;
  }

  &:hover {
    color: #2563eb;
  }
`;

const ProfileHeader: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Header>
      <AvatarWrapper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar src="https://placehold.co/100x100?text=User" alt="사용자 프로필" />
        <ProfilePopup visible={isHovered}>
          <Banner>
            <i className="fas fa-volume-up" style={{ fontSize: '18px', float: 'right' }} />
            <BannerImg src="https://placehold.co/100x100?text=User" alt="프로필" />
            <Name>위하고 사원</Name>
          </Banner>
          <Email>wehago@wehago.net</Email>
          <Department>더존비즈온 &gt; DBP본부</Department>
          <Settings>
            <SettingItem>
              <i className="fas fa-user"></i>
              개인설정
            </SettingItem>
            <SettingItem>
              <i className="fas fa-th"></i>
              위젯설정
            </SettingItem>
            <SettingItem>
              <i className="fas fa-building"></i>
              회사설정
            </SettingItem>
            <SettingItem>
              <i className="fas fa-cog"></i>
              배경설정
            </SettingItem>
          </Settings>
        </ProfilePopup>
      </AvatarWrapper>
    </Header>
  );
};

export default ProfileHeader;

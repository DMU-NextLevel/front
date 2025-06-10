import React, { useState } from 'react';
import styled from 'styled-components';


const BannerWrapper = styled.div`
  margin: 40px auto 0 auto;
  text-align: left;
  background-image: url('/123.png');  // <-- public 폴더 기준 경로
  background-size: cover;
  background-position: center;
`;

const BannerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: white;
  background: linear-gradient(to right, #9b5de5, #5a58f1);
  padding: 12px 24px;
  border-radius: 12px;
  margin-bottom: 16px;
`;


const TitleButton = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: white;
  background: linear-gradient(to right, #9b5de5, #5a58f1);
  padding: 12px 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.85;
  }
`;

const FollowProjectBanner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <BannerWrapper>
      <BannerContent>
        <TitleButton onClick={handleLogin}>
          {isLoggedIn ? '팔로워 / 위더 프로젝트 보기' : 'WithU 로그인 후 보기'}
        </TitleButton>
      </BannerContent>
    </BannerWrapper>
  );
};

export default FollowProjectBanner;

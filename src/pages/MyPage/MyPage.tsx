import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { api } from '../../AxiosInstance';

// 쪼갠 컴포넌트들
import Sidebar from './Sidebar';
import SettingsOverlay from './SettingsOverlay';
import RecentOverlay from './RecentOverlay';
import PointOverlay from './PointOverlay';
import LikeOverlay from './LikeOverlay';
import FundingOverlay from './FundingOverlay';
import MainContent from './MainContent';

const MyPage = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  const [fundingCount, setFundingCount] = useState<number>(0);

  const [homePhone, setHomePhone] = useState({ area: '02', number: '' });
  const [showRecentView, setShowRecentView] = useState(false);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [showPointOverlay, setShowPointOverlay] = useState(false);
  const [showLikeOverlay, setShowLikeOverlay] = useState(false);
  const [showFundingOverlay, setShowFundingOverlay] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);

  const [point, setPoint] = useState(0);
  const [activeTab, setActiveTab] = useState<'서포터' | '메이커'>('서포터');

  const [userInfo, setUserInfo] = useState({
    name: '김찬영',
    nickname: '넥스트레벨',
    phone: '010-6672-6024',
    email: 'kcy021216@gmail.com',
    password: '비밀번호 변경하기',
    passwordcf: '비밀번호 확인',
  });
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  // ✅ editFields 추가
  const [editFields, setEditFields] = useState<{ [key: string]: boolean }>({});

  const [selectedFilter, setSelectedFilter] = useState("전체");

  // 📌 공통 닫기
  const closeAll = () => {
    setShowRecentView(false);
    setShowSettingsOverlay(false);
    setShowPointOverlay(false);
    setShowLikeOverlay(false);
    setShowFundingOverlay(false);
  };

  // 📌 클릭 핸들러
  const handleClick = (label: string) => {
    closeAll();
    if (label === '최근본') setShowRecentView(true);
    else if (label === '내 정보 설정') setShowSettingsOverlay(true);
    else if (label === '좋아요') setShowLikeOverlay(true);
    else if (label === '포인트 충전') {
      setShowPointOverlay(true);
      api.get('/social/user/my-point').then((res) => setPoint(res.data.data.point));
    } else if (label === '펀딩 목록') {
      setShowFundingOverlay(true);
    } else {
      Swal.fire({
        icon: 'info',
        title: `${label} 기능은 준비 중입니다.`,
        confirmButtonColor: '#a66cff',
      });
    }
  };

  // 📌 Toss 결제 팝업 열기
  const openPaymentWindow = (amount: number) => {
    const width = 700;
    const height = 900;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const url = `/popup-payment?amount=${amount}`;

    window.open(
      url,
      'toss_payment_popup',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`
    );

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === 'payment-success') {
        api.get('/social/user/my-point').then((res) => {
          setPoint(res.data.data.point);
        });

        window.removeEventListener('message', messageListener);
      }
    };

    window.addEventListener('message', messageListener);
  };

  // ✅ 핸들러 추가
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setTempUserInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleHomePhoneChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHomePhone((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (field: string) => {
    setEditFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTempProfileImage(URL.createObjectURL(file));
    }
  };

  const handleResetClick = () => {
    setTempUserInfo(userInfo);
    setTempProfileImage(profileImage);
    setEditFields({});
  };

  // 📌 API - 펀딩 카운트
  useEffect(() => {
    api.post('/public/project/all', { tag: [], page: 0, myPageWhere: 'PROJECT' })
      .then(res => setFundingCount(res.data.data.totalCount))
      .catch(e => console.log(e));
  }, []);

  return (
    <Container>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userInfo={userInfo}
        profileImage={profileImage}
        onOpenSettings={() => handleClick('내 정보 설정')}
        onOpenRecent={() => handleClick('최근본')}
        onOpenPoint={() => handleClick('포인트 충전')}
        onOpenLike={() => handleClick('좋아요')}
        onOpenFunding={() => handleClick('펀딩 목록')}
      />

      <MainContent
        userInfo={userInfo}
        fundingCount={fundingCount}
        point={point}
        onHandleClick={handleClick}
      />

      {showSettingsOverlay && (
        <SettingsOverlay
          userInfo={userInfo}
          tempUserInfo={tempUserInfo}
          setUserInfo={setUserInfo}
          profileImage={profileImage}
          tempProfileImage={tempProfileImage}
          setTempUserInfo={setTempUserInfo}
          setTempProfileImage={setTempProfileImage}
          setProfileImage={setProfileImage} 
          homePhone={homePhone}
          setHomePhone={setHomePhone}
          editFields={editFields}
          setEditFields={setEditFields}
          onReset={handleResetClick}
          onInputChange={handleInputChange}
          onHomePhoneChange={handleHomePhoneChange}
          onEditClick={handleEditClick}
          onImageChange={handleImageChange}
          onClose={closeAll}
        />
      )}

      {showRecentView && (
        <RecentOverlay
          onClose={closeAll}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          userInfo={userInfo}
          tempUserInfo={tempUserInfo}
          profileImage={profileImage}
          tempProfileImage={tempProfileImage}
          allTags={[]}   // RecentOverlay에서 props 요구하니까 일단 빈 배열 넘김
        />
      )}

      {showPointOverlay && (
        <PointOverlay
          point={point}
          onClose={closeAll}
          openPaymentWindow={openPaymentWindow}
        />
      )}

      {showLikeOverlay && (
        <LikeOverlay
          onClose={closeAll}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      )}

      {showFundingOverlay && (
        <FundingOverlay
          onClose={closeAll}
        />
      )}
    </Container>
  );
};

export default MyPage;

/* ---------------------- Styled Components ---------------------- */
const Container = styled.div`
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
`;

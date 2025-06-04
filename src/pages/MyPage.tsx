import React, { useState, useEffect, ChangeEvent } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import { api } from '../AxiosInstance'

const MyPage = () => {

  const [homePhone, setHomePhone] = useState({
    area: '02',
    number: '',
  });

  const formatHomePhoneNumber = (input: string) => {
    const numbersOnly = input.replace(/\D/g, '').slice(0, 7); 
    if (numbersOnly.length < 4) return numbersOnly;
     return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
     };





  const products = [
    {
      id:1,
      name: '청소기',
      price: '28,000원',
      image: 'https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510',
      tags: ['가전', '음식'],
    },
    {
      id:2,
      name: '햄버거',
      price: '8,000원',
      image: 'https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510',
      tags: ['음식'],
    },
    {
      id:3,
      name: '케이스',
      price: '13,000원',
      image: 'https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510',
      tags: ['가전', '취미'],
    },
    {
      id:4,
      name: '과자',
      price: '9,000원',
      image: 'https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510',
      tags: ['음식'],
    },
    {
      id:5,
      name: '충전기',
      price: '35,000원',
      image: 'https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510',
      tags: ['가전', '핸드폰'],
    },
  ];

  const formatPhoneWithHyphen = (input: string) => {
  const numbers = input.replace(/\D/g, '').slice(0, 11); // 숫자만 추출, 최대 11자리

    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
  const [showRecentView, setShowRecentView] = useState(false);
  const [showSettingsOverlay, setShowSettingsOverlay] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPointOverlay, setShowPointOverlay] = useState(false);
  const [point, setPoint] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [activeTab, setActiveTab] = useState<'서포터' | '메이커'>('서포터');
  const [editFields, setEditFields] = useState({
    name:false,
    nickname:false,
    phone:false,
    email:false,
    password:false,
    passwordcf:false,
  });
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(profileImage);
  const [userInfo, setUserInfo] = useState({
    name: '',
    nickname: '',
    phone: '',
    email: '',
    password: '',
    passwordcf: '',
  });
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field:string) => {
    const value = e.target.value;

    if(field === 'phone'){
      const formatted = formatPhoneWithHyphen(value);
       setTempUserInfo((prev) => ({
        ...prev,
        [field]: formatted,
      }));
    } else {
      setTempUserInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleHomePhoneChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if(name ==='number'){
    const formatted = formatHomePhoneNumber(value);
    setHomePhone((prev) => ({ ...prev, number: formatted }));
    } else {
      setHomePhone((prev) => ({ ...prev, [name]:value }));
    }
  };

  const handleCharge = (amout: number) => {
    setPoint(prev => prev + amout);
  };

  const handleEditClick = (field: string) => {
    setEditFields((prev) => ({ ...prev,[field]: true}));
  };

  const handleSaveClick = (field: string) => {
  setEditFields((prev) => ({ ...prev, [field]: false }));
  setUserInfo(tempUserInfo);
  };


  const handleResetClick = () => {
  setTempUserInfo(userInfo);
  setTempProfileImage(profileImage);
  setEditFields({
    name:false,
    nickname:false,
    phone:false,
    email:false,
    password:false,
    passwordcf:false,
  });
};


  useEffect(() => {
    if(showRecentView || showSettingsOverlay || showPointOverlay){
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow='';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRecentView, showSettingsOverlay, showPointOverlay]);

  useEffect(() => {
  api.get('/social/user')
    .then(response => {
      const user = response.data.data;

      setUserInfo({
        name: user.name || '',
        nickname: user.nickName || '',
        phone: user.number || '',
        email: user.email || '',
        password: '비밀번호 변경하기',
        passwordcf: '비밀번호 확인',
      });

      setTempUserInfo({
        name: user.name || '',
        nickname: user.nickName || '',
        phone: user.number || '',
        email: user.email || '',
        password: '비밀번호 변경하기',
        passwordcf: '비밀번호 확인',
      });

      setPoint(user.point || 0);

      const areaParts = user.areaNumber?.split('-') || [];
      setHomePhone({
        area: areaParts[0] || '02',
        number: areaParts.slice(1).join('') || '',
      });

      if (user.img) {
        const imageUrl = `https://your-server.com/images/${user.img}`;
        setProfileImage(imageUrl);
        setTempProfileImage(imageUrl);
      }
    })
    .catch(error => {
      console.error('유저 정보 불러오기 실패:', error);
    });
}, []);





  const handleClick = (label: string) => {
    setShowRecentView(false);
    setShowSettingsOverlay(false);
    setShowPointOverlay(false);

    if (label === '최근본') {
      setShowRecentView(true);
    } else if (label === '내 정보 설정') {
      setShowSettingsOverlay(true);
    } else if (label === '포인트 충전'){
      setShowPointOverlay(true);
    } else {
      alert(`${label} 버튼이 눌렸습니다.`);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = selectedFilter === '전체'
  ? products
  : products.filter(p => p.tags.includes(selectedFilter));

  return (
    <Container>
      {showRecentView && (
        <RecentOverlay>
          <OverlayHeader>
            <h2>나의 활동</h2>
            <CloseButton 
              onClick={() =>{ 
                const hasChanges = 
                  JSON.stringify(userInfo) !== JSON.stringify(tempUserInfo) ||
                  profileImage !==  tempProfileImage;

                  if (hasChanges){
                    Swal.fire({
                      icon: 'warning',
                      title: '변경 사항이 저장되지 않았습니다',
                      text: '입력한 내용이 저장되지 않은 채 창이 닫힙니다.',
                      confirmButtonColor: '#a66cff',
                    });
                  }

                  setShowSettingsOverlay(false);
                }}
                >
                  x
                </CloseButton>
          </OverlayHeader>
          <ScrollableContent>
            <Tabs>
              <TabGroup>
                <ActiveTab>최근 본</ActiveTab>
              </TabGroup>
              <FilterGroup>
                {['전체', ...allTags].map((cat) => (
                  <FilterBtn 
                  key={cat} 
                  active={selectedFilter ===cat} 
                  onClick={() => setSelectedFilter(cat)}
                >
                  {cat}
                  </FilterBtn>
                ))}
              </FilterGroup>
            </Tabs>
            <ItemCount>전체 {filteredProducts.length}개</ItemCount>
            <ProductColumn>
              {filteredProducts.map((item) => (
  <ProductCardOverlay key={item.id}>
    <img src={item.image} alt={item.name} />
    <CardContent>
      <Price><span>{item.price}</span></Price>
      <p>{item.name}</p>
      <HashtagList>
        {item.tags.map((tag, i) => (
          <Hashtag key={i}>#{tag}</Hashtag>
        ))}
      </HashtagList>
    </CardContent>
  </ProductCardOverlay>
))}

                 
            </ProductColumn>
          </ScrollableContent>
        </RecentOverlay>
      )}
      {showPointOverlay && (
        <Overlay>
         <OverlayHeader>
          <h2>포인트 충전</h2>
           <CloseButton onClick={() => setShowPointOverlay(false)}>×</CloseButton>
         </OverlayHeader>
          <OverlayContent>
      <PointAmount>현재 보유 포인트: <strong>{point.toLocaleString()}P</strong></PointAmount>
      <ChargeBox>
        <p>충전하실 금액을 선택하세요</p>
        <ChargeOptions>
          {[1000, 5000, 10000, 20000].map((amount) => (
            <ChargeBtn key={amount} onClick={() => handleCharge(amount)}>
              {amount.toLocaleString()}P
            </ChargeBtn>
          ))}
        </ChargeOptions>
      </ChargeBox>
    </OverlayContent>
  </Overlay>
)}
      {showSettingsOverlay && (
        <SettingsOverlay>
          <OverlayHeader>
            <h2>내 정보 설정</h2>
            <CloseButton onClick={() => setShowSettingsOverlay(false)}>×</CloseButton>
          </OverlayHeader>
          <ScrollableContent>
            <div style={{textAlign:'center', marginBottom:'24px'}}>
              <ImageInputLabel>
              <AvatarImg
                src={
                  tempProfileImage || profileImage ||
                  'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA2MjVfMTkz%2FMDAxNzE5MjkxMTA5MzY4.6JsIEfv3ged1X5Tm8X64E27sIL935yGSV-9T_pNE9sUg.txCrKMz0Emxy98jwwxnmWi8mqcU91uaLyXx88Z1X1iQg.JPEG%2FB7A00E50-ABFD-43A4-AE4C-9901F147A4DC.jpeg&type=sc960_832'
                }
                alt="프로필"
                style={{width:'100px', height:'100px'}}
                />
            </ImageInputLabel>
            <HiddenFileInput
              id='profile-upload-settings'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              />
              <div style={{display:'flex', justifyContent:'center'}}>
              <ChangeBtn as='label' htmlFor='profile-upload-settings' style={{marginTop:'10px'}}>
                이미지변경
              </ChangeBtn>
            </div>
            </div>
  {[
    { label: '이름', field: 'name' },
    { label: '닉네임', field: 'nickname' },
    { label: '전화번호', field: 'phone' },
    { label: '이메일 주소', field: 'email' },
    { label: '비밀번호', field: 'password' },
    { label: '비밀번호 확인', field: 'passwordcf'}
  ].map(({ label, field }) => (
    <InfoItem key={field}>
      <Label>
        {label}
        {['이름', '닉네임', '전화번호', '이메일 주소'].includes(label) && (
          <RequiredMark> *</RequiredMark>
        )}
        </Label>
      <Content>
        {editFields [field as keyof typeof editFields] ? (
          <input
            type="text"
            value={tempUserInfo[field as keyof typeof tempUserInfo]}
            onChange={(e) => handleInputChange(e, field)}
          />
        ) : (
          tempUserInfo[field as keyof typeof tempUserInfo]
        )}
      </Content>
      {editFields[field as keyof typeof editFields] ? (
        <ChangeBtn onClick={() => {
          setEditFields((prev) => ({...prev, [field]: false}));
        }}>변경완료</ChangeBtn>
      ) : (
        <ChangeBtn onClick={() => handleEditClick(field)}>변경</ChangeBtn>
      )}
    </InfoItem>
  ))}

  <InfoItem>
  <Label>집전화번호</Label>
  <FlexRow>
    <AreaSelect
      name="area"
      value={homePhone.area}
      onChange={handleHomePhoneChange}
    >
      <option value="02">02 (서울)</option>
      <option value="031">031 (경기)</option>
      <option value="032">032 (인천)</option>
      <option value="033">033 (강원)</option>
      <option value="041">041 (충남)</option>
      <option value="042">042 (대전)</option>
      <option value="043">043 (충북)</option>
      <option value="044">044 (세종)</option>
      <option value="051">051 (부산)</option>
      <option value="052">052 (울산)</option>
      <option value="053">053 (대구)</option>
      <option value="054">054 (경북)</option>
      <option value="055">055 (경남)</option>
      <option value="061">061 (전남)</option>
      <option value="062">062 (광주)</option>
      <option value="063">063 (전북)</option>
      <option value="064">064 (제주)</option>

    </AreaSelect>
    <HomePhoneInput
      name="number"
      type="text"
      maxLength={8}
      placeholder="전화번호를 입력해주세요."
      value={homePhone.number}
      onChange={handleHomePhoneChange}
    />
  </FlexRow>
</InfoItem>

</ScrollableContent>
  <OverlayFooter>

  <ChangeBtn onClick={handleResetClick}>초기화</ChangeBtn>

  <ChangeBtn 
    onClick={async () => {

      const {name, nickname, phone, email } = tempUserInfo;

      if( !name.trim() || !nickname.trim() || !phone.trim() || !email.trim()) {
        await Swal.fire({
          icon:'error',
          title: '필수 항목을 입력해주세요.',
          text: '이름, 닉네임, 전화번호, 이메일은 필수입니다.',
          confirmButtonColor:'#a66cff',
        });
        return;
      }

      const result = await Swal.fire({
        title: '변경사항을 저장할까요?',
        text: '입력한 정보가 저장됩니다.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '저장',
        cancelButtonText: '취소',
        confirmButtonColor: '#A66CFF',
        cancelButtonColor: '#ddd',
  });

  if (result.isConfirmed) {
    setUserInfo(tempUserInfo);
    setProfileImage(tempProfileImage);
    setEditFields({
      name: false,
      nickname: false,
      phone: false,
      email: false,
      password: false,
      passwordcf: false,
    });

    await Swal.fire({
      icon: 'success',
      title: '정보가 변경되었습니다!',
      showConfirmButton: false,
      timer: 1500,
    });

    setShowSettingsOverlay(false);
  }
}}>
  완료
</ChangeBtn>


</OverlayFooter>

 </SettingsOverlay>
 
      )}

      <Sidebar>
  {/* 탭 버튼 */}
  <TopTab>
    <TabButton active={activeTab === '서포터'} onClick={() => setActiveTab('서포터')}>서포터</TabButton>
    <TabButton active={activeTab === '메이커'} onClick={() => setActiveTab('메이커')}>메이커</TabButton>
  </TopTab>

  {/* 프로필 영역 */}
  <ProfileBox>
    <ImageInputLabel>
      <AvatarImg src={profileImage || 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA2MjVfMTkz%2FMDAxNzE5MjkxMTA5MzY4.6JsIEfv3ged1X5Tm8X64E27sIL935yGSV-9T_pNE9sUg.txCrKMz0Emxy98jwwxnmWi8mqcU91uaLyXx88Z1X1iQg.JPEG%2FB7A00E50-ABFD-43A4-AE4C-9901F147A4DC.jpeg&type='} alt="프로필" /> 
    </ImageInputLabel>
    <HiddenFileInput id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} />
    <Name>{userInfo.name}</Name>
    <SettingsBtn onClick={() => handleClick('내 정보 설정')}>내 정보 설정</SettingsBtn>
  </ProfileBox>

  {/* 탭에 따라 다른 메뉴 출력 */}
  {activeTab === '서포터' ? (
    <ActivityMenu>
      {['최근본', '포인트 충전', '좋아요', '팔로잉', '펀딩 목록'].map((item) => (
        <MenuButton key={item} onClick={() => handleClick(item)}>
          {item} {item === '친구초대' && <span className="highlight">5,000P</span>}
        </MenuButton>
      ))}
    </ActivityMenu>
  ) : (
    <ActivityMenu>
      {['내 프로젝트', '정산 관리', '문의 답변'].map((item) => (
        <MenuButton key={item} onClick={() => alert(`${item} 클릭됨`)}>{item}</MenuButton>
      ))}
    </ActivityMenu>
  )}
</Sidebar>


      <Main>
        <Greeting>
          <h2>{userInfo.name}님 안녕하세요.</h2>
          <InviteBox>뭘 넣을까요??</InviteBox>
          <StatGrid>
  {['펀딩+', '스토어', '지지서명', '알림신청', '포인트', '쿠폰'].map((label) => {
    let value: React.ReactNode;

    if (label === '지지서명' || label === '알림신청') {
      value = <button onClick={() => handleClick(label)}>보기</button>;
    } else if (label === '포인트') {
      value = <strong>{point.toLocaleString()}P</strong>;
    } else if (label === '펀딩+') {
      value = <strong>1</strong>;
    } else if (label === '스토어') {
      value = <strong>0</strong>;
    } else if (label === '쿠폰') {
      value = <strong>2장</strong>;
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
          {[...Array(5)].map((_, i) => (
            <ProductCardNormal key={i}>
              <img
                src="https://shop-phinf.pstatic.net/20220615_163/1655256234926pHmSR_JPEG/56392121446286841_1599012163.jpg?type=m510"
                alt={`상품${i + 1}`}
              />
              <div className="discount">28,000원</div>
            </ProductCardNormal>
          ))}
        </ProductList>
      </Main>
    </Container>
  );
};

export default MyPage;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -55%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const Container = styled.div`
  display: flex;
  padding:  15px 15px;
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: #fff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #eee;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const RequiredMark = styled.span`
  color: #a66cff;
  font-size: 16px;
  margin-left: 4px;
`;



const MenuButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  font-size: 15px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  .highlight {
    color: #A66CFF;
    font-weight: bold;
  }

  &:hover {
    background: #ecebf5;
  }
`;

const ProfileBox = styled.div`
  text-align: center;
  margin: 30px 0;
`;

const Avatar = styled.div`
  font-size: 48px;
  cursor: pointer;
`;

const AvatarImg = styled.img`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  object-fit: cover;
  pointer-events:none;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 8px;
`;

const AreaSelect = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const HomePhoneInput = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImageInputLabel = styled.label`
  display: inline-block;
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

const Main = styled.main`
  flex: 1;
  padding: 40px 15px;
  background: #fff;
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
  background: #A66CFF;
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

  button, strong {
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
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 20px;
`;

const ProductCardNormal = styled.div`
  min-width: 140px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  text-align: center;
  padding: 12px;

  img {
    border-radius: 8px;
    width: 300px;
    height: 180px;
    object-fit: cover;
  }

  .discount {
    font-weight: bold;
    margin-top: 10px;
    font-size: 14px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  z-index: 1000;
`;

const OverlayContent = styled.div`
  margin-top: 20px;
`;

const PointAmount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const ChargeBox = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
`;

const ChargeOptions = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ChargeBtn = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background: #A66CFF;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;

  &:hover {
    background: #8e4ae0;
  }
`;

const ProductCardOverlay = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0px;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`

const RecentOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  background: #fff;
  z-index: 999;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SettingsOverlay = styled(RecentOverlay)``;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }
`;

const CloseButton = styled.button`
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TabGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Tab = styled.div`
  font-size: 16px;
  color: #999;
  cursor: pointer;
`;

const ActiveTab = styled(Tab)`
  font-weight: bold;
  color: #000;
  border-bottom: 2px solid #000;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  background: ${({ active }) => (active ? '#000' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  cursor: pointer;
  font-weight: 500;
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const ProductColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const CardContent = styled.div`
  padding: 10px;

  p {
    font-size: 13px;
    color: #333;
    margin-top: 6px;
  }
`;

const Price = styled.div`
  font-size: 14px;
  color: #A66CFF;

  span {
    font-weight: bold;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  width: 180px;
  font-weight: bold;
  font-size: 15px;
  color: #333;
`;

const Content = styled.div`
  flex: 1;
  font-size: 14px;
  color: #666;

  input {
    width : 100%;
    padding : 6px 10px;
    font-size : 14px;
    border : 1px solid #ccc;
    border-radius : 6px;
  }

  a {
    color: #666;
    text-decoration: underline;
  }
`;

const ChangeBtn = styled.button`
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

  const OverlayFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const HashtagList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Hashtag = styled.span`
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
`;


import React from 'react';
import styled from 'styled-components';

interface Props {
  userInfo: { name: string };
  fundingCount: number;
  point: number;
  onHandleClick: (label: string) => void; // ✅ 이름 변경
}

const MainContent: React.FC<Props> = ({ userInfo, fundingCount, point, onHandleClick }) => {
  return (
    <Main>
      <Greeting>
        <h2>{userInfo.name}님 안녕하세요.</h2>
        <InviteBox>당신의 아이디어, 펀딩으로 연결하세요!</InviteBox>
        <StatGrid>
          {['펀딩+', '스토어', '지지서명', '알림신청', '포인트', '쿠폰'].map((label) => {
            let value: React.ReactNode;

            if (label === '지지서명' || label === '알림신청') {
              value = <button onClick={() => onHandleClick(label)}>보기</button>;
            } else if (label === '포인트') {
              value = <strong>{point.toLocaleString()}P</strong>;
            } else if (label === '펀딩+') {
              value = <strong>{fundingCount}</strong>;
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
  );
};

export default MainContent;

/* ---------------------- Styled Components ---------------------- */
const Main = styled.main`
  flex: 1;
  min-width: 0; // ✅ flex-child overflow 방지
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* ✅ 간격 여유 */
  gap: 24px; /* ✅ 사진 간격 넓게 */
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
  }

  &:hover {
    transform: scale(1.02);
  }
`;

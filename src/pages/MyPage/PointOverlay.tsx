import React from 'react';
import styled from 'styled-components';

interface Props {
  point: number;
  onClose: () => void;
  openPaymentWindow: (amount: number) => void;
}

const PointOverlay: React.FC<Props> = ({ point, onClose, openPaymentWindow }) => {
  return (
    <Backdrop>
      <Overlay>
        <OverlayHeader>
          <h2>포인트 충전</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </OverlayHeader>

        <OverlayContent>
          <PointAmount>
            현재 보유 포인트: <strong>{point.toLocaleString()}P</strong>
          </PointAmount>

          <ChargeBox>
            <p>충전하실 금액을 선택하세요</p>
            <ChargeOptions>
              {[1000, 5000, 10000, 20000].map((amount) => (
                <ChargeBtn key={amount} onClick={() => openPaymentWindow(amount)}>
                  {amount.toLocaleString()}P
                </ChargeBtn>
              ))}
            </ChargeOptions>
          </ChargeBox>
        </OverlayContent>
      </Overlay>
    </Backdrop>
  );
};

export default PointOverlay;

/* ---------------------- Styled Components ---------------------- */

// ✅ 반투명 배경 (클릭 막기용)
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ✅ 중앙 박스
const Overlay = styled.div`
  position: relative;
  width: 500px;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  z-index: 3000;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// ✅ 상단 헤더
const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 22px;
    font-weight: bold;
  }
`;

// ✅ 닫기 버튼
const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 26px;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  z-index: 9999;
  transition: color 0.2s;

  &:hover {
    color: #a66cff;
  }
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

  p {
    margin-bottom: 10px;
    font-size: 15px;
    color: #333;
  }
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
  background: #a66cff;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #8e4ae0;
    transform: translateY(-2px);
  }
`;

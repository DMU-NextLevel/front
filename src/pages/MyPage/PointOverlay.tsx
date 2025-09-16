import React from 'react';
import styled from 'styled-components';

interface Props {
  point: number;
  onClose: () => void;
  openPaymentWindow: (amount: number) => void;
}

const PointOverlay: React.FC<Props> = ({ point, onClose, openPaymentWindow }) => {
  return (
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
  );
};

export default PointOverlay;

/* ---------------------- Styled Components ---------------------- */
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

const CloseButton = styled.button`
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
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

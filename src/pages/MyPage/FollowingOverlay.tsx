import React from 'react';
import styled, { keyframes } from 'styled-components';

interface FollowingOverlayProps {
  onClose: () => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const FollowingOverlay: React.FC<FollowingOverlayProps> = ({
  onClose,
  selectedFilter,
  setSelectedFilter,
}) => {
  // 카테고리 목록
  const categories = [
    '전체',
    '테크/가전',
    '패션/잡화',
    '취미/DIY',
    '교육/키즈',
    '여행/레저',
    '라이프스타일',
    '뷰티/헬스',
    '게임',
    '반려동물',
    '푸드/음료',
  ];

  return (
    <Overlay>
      <OverlayContent>
        <OverlayHeader>
          <h2>팔로잉 목록</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </OverlayHeader>

        <ScrollableContent>
          {/* 카테고리 필터 */}
          <FilterGroup>
            {categories.map((cat) => (
              <FilterBtn
                key={cat}
                active={selectedFilter === cat}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat}
              </FilterBtn>
            ))}
          </FilterGroup>

          <ItemCount>팔로잉 중인 크리에이터가 없습니다.</ItemCount>
        </ScrollableContent>
      </OverlayContent>
    </Overlay>
  );
};

export default FollowingOverlay;

/* ---------------------- Styled Components ---------------------- */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const OverlayContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const OverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;

  h2 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px 10px;
  color: #333;
  font-weight: bold;

  &:hover {
    color: #a66cff;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding-bottom: 5px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterBtn = styled.button<{ active: boolean }>`
  border: 1px solid ${({ active }) => (active ? '#000' : '#ddd')};
  padding: 6px 12px;
  border-radius: 16px;
  background: ${({ active }) => (active ? '#000' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
    color: ${({ active }) => (active ? '#fff' : '#000')};
  }
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  padding: 20px 0;
`;

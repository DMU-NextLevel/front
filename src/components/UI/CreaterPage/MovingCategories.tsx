import React from 'react';
import styled, { keyframes } from 'styled-components';

const moveRight = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const CategoriesContainer = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(226, 232, 240, 0.3);
`;

const MovingTrack = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  animation: ${moveRight} 150s linear infinite;
  white-space: nowrap;
`;

const CategoryItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  margin: 0 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  min-width: fit-content;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #06b6d4;
    color: #06b6d4;
  }
`;

const categories = [
  '프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버', '크리에이터',
  '1인 사업자', '프리랜서', '대기업', '중소기업', '스타트업', '인플루언서', '부업', '유튜버',
  '크리에이터', '1인 사업자', '프리랜서', '대기업', '중소기업', '스타트업', '인플루언서',
  '부업', '유튜버', '크리에이터', '1인 사업자'
];

const MovingCategories = () => {
  return (
    <CategoriesContainer>
      <MovingTrack>
        {categories.map((category, index) => (
          <CategoryItem key={index}>
            {category}
          </CategoryItem>
        ))}
      </MovingTrack>
    </CategoriesContainer>
  );
};

export default MovingCategories;

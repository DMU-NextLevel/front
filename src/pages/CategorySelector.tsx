// CategorySelector.tsx
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Category {
  label: string;
  icon: string;
  tag: string;
}

interface Props {
  categories: Category[];
  selectedTag?: string;
  onSelect?: (tag: string) => void; // 선택 콜백은 선택사항
}

const categories = [
  { label: '전체', icon: 'bi bi-circle', tag: '' },
  { label: '테크/가전', icon: 'bi bi-cpu', tag: '1' },
  { label: '라이프스타일', icon: 'bi bi-house', tag: '2' },
  { label: '패션/잡화', icon: 'bi bi-bag', tag: '3' },
  { label: '뷰티/헬스', icon: 'bi bi-heart-pulse', tag: '4' },
  { label: '취미/DIY', icon: 'bi bi-brush', tag: '5' },
  { label: '게임', icon: 'bi bi-controller', tag: '6' },
  { label: '교육/키즈', icon: 'bi bi-book', tag: '7' },
  { label: '반려동물', icon: 'bi bi-star', tag: '8' },
  { label: '여행/레저', icon: 'bi bi-airplane', tag: '9' },
  { label: '푸드/음료', icon: 'bi bi-cup-straw', tag: '10' },
]

const CategorySelector: React.FC<Props> = ({ categories }) => {
  const navigate = useNavigate();

  const handleClick = (tag: string) => {
    navigate(`/search?tag=${tag}`);
  };

  return (
    <CategoryRow>
      {categories.map((cat) => (
        <CategoryItem
          key={cat.tag}
          onClick={() => handleClick(cat.tag)}
        >
          <i className={cat.icon}></i>
          <span>{cat.label}</span>
        </CategoryItem>
      ))}
    </CategoryRow>
  );
};

export default CategorySelector;

const CategoryRow = styled.div`
  display: flex;
  overflow-x: auto;
  height: 80px;
  padding: 12px 20px;
  align-items: center;
  justify-content: space-between;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  min-width: 80px;
  color:rgb(20, 7, 41);
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 22px;
    margin-bottom: 6px;
  }

  &:hover {
    color: #A66CFF;
    font-weight: bold;
    transform: translateY(-2px);
  }
`;

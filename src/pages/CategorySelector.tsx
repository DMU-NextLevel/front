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

const CategorySelector: React.FC<Props> = ({ categories }) => {
  const navigate = useNavigate();

  const handleClick = (tag: string) => {
    navigate('/search', {
      state: { tag }
    });
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
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 22px;
    margin-bottom: 6px;
  }

  &:hover {
    color: #A66CFF;
    font-weight: bold;
  }
`;

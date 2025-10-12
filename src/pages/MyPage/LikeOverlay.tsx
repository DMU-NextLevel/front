import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: string; // 문자열로 고정 (백엔드 없으면 "-" 처리)
  image: string;
  category: string;
  tags: string[];
  isLiked: boolean;
}

interface LikeOverlayProps {
  onClose: () => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const categories = [
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

const LikeOverlay: React.FC<LikeOverlayProps> = ({
  onClose,
  selectedFilter,
  setSelectedFilter,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 표시할 카테고리
  const displayedCategories = showAllCategories
    ? ['전체', ...categories]
    : ['전체', ...categories.slice(0, 5)];

  // 좋아요 목록 불러오기
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setLoading(true);
        const res = await axios.post('/api/projects/list', {
          page: 0,
          type: 'LIKE',
        });

        if (res.data?.message === 'success') {
          const mapped: Product[] = res.data.data.projects.map((p: any) => ({
            id: p.id,
            title: p.title || '제목 없음',
            price: p.price ? `${p.price}원` : '-', // price가 없을 경우 "-"
            image: p.titleImg?.url || 'https://via.placeholder.com/200',
            category: p.tags?.[0] || '기타',
            tags: p.tags || [],
            isLiked: p.isLiked ?? false,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error('좋아요 목록 불러오기 실패:', err);
        Swal.fire('오류', '좋아요 목록을 불러올 수 없습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  // 좋아요 토글
  const toggleLike = async (productId: number, current: boolean) => {
    try {
      const res = await axios.post('/api/projects/like', {
        like: !current,
        projectId: productId,
      });

      if (res.data.message === 'success') {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, isLiked: !current } : p
          )
        );
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
      Swal.fire('오류', '좋아요 요청 실패', 'error');
    }
  };

  // 필터링된 상품
  const filteredProducts =
    selectedFilter === '전체'
      ? products
      : products.filter((p) => p.category === selectedFilter);

  // 뒤 스크롤 막기
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <Overlay>
      <OverlayContent>
        <OverlayHeader>
          <h2>좋아요 목록</h2>
          <CloseButton onClick={onClose}>×</CloseButton>
        </OverlayHeader>

        <ScrollableContent>
          {/* 카테고리 필터 */}
          <FilterGroup>
            {displayedCategories.map((cat) => (
              <FilterBtn
                key={cat}
                active={selectedFilter === cat}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat}
              </FilterBtn>
            ))}
            <MoreBtn onClick={() => setShowAllCategories(!showAllCategories)}>
              {showAllCategories ? '접기 ▲' : '더보기 ▼'}
            </MoreBtn>
          </FilterGroup>

          <ItemCount>
            전체{' '}
            {selectedFilter === '전체'
              ? products.length
              : filteredProducts.length}
            개
          </ItemCount>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              불러오는 중...
            </div>
          ) : (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCardOverlay key={product.id}>
                  <img src={product.image} alt={product.title} />
                  <CardContent>
                    <Price>
                      <span>{product.price}</span>
                    </Price>
                    <p>{product.title}</p>
                    <HashtagList>
                      {product.tags.map((tag, i) => (
                        <Hashtag key={i}>#{tag}</Hashtag>
                      ))}
                    </HashtagList>
                    <LikeButton
                      liked={product.isLiked}
                      onClick={() => toggleLike(product.id, product.isLiked)}
                    >
                      {product.isLiked ? '❤️' : '🤍'}
                    </LikeButton>
                  </CardContent>
                </ProductCardOverlay>
              ))}
            </ProductGrid>
          )}
        </ScrollableContent>
      </OverlayContent>
    </Overlay>
  );
};

export default LikeOverlay;

/* ---------------------- Styled Components ---------------------- */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  &::-webkit-scrollbar-track {
    background: #f5f5f5;
    border-radius: 3px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterBtn = styled.button<{ active: boolean }>`
  border: 1px solid ${({ active }) => (active ? '#000' : '#ddd')};
  padding: 6px 12px;
  border-radius: 16px;
  background: ${({ active }) => (active ? '#000' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
    color: ${({ active }) => (active ? '#fff' : '#000')};
  }
`;

const MoreBtn = styled.button`
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  margin-left: 4px;

  &:hover {
    color: #000;
  }
`;

const ItemCount = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  padding: 0 10px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 0 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCardOverlay = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;

  p {
    font-size: 13px;
    color: #666;
    margin: 8px 0;
  }
`;

const Price = styled.div`
  font-size: 15px;
  color: #a66cff;
  font-weight: 700;
  margin: 8px 0;
`;

const HashtagList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Hashtag = styled.span`
  font-size: 11px;
  color: #666;
  background: #f8f8f8;
  padding: 3px 10px;
  border-radius: 12px;
  line-height: 1.4;
`;

const LikeButton = styled.button<{ liked: boolean }>`
  margin-top: 10px;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  align-self: flex-end;
`;
